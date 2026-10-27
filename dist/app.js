'use strict';
const $ = (s) => document.querySelector(s);
const icon = (name) => `<svg aria-hidden="true"><use href="#${name}"/></svg>`;
const state = {from:null,to:null,rows:[],operator:'all',sort:'time',searched:false,loading:false,total:0,request:0};
let format = '12';
try { format = localStorage.getItem('neram-time-format') || '12'; } catch {}
const cache = new Map();
const pretty = (s) => String(s || '').replace(/\S+/g, w => /^[A-Z\d]+$/.test(w) ? w.charAt(0)+w.slice(1).toLowerCase() : w);
function timeLabel(value) {
 if (!value || !/^\d{2}:\d{2}$/.test(value)) return 'Time unavailable';
 if(format==='24') return value;
 const [h,m]=value.split(':').map(Number);return `${h%12||12}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`;
}
function durationLabel(n){if(n==null||n<0)return 'Duration unavailable';if(n<60)return `${n} min`;return `${Math.floor(n/60)} hr${n%60?` ${n%60} min`:''}`;}
function textNode(tag,text,cls){const el=document.createElement(tag);el.textContent=text;if(cls)el.className=cls;return el;}
async function rpc(name,body,signal){
 const config=window.NERAM_CONFIG;
 const response=await fetch(`${config.url}/rest/v1/rpc/${name}`,{method:'POST',headers:{apikey:config.publishableKey,'Content-Type':'application/json'},body:JSON.stringify(body),signal});
 if(!response.ok)throw new Error(`Timetable request failed (${response.status})`);
 return response.json();
}
async function getStops(query,signal){
 const key=query.trim().toLowerCase();
 if(cache.has(key))return cache.get(key);
 const rows=await rpc('neram_find_stops',{p_query:key},signal);
 if(cache.size>100)cache.delete(cache.keys().next().value);
 cache.set(key,rows);return rows;
}
function setupStop(id){
 const input=$(`#${id}`),list=$(`#${id}-options`),wrap=$(`#${id}-wrap`);
 let timer,controller,items=[],index=-1,version=0;
 function close(){list.hidden=true;input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');index=-1;}
 function choose(item){state[id]=item;input.value=pretty(item.name);close();clearError();invalidate();}
 function mark(){[...list.querySelectorAll('[role="option"]')].forEach((li,i)=>{li.classList.toggle('selected',i===index);li.setAttribute('aria-selected',String(i===index));});if(index>=0){input.setAttribute('aria-activedescendant',`${id}-option-${index}`);list.children[index]?.scrollIntoView({block:'nearest'});}else input.removeAttribute('aria-activedescendant');}
 function notice(message){list.replaceChildren(textNode('li',message,'notice'));}
 async function load(){
  const v=++version;controller?.abort();controller=new AbortController();items=[];list.hidden=false;input.setAttribute('aria-expanded','true');input.setAttribute('aria-busy','true');notice('Finding stops…');index=-1;
  try{const found=await getStops(input.value,controller.signal);if(v!==version||document.activeElement!==input)return;items=found;list.replaceChildren();if(!items.length)notice('No matching stops. Try another spelling.');
   items.forEach((item,i)=>{const li=document.createElement('li');li.id=`${id}-option-${i}`;li.setAttribute('role','option');li.setAttribute('aria-selected','false');li.append(textNode('span',pretty(item.name)),textNode('small',`${item.service_count.toLocaleString()} scheduled services`));li.addEventListener('mousedown',e=>e.preventDefault());li.addEventListener('click',()=>choose(item));list.append(li);});
  }catch(e){if(e.name!=='AbortError'&&v===version){items=[];notice('Stops unavailable. Check your connection.');}}finally{if(v===version)input.removeAttribute('aria-busy');}
 }
 input.addEventListener('focus',load);
 input.addEventListener('input',()=>{state[id]=null;invalidate();clearTimeout(timer);timer=setTimeout(load,220);});
 input.addEventListener('keydown',e=>{
  if(e.key==='Escape'){close();return;}
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(list.hidden){load();return;}if(items.length){index=index<0?(e.key==='ArrowDown'?0:items.length-1):(index+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;mark();}}
  if(e.key==='Enter'&&!list.hidden&&index>=0&&items[index]){e.preventDefault();choose(items[index]);}
 });
 document.addEventListener('pointerdown',e=>{if(!wrap.contains(e.target))close();});
 input.addEventListener('blur',()=>{clearTimeout(timer);controller?.abort();version++;input.removeAttribute('aria-busy');setTimeout(close,160);});
 return {close,choose};
}
const fields={from:setupStop('from'),to:setupStop('to')};
function clearError(){$('#form-error').hidden=true;}
function showError(message){$('#form-error').textContent=message;$('#form-error').hidden=false;}
function invalidate(){state.request++;if(state.searched||state.loading){state.rows=[];state.searched=false;state.loading=false;state.total=0;$('#search-form button[type="submit"]').disabled=false;$('#search-form button[type="submit"] span').textContent='Search Buses';$('#data-error').hidden=true;render();}}
async function resolveStop(id){if(state[id])return state[id];const input=$(`#${id}`);const rows=await getStops(input.value);const match=rows.find(x=>x.stop_key===input.value.trim().toLowerCase());if(match){state[id]=match;input.value=pretty(match.name);}return match;}
function departureMinutes(){const v=$('#departure-time').value;if(v==='')return null;if(v==='now'){const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());return Number(parts.find(x=>x.type==='hour').value)*60+Number(parts.find(x=>x.type==='minute').value);}return Number(v);}
async function search(){
 clearError();fields.from.close();fields.to.close();
 if(!$('#from').value.trim()||!$('#to').value.trim()){showError('Choose a departure stop and a destination stop.');(!$('#from').value.trim()?$('#from'):$('#to')).focus();return;}
 const request=++state.request;state.loading=true;state.searched=false;state.rows=[];state.total=0;$('#data-error').hidden=true;$('#search-form button[type="submit"]').disabled=true;$('#search-form button[type="submit"] span').textContent='Finding buses…';render();
 try{
  const from=await resolveStop('from'),to=await resolveStop('to');if(request!==state.request)return;
  if(!from||!to){showError('Select a matching stop from the suggestions.');state.loading=false;render();return;}
  if(from.stop_key===to.stop_key){showError('Choose two different stops for your journey.');state.loading=false;render();return;}
  const rows=await rpc('neram_search_buses',{p_from:from.stop_key,p_to:to.stop_key,p_after:departureMinutes(),p_limit:200});if(request!==state.request)return;
  state.rows=rows;state.total=Number(rows[0]?.total_matches||0);state.searched=true;state.loading=false;render();
 }catch(e){if(request!==state.request)return;state.loading=false;$('#data-error').hidden=false;$('#empty-state').hidden=true;$('#results-list').replaceChildren();$('#results-live').textContent='Timetable unavailable. Please try again.';}
 finally{if(request===state.request){state.loading=false;$('#search-form button[type="submit"]').disabled=false;$('#search-form button[type="submit"] span').textContent='Search Buses';}}
}
function render(){
 const list=$('#results-list');list.replaceChildren();$('#result-caption').hidden=true;
 if(!state.searched&&!state.loading)$('#results-live').textContent='';
 if(state.loading){$('#empty-state').hidden=true;for(let i=0;i<3;i++){const div=document.createElement('div');div.className='skeleton';div.setAttribute('aria-hidden','true');list.append(div);}$('#result-count').textContent='Searching';$('#results-live').textContent='Searching bus timetables.';return;}
 const rows=state.rows.filter(x=>state.operator==='all'||x.operator===state.operator).sort((a,b)=>{if(state.sort==='duration')return (a.duration_minutes??Infinity)-(b.duration_minutes??Infinity)||(a.departure_time||'99').localeCompare(b.departure_time||'99');return (a.departure_time||'99').localeCompare(b.departure_time||'99');});
 $('#result-count').textContent=`${rows.length} found`;
 $('#empty-state').hidden=rows.length>0||!$('#data-error').hidden;
 $('#empty-state h3').textContent=state.searched?'No direct buses found':'Where will you go next?';
 $('#empty-state p').textContent=state.searched?(state.rows.length?'Try All Buses or another operator.':'Try another stop or choose Any Time.'):'Choose your stops to find a direct bus.';
 $('.popular').hidden=state.searched;
 if(state.searched){$('#results-live').textContent=`${rows.length} buses found.`;$('#result-caption').hidden=false;const caption=`${pretty(state.from?.name)} → ${pretty(state.to?.name)} · Scheduled departures${$('#departure-time').value==='now'?' after the current time in India':''}`;$('#result-caption').textContent=state.total>state.rows.length?`${caption}. Showing the first ${state.rows.length} of ${state.total} matches; narrow by departure time.`:caption;}
 rows.forEach(row=>{
  const card=document.createElement('button');card.type='button';card.className='bus-card';card.setAttribute('aria-label',`${row.name}, ${timeLabel(row.departure_time)}. View stops`);
  const img=document.createElement('img');img.src='/assets/bus.svg';img.alt='';img.width=89;img.height=89;
  const content=document.createElement('div');content.className='bus-content';const top=document.createElement('div');top.className='bus-top';top.append(textNode('span',row.name||'Bus service','bus-name'),textNode('span',row.operator,`operator-tag ${row.operator==='Private'?'private':''}`));
  const route=document.createElement('div');route.className='bus-route';route.innerHTML='<span class="green-dot"></span>';route.append(textNode('span',`${pretty(row.origin)} → ${pretty(row.destination)}`,'route-text'));
  const duration=document.createElement('div');duration.className='bus-duration';duration.innerHTML=icon('clock');duration.append(textNode('span',durationLabel(row.duration_minutes)));
  content.append(top,route,duration);const side=document.createElement('div');side.className='bus-side';side.append(textNode('span',timeLabel(row.departure_time),'departure-badge'));side.insertAdjacentHTML('beforeend',icon('chevron'));card.append(img,content,side);card.addEventListener('click',()=>showJourney(row));list.append(card);
 });
}
let journeyRequest=0;
async function showJourney(row){
 const req=++journeyRequest;const dialog=$('#journey-dialog');$('#journey-title').textContent=row.name||'Bus journey';const summary=$('#journey-summary');summary.replaceChildren();const meta=document.createElement('div');meta.className='journey-meta';meta.append(textNode('strong',`${timeLabel(row.departure_time)} → ${timeLabel(row.arrival_time)}${row.arrival_day>0?` (+${row.arrival_day} day${row.arrival_day>1?'s':''})`:''}`),textNode('span',`${pretty(row.boarding_stop)} → ${pretty(row.alighting_stop)} · ${durationLabel(row.duration_minutes)}`));summary.append(meta);const container=$('#journey-stops');container.replaceChildren(textNode('p','Loading the route…','journey-note'));dialog.showModal();
 try{const stops=await rpc('neram_journey',{p_id:row.service_id});if(req!==journeyRequest)return;container.replaceChildren();const list=document.createElement('ol');list.className='timeline';for(const stop of stops){const li=document.createElement('li');const label=document.createElement('span');const selected=stop.sequence===row.boarding_sequence||stop.sequence===row.alighting_sequence;if(selected){li.className='selected-stop';label.append(textNode('small',stop.sequence===row.boarding_sequence?'BOARD HERE':'GET OFF HERE'));}label.append(document.createTextNode(pretty(stop.stop)));const time=textNode('time',timeLabel(stop.time));li.append(label,time);list.append(li);}container.append(list,textNode('p','Scheduled times are estimates and may change. Stops shown in route order. Confirm the service with the operator before travelling.','journey-note'));}
 catch{if(req===journeyRequest)container.replaceChildren(textNode('p','Route details are unavailable. Close this window and try again.','journey-note'));}
}
$('#search-form').addEventListener('submit',e=>{e.preventDefault();search();});
$('#swap-button').addEventListener('click',()=>{[state.from,state.to]=[state.to,state.from];const a=$('#from').value;$('#from').value=$('#to').value;$('#to').value=a;invalidate();clearError();fields.from.close();fields.to.close();});
$('#departure-time').addEventListener('change',invalidate);
document.querySelectorAll('[data-operator]').forEach(btn=>btn.addEventListener('click',()=>{state.operator=btn.dataset.operator;document.querySelectorAll('[data-operator]').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});render();}));
$('#sort-button').addEventListener('click',()=>{state.sort=state.sort==='time'?'duration':'time';$('#sort-button span').textContent=state.sort==='time'?'Sorted by Time':'Shortest Journey';render();});
$('#retry-button').addEventListener('click',search);
$('#popular-route').addEventListener('click',async()=>{try{const [from,to]=await Promise.all([getStops('aluva'),getStops('ernakulam')]);const a=from.find(x=>x.stop_key==='aluva'),b=to.find(x=>x.stop_key==='ernakulam');if(!a||!b)throw Error();fields.from.choose(a);fields.to.choose(b);search();}catch{showError('Popular journey unavailable. Please choose your stops.');}});
$('#settings-button').addEventListener('click',()=>$('#settings-dialog').showModal());
$('#time-format').value=format;
$('#time-format').addEventListener('change',e=>{format=e.target.value;try{localStorage.setItem('neram-time-format',format);}catch{}render();});
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});});
render();
