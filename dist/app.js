'use strict';
const $ = (s) => document.querySelector(s);
const t = (...args) => window.NeramPrefs.t(...args);
const icon = (name) => `<svg aria-hidden="true"><use href="#${name}"/></svg>`;
const state = {from:null,to:null,rows:[],operator:'all',sort:'time',searched:false,loading:false,total:0,request:0};
let format = '12';
try { format = localStorage.getItem('neram-time-format') || '12'; } catch {}
const cache = new Map();
const pretty = (s) => String(s || '').replace(/\S+/g, w => /^[A-Z\d]+$/.test(w) ? w.charAt(0)+w.slice(1).toLowerCase() : w);
function timeLabel(value) {
 if (!value || !/^\d{2}:\d{2}$/.test(value)) return t('Time unavailable');
 if(format==='24') return value;
 const [h,m]=value.split(':').map(Number);return `${String(h%12||12).padStart(2,'0')}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`;
}
function durationLabel(n){if(n==null||n<0)return t('Duration unavailable');if(n<60)return t('{n} min',{n});return n%60?t('{h} hr {m} min',{h:Math.floor(n/60),m:n%60}):t('{h} hr',{h:Math.floor(n/60)});}
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
  const v=++version;controller?.abort();controller=new AbortController();items=[];list.hidden=false;input.setAttribute('aria-expanded','true');input.setAttribute('aria-busy','true');notice(t('Finding stops…'));index=-1;
  try{const found=await getStops(input.value,controller.signal);if(v!==version||document.activeElement!==input)return;items=found;list.replaceChildren();if(!items.length)notice(t('No matching stops. Try another spelling.'));
   items.forEach((item,i)=>{const li=document.createElement('li');li.id=`${id}-option-${i}`;li.setAttribute('role','option');li.setAttribute('aria-selected','false');li.append(textNode('span',pretty(item.name)),textNode('small',t('{n} scheduled services',{n:item.service_count.toLocaleString()})));li.addEventListener('mousedown',e=>e.preventDefault());li.addEventListener('click',()=>choose(item));list.append(li);});
  }catch(e){if(e.name!=='AbortError'&&v===version){items=[];notice(t('Stops unavailable. Check your connection.'));}}finally{if(v===version)input.removeAttribute('aria-busy');}
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
function invalidate(){state.request++;if(state.searched||state.loading){state.rows=[];state.searched=false;state.loading=false;state.total=0;$('#search-form button[type="submit"]').disabled=false;$('#search-form button[type="submit"] span').textContent=t('Search Buses');$('#data-error').hidden=true;render();}}
async function resolveStop(id){if(state[id])return state[id];const input=$(`#${id}`);const rows=await getStops(input.value);const match=rows.find(x=>x.stop_key===input.value.trim().toLowerCase());if(match){state[id]=match;input.value=pretty(match.name);}return match;}
function departureMinutes(){const v=$('#departure-time').value;if(v==='')return null;if(v==='now'){const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());return Number(parts.find(x=>x.type==='hour').value)*60+Number(parts.find(x=>x.type==='minute').value);}return Number(v);}
async function search(){
 clearError();fields.from.close();fields.to.close();
 if(!$('#from').value.trim()||!$('#to').value.trim()){showError(t('Choose a departure stop and a destination stop.'));(!$('#from').value.trim()?$('#from'):$('#to')).focus();return;}
 const request=++state.request;state.loading=true;state.searched=false;state.rows=[];state.total=0;$('#data-error').hidden=true;$('#search-form button[type="submit"]').disabled=true;$('#search-form button[type="submit"] span').textContent=t('Finding buses…');render();
 try{
  const from=await resolveStop('from'),to=await resolveStop('to');if(request!==state.request)return;
  if(!from||!to){showError(t('Select a matching stop from the suggestions.'));state.loading=false;render();return;}
  if(from.stop_key===to.stop_key){showError(t('Choose two different stops for your journey.'));state.loading=false;render();return;}
  const rows=await rpc('neram_search_buses',{p_from:from.stop_key,p_to:to.stop_key,p_after:departureMinutes(),p_limit:200});if(request!==state.request)return;
  state.rows=rows;state.total=Number(rows[0]?.total_matches||0);state.searched=true;state.loading=false;render();
 }catch(e){if(request!==state.request)return;state.loading=false;$('#data-error').hidden=false;$('#empty-state').hidden=true;$('#results-list').replaceChildren();$('#results-live').textContent=t('Timetable unavailable. Please try again.');}
 finally{if(request===state.request){state.loading=false;$('#search-form button[type="submit"]').disabled=false;$('#search-form button[type="submit"] span').textContent=t('Search Buses');}}
}
function render(){
 const list=$('#results-list');list.replaceChildren();$('#result-caption').hidden=true;
 if(!state.searched&&!state.loading)$('#results-live').textContent='';
 if(state.loading){$('#empty-state').hidden=true;for(let i=0;i<3;i++){const div=document.createElement('div');div.className='skeleton';div.setAttribute('aria-hidden','true');list.append(div);}$('#result-count').textContent=t('Searching');$('#results-live').textContent=t('Searching bus timetables.');return;}
 const rows=state.rows.filter(x=>state.operator==='all'||x.operator===state.operator).sort((a,b)=>{if(state.sort==='duration')return (a.duration_minutes??Infinity)-(b.duration_minutes??Infinity)||(a.departure_time||'99').localeCompare(b.departure_time||'99');return (a.departure_time||'99').localeCompare(b.departure_time||'99');});
 $('#result-count').textContent=t('{n} found',{n:rows.length});
 $('#empty-state').hidden=rows.length>0||!$('#data-error').hidden;
 $('#empty-state h3').textContent=state.searched?t('No direct buses found'):t('Where will you go next?');
 $('#empty-state p').textContent=state.searched?(state.rows.length?t('Try All Buses or another operator.'):t('Try another stop or choose Any Time.')):t('Choose your stops to find a direct bus.');
 $('.popular').hidden=state.searched;
 if(state.searched){$('#results-live').textContent=t('{n} buses found.',{n:rows.length});$('#result-caption').hidden=false;const caption=`${pretty(state.from?.name)} → ${pretty(state.to?.name)} · ${t('Scheduled departures')}${$('#departure-time').value==='now'?' '+t('after the current time in India'):''}`;$('#result-caption').textContent=state.total>state.rows.length?`${caption}. ${t('Showing the first {shown} of {total} matches; narrow by departure time.',{shown:state.rows.length,total:state.total})}`:caption;}
 rows.forEach(row=>{
  const card=document.createElement('button');card.type='button';card.className='bus-card';card.setAttribute('aria-label',`${row.name}, ${timeLabel(row.departure_time)}. View stops`);
  const img=document.createElement('img');img.src='/assets/bus.svg';img.alt='';img.width=89;img.height=89;
  const content=document.createElement('div');content.className='bus-content';const top=document.createElement('div');top.className='bus-top';top.append(textNode('span',row.name||'Bus service','bus-name'),textNode('span',t(row.operator),`operator-tag ${row.operator==='Private'?'private':''}`));
  const route=document.createElement('div');route.className='bus-route';route.innerHTML='<span class="green-dot"></span>';route.append(textNode('span',`${pretty(row.origin)} → ${pretty(row.destination)}`,'route-text'));
  const duration=document.createElement('div');duration.className='bus-duration';duration.innerHTML=icon('clock');duration.append(textNode('span',durationLabel(row.duration_minutes)));
  content.append(top,route,duration);const side=document.createElement('div');side.className='bus-side';side.append(textNode('span',timeLabel(row.departure_time),'departure-badge'));side.insertAdjacentHTML('beforeend',icon('chevron'));card.append(img,content,side);card.addEventListener('click',()=>showJourney(row));list.append(card);
 });
}
let journeyRequest=0;
let activeJourney=null;
const journeys=new Map();
function busHeader(row,full=false){
 const header=document.createElement('div');header.className='journey-bus-header';
 const image=document.createElement('img');image.src='/assets/bus.svg';image.alt='';
 const content=document.createElement('div');content.className='bus-content';
 const top=document.createElement('div');top.className='bus-top';top.append(textNode('span',row.name||t('Bus service'),'bus-name'),textNode('span',t(row.operator),`operator-tag ${row.operator==='Private'?'private':''}`));content.append(top);
 const route=document.createElement('div');route.className='bus-route';route.innerHTML='<span class="green-dot"></span>';route.append(textNode('span',`${pretty(row.origin)} → ${pretty(row.destination)}`,'route-text'));content.append(route);
 const when=document.createElement('div');when.className='journey-bus-time';when.innerHTML=icon('clock');when.append(textNode('span',timeLabel(full?activeJourney.stops[0]?.time:row.departure_time)));
 header.append(image,content,when);return header;
}
function timeline(stops,row,full=false){
 const list=document.createElement('ol');list.className='timeline';
 for(const stop of stops){const li=document.createElement('li'),label=document.createElement('span');
  const board=stop.sequence===row.boarding_sequence,alight=stop.sequence===row.alighting_sequence;
  if(board||alight){li.className='selected-stop';if(full)label.append(textNode('small',t(board?'BOARD HERE':'GET OFF HERE')));}
  label.append(document.createTextNode(pretty(stop.stop)));const time=textNode('time',timeLabel(stop.time));
  if(stop.day_offset>0){time.append(textNode('small',t('Overnight · +{n} day',{n:stop.day_offset})));}
  li.append(label,time);list.append(li);
 }
 return list;
}
function renderJourney(){
 if(!activeJourney)return;const {row,stops}=activeJourney;
 $('#journey-summary').replaceChildren(busHeader(row));$('#segment-duration').textContent=durationLabel(row.duration_minutes);
 const container=$('#journey-stops');
 if(!stops){container.replaceChildren(textNode('p',t('Loading the route…'),'journey-note'));$('#segment-count').textContent='—';$('#full-route-button').disabled=true;return;}
 const segment=stops.filter(x=>x.sequence>=row.boarding_sequence&&x.sequence<=row.alighting_sequence);
 $('#segment-count').textContent=t('{n} stops',{n:segment.length});$('#full-route-button').disabled=!stops.length;
 container.replaceChildren(segment.length?timeline(segment,row):textNode('p',t('No stop information available.'),'journey-note'));
}
async function showJourney(row){
 const req=++journeyRequest;activeJourney={row,stops:journeys.get(row.service_id)||null};renderJourney();$('#journey-dialog').showModal();
 if(activeJourney.stops)return;
 try{const stops=await rpc('neram_journey',{p_id:row.service_id});journeys.set(row.service_id,stops);if(req!==journeyRequest)return;activeJourney.stops=stops;renderJourney();}
 catch{if(req===journeyRequest)$('#journey-stops').replaceChildren(textNode('p',t('Route details are unavailable. Close this window and try again.'),'journey-note'));}
}
function renderFullRoute(){if(!activeJourney?.stops)return;$('#full-route-bus').replaceChildren(busHeader(activeJourney.row,true));$('#full-route-stops').replaceChildren(timeline(activeJourney.stops,activeJourney.row,true));}
function closeFullRoute(){if($('#full-route-view').hidden)return;$('#full-route-view').hidden=true;document.body.classList.remove('route-open');window.scrollTo(0,routeScroll);renderJourney();if(!$('#journey-dialog').open)$('#journey-dialog').showModal();}
let routeScroll=0;
$('#full-route-button').addEventListener('click',()=>{if(!activeJourney?.stops?.length)return;routeScroll=window.scrollY;$('#journey-dialog').close();renderFullRoute();$('#full-route-view').hidden=false;document.body.classList.add('route-open');history.pushState({neramFullRoute:true},'',location.href);window.scrollTo(0,0);$('#route-back').focus({preventScroll:true});});
$('#route-back').addEventListener('click',()=>{if(history.state?.neramFullRoute)history.back();else closeFullRoute();});
window.addEventListener('popstate',()=>{if(!history.state?.neramFullRoute)closeFullRoute();else if(activeJourney?.stops){$('#journey-dialog').close();renderFullRoute();$('#full-route-view').hidden=false;document.body.classList.add('route-open');window.scrollTo(0,0);}});
$('#report-button').addEventListener('click',()=>{if(!activeJourney)return;$('#report-form').reset();$('#report-status').textContent='';$('#report-status').className='';$('#report-form button[type="submit"]').disabled=false;$('#report-context').textContent=`${activeJourney.row.name} · ${pretty(activeJourney.row.boarding_stop)} → ${pretty(activeJourney.row.alighting_stop)}`;$('#report-dialog').showModal();});
$('#report-form').addEventListener('submit',async e=>{
 e.preventDefault();if(!activeJourney)return;const details=$('#report-details').value.trim();if(details.length<10){$('#report-status').textContent=t('Please add at least 10 characters.');return;}
 const button=$('#report-form button[type="submit"]'),serviceId=activeJourney.row.service_id;button.disabled=true;button.querySelector('span').textContent=t('Submitting…');$('#report-status').textContent='';
 try{const c=window.NERAM_CONFIG;const r=await fetch(`${c.url}/rest/v1/neram_issue_reports`,{method:'POST',headers:{apikey:c.publishableKey,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({service_id:serviceId,category:$('#report-category').value,details})});if(!r.ok)throw Error();$('#report-status').className='';$('#report-status').textContent=t('Thank you. Your report has been submitted for review.');$('#report-form').reset();}
 catch{$('#report-status').className='error';$('#report-status').textContent=t('We couldn’t submit the report. Please try again.');button.disabled=false;}
 finally{button.querySelector('span').textContent=t('Submit report');}
});
$('#about-button').addEventListener('click',()=>$('#about-dialog').showModal());
$('#search-form').addEventListener('submit',e=>{e.preventDefault();search();});
$('#swap-button').addEventListener('click',()=>{[state.from,state.to]=[state.to,state.from];const a=$('#from').value;$('#from').value=$('#to').value;$('#to').value=a;invalidate();clearError();fields.from.close();fields.to.close();});
$('#departure-time').addEventListener('change',invalidate);
document.querySelectorAll('[data-operator]').forEach(btn=>btn.addEventListener('click',()=>{state.operator=btn.dataset.operator;document.querySelectorAll('[data-operator]').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});render();}));
$('#sort-button').addEventListener('click',()=>{state.sort=state.sort==='time'?'duration':'time';$('#sort-button span').textContent=t(state.sort==='time'?'Sorted by Time':'Shortest Journey');render();});
$('#retry-button').addEventListener('click',search);
$('#popular-route').addEventListener('click',async()=>{try{const [from,to]=await Promise.all([getStops('aluva'),getStops('ernakulam')]);const a=from.find(x=>x.stop_key==='aluva'),b=to.find(x=>x.stop_key==='ernakulam');if(!a||!b)throw Error();fields.from.choose(a);fields.to.choose(b);search();}catch{showError(t('Popular journey unavailable. Please choose your stops.'));}});
$('#settings-button').addEventListener('click',()=>$('#settings-dialog').showModal());
$('#time-format').value=format;
$('#time-format').addEventListener('change',e=>{format=e.target.value;try{localStorage.setItem('neram-time-format',format);}catch{}render();renderJourney();renderFullRoute();});
window.addEventListener('neram:preferences',()=>{render();renderJourney();renderFullRoute();$('#sort-button span').textContent=t(state.sort==='time'?'Sorted by Time':'Shortest Journey');if(state.loading)$('#search-form button[type="submit"] span').textContent=t('Finding buses…');});
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});});
render();
