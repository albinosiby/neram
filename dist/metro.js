// Station guide derived solely from stations.csv; no schedule or fare assumptions.
(() => {
 const stations=window.NERAM_METRO_STATIONS;
 const byId=new Map(stations.map(s=>[s.stop_id,s]));
 const stationName=s=>window.NeramPrefs.language==='ml'?(s.names?.ml||s.station_name):s.station_name;
 let route=[],expanded=false,mode=location.hash==='#trains'?'trains':location.hash.startsWith('#metro')?'metro':'bus',detailId=null;
 for(const selector of ['#metro-from','#metro-to']){
  for(const station of stations){const option=document.createElement('option');option.value=station.stop_id;option.textContent=station.station_name;$(selector).append(option);}
 }
 $('#metro-from').value=stations[0].stop_id;$('#metro-to').value=stations.at(-1).stop_id;
 function setMode(next,updateUrl=true){
  mode=next;$('#rail-view').hidden=next!=='trains';$('#mode-trains').setAttribute('aria-pressed',String(next==='trains'));$('#bus-view').hidden=next!=='bus';$('#metro-view').hidden=next!=='metro';
  $('#mode-bus').setAttribute('aria-pressed',String(next==='bus'));$('#mode-metro').setAttribute('aria-pressed',String(next==='metro'));
  $('#footer-timetable-note').hidden=next!=='bus';
  window.dispatchEvent(new CustomEvent('neram:metro-mode',{detail:next==='metro'&&location.hash==='#metro-bengaluru'?'bengaluru':next}));
  if(updateUrl)history.replaceState(null,'',location.pathname+location.search+(next==='metro'?($('#metro-city').value==='bengaluru'?'#metro-bengaluru':'#metro'):next==='trains'?'#trains':''));
 }
 $('#mode-trains').addEventListener('click',()=>setMode('trains'));
 $('#mode-bus').addEventListener('click',()=>setMode('bus'));
 $('#mode-metro').addEventListener('click',()=>setMode('metro'));
 window.addEventListener('hashchange',()=>setMode(location.hash==='#trains'?'trains':location.hash.startsWith('#metro')?'metro':'bus',false));
 function selectRoute(){
  const from=byId.get($('#metro-from').value),to=byId.get($('#metro-to').value);
  if(!from||!to||from.stop_id===to.stop_id){$('#metro-error').hidden=false;$('#metro-error').textContent=t('Choose two different Metro stations.');$('#metro-route-result').hidden=true;window.dispatchEvent(new CustomEvent('neram:metro-route',{detail:null}));return false;}
  $('#metro-error').hidden=true;$('#metro-route-result').hidden=false;
  const low=Math.min(from.sequence,to.sequence),high=Math.max(from.sequence,to.sequence);
  route=stations.filter(s=>s.sequence>=low&&s.sequence<=high);
  if(from.sequence>to.sequence)route.reverse();expanded=false;renderRoute();window.dispatchEvent(new CustomEvent('neram:metro-route',{detail:{from:from.stop_id,to:to.stop_id}}));return true;
 }
 function renderRoute(){
  if(!route.length)return;
  $('#metro-route-title').textContent=`${stationName(route[0])} → ${stationName(route.at(-1))}`;
  const terminal=route[0].sequence<route.at(-1).sequence?stations.at(-1):stations[0];
  $('#metro-direction').textContent=t('Towards {station}',{station:stationName(terminal)});
  $('#metro-station-count').textContent=route.length;$('#metro-between-count').textContent=Math.max(0,route.length-2);
  const list=$('#metro-timeline');list.replaceChildren();
  const visible=expanded||route.length<=6?route:[...route.slice(0,3),null,route.at(-1)];
  visible.forEach((station,i)=>{
   const li=document.createElement('li');
   if(!station){li.className='metro-timeline-gap';li.textContent=t('{n} more stations',{n:route.length-4});list.append(li);return;}
   const position=route.indexOf(station);li.className=position===0?'metro-boarding':position===route.length-1?'metro-alighting':'';
   const dot=textNode('span',String(position+1),'metro-station-dot');dot.setAttribute('aria-hidden','true');
   const button=document.createElement('button');button.type='button';button.append(textNode('span',stationName(station),'metro-stop-name'));
   const code=textNode('small',station.stop_id);button.append(code);button.addEventListener('click',()=>openStation(station.stop_id));
   if(position===0)button.prepend(textNode('small',t('BOARD HERE'),'metro-stop-role'));else if(position===route.length-1)button.prepend(textNode('small',t('GET OFF HERE'),'metro-stop-role'));
   li.append(dot,button);list.append(li);
  });
  $('#metro-expand').hidden=route.length<=6;$('#metro-expand').textContent=expanded?t('Show fewer stations'):t('Show all {n} stations',{n:route.length});
 }
 $('#metro-form').addEventListener('submit',e=>{e.preventDefault();if(selectRoute())$('#metro-schedule').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});});
 $('#metro-swap').addEventListener('click',()=>{const from=$('#metro-from').value;$('#metro-from').value=$('#metro-to').value;$('#metro-to').value=from;selectRoute();});
 $('#metro-from').addEventListener('change',selectRoute);$('#metro-to').addEventListener('change',selectRoute);
 $('#metro-expand').addEventListener('click',()=>{expanded=!expanded;renderRoute();});
 function renderCatalogue(){
  const q=$('#metro-station-query').value.trim().toLowerCase();const main=$('#metro-main-only').checked;
  const filtered=stations.filter(s=>(!main||s.main_station_flag)&&`${s.station_name} ${s.names?.ml||''} ${s.names?.hi||''} ${s.stop_id}`.toLowerCase().includes(q));
  const list=$('#metro-station-list');list.replaceChildren();$('#metro-catalogue-count').textContent=t('{n} stations',{n:filtered.length});
  if(!filtered.length){list.append(textNode('p',t('No matching Metro stations.'),'metro-source-note'));return;}
  filtered.forEach(station=>{const button=document.createElement('button');button.className='metro-catalogue-station';button.type='button';
   const n=textNode('span',String(station.sequence).padStart(2,'0'),'metro-catalogue-number'),label=document.createElement('span');
   label.append(textNode('strong',stationName(station)),textNode('small',station.stop_id));button.append(n,label);
   if(station.main_station_flag)button.append(textNode('span',t('Main'),'metro-main-badge'));
   button.insertAdjacentHTML('beforeend',icon('chevron'));button.addEventListener('click',()=>openStation(station.stop_id));list.append(button);
  });
 }
 $('#metro-station-query').addEventListener('input',renderCatalogue);$('#metro-main-only').addEventListener('change',renderCatalogue);
 function renderStation(){
  const station=byId.get(detailId);if(!station)return;$('#metro-station-title').textContent=stationName(station);
  const container=$('#metro-station-detail');container.replaceChildren();const dl=document.createElement('dl');dl.className='metro-station-facts';
  for(const [key,value] of [['Station code',station.stop_id],['Route position',`${station.sequence} / ${stations.length}`],['Main station',t(station.main_station_flag?'Yes':'No')],['Wheelchair boarding',t(station.wheelchair_boarding===1?'Available in catalog':station.wheelchair_boarding===2?'Not available in catalog':'Not specified')],['Latitude',String(station.latitude)],['Longitude',String(station.longitude)]]){
   const entry=document.createElement('div');entry.append(textNode('dt',t(key)),textNode('dd',value));dl.append(entry);
  }
  const map=document.createElement('a');map.className='sheet-action primary metro-map-link';map.href=`https://www.google.com/maps/search/?api=1&query=${station.latitude},${station.longitude}`;map.target='_blank';map.rel='noopener noreferrer';map.innerHTML=icon('map');map.append(textNode('span',t('Open station on map')));
  container.append(dl,map,textNode('p',t('Coordinates and station labels are from your uploaded station file.'),'metro-source-note'));
 }
 function openStation(id){detailId=id;renderStation();$('#metro-station-dialog').showModal();}
 window.addEventListener('neram:metro-station',e=>{if(byId.has(e.detail))openStation(e.detail);});
 window.addEventListener('neram:preferences',()=>{for(const id of ['#metro-from','#metro-to']){for(const option of $(id).options)option.textContent=stationName(byId.get(option.value));}renderRoute();renderCatalogue();renderStation();$('#footer-timetable-note').hidden=mode!=='bus';if(!$('#metro-error').hidden)$('#metro-error').textContent=t('Choose two different Metro stations.');});
 selectRoute();renderCatalogue();setMode(mode,false);
})();
