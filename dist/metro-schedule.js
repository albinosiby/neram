(() => {
 const core=window.NeramMetroSchedule,manifest=window.NERAM_METRO_CATALOG_MANIFEST;
 const stations=window.NERAM_METRO_STATIONS,byId=new Map(stations.map(s=>[s.stop_id,s]));
 const name=id=>{const s=byId.get(id);return window.NeramPrefs.language==='ml'?(s?.names?.ml||s?.station_name||id):(s?.station_name||id);};
 let catalog=null,loading=null,failed=false,limit=12,matches=[],activeTrip=null;
 function clock(seconds,precise=false){
  const f=core.fields(seconds),base=`${String(f.hours).padStart(2,'0')}:${String(f.minutes).padStart(2,'0')}`;
  let value=timeLabel(base);if(precise)value=value.replace(/(\d{2}:\d{2})/,`$1:${String(f.seconds).padStart(2,'0')}`);
  return value+(f.day?` · ${t('Day +{n}',{n:f.day})}`:'');
 }
 function travelTime(seconds){const mins=Math.floor(seconds/60),s=seconds%60;return [mins?durationLabel(mins):'',s?t('{n} sec',{n:s}):''].filter(Boolean).join(' ')||t('{n} sec',{n:0});}
 async function loadCatalog(){
  if(catalog)return catalog;if(loading)return loading;failed=false;render();
  loading=fetch(manifest.url,{cache:'force-cache'}).then(r=>{if(!r.ok)throw Error('Catalog unavailable');return r.json();}).then(data=>{
   if(data.schemaVersion!==1||!Array.isArray(data.trips)||!Array.isArray(data.stationCodes)||data.trips.length!==manifest.completeTrips)throw Error('Invalid catalog');
   catalog=data;failed=false;return data;
  }).catch(()=>{failed=true;return null;}).finally(()=>{loading=null;render();});
  return loading;
 }
 function routeSelection(){const from=$('#metro-from').value,to=$('#metro-to').value;return from!==to&&byId.has(from)&&byId.has(to)?{from,to}:null;}
 function render(){
  const selected=routeSelection();$('#metro-schedule').hidden=!selected;if(!selected)return;
  const list=$('#metro-departures');list.replaceChildren();$('#metro-departures-more').hidden=true;$('#metro-schedule-retry').hidden=!failed;
  if(!catalog){$('#metro-catalog-fare').textContent='—';$('#metro-calendar-range').textContent=t('Published service period: 12 August 2024 – 31 December 2025.');$('#metro-schedule-status').textContent=t(failed?'Could not load the archived timetable. Please try again.':'Loading the archived timetable…');return;}
  const service=$('#metro-service').value,after=core.seconds($('#metro-after').value);
  const calendar=catalog.calendar.find(c=>c.service_id===service);
  if(!calendar){$('#metro-schedule-status').textContent=t('No published calendar is available for this pattern.');return;}
  $('#metro-calendar-range').textContent=t('Published service period: 12 August 2024 – 31 December 2025.');
  const price=core.fare(catalog,selected.from,selected.to);$('#metro-catalog-fare').textContent=price===null?t('Not available'):`₹${price}`;
  matches=core.query(catalog,selected.from,selected.to,service,after);
  $('#metro-schedule-status').textContent=matches.length?t('{n} published departures',{n:matches.length}):t('No archived trips match these stations and time.');
  for(const trip of matches.slice(0,limit)){
   const button=document.createElement('button');button.className='metro-departure';button.type='button';
   button.setAttribute('aria-label',`${t('Archived trip')} ${trip.id}, ${clock(trip.departure)}. ${t('View stop times')}`);
   const mark=document.createElement('span');mark.className='metro-departure-icon';mark.innerHTML=icon('metro');
   const body=document.createElement('span');body.className='metro-departure-body';
   const times=document.createElement('span');times.className='metro-departure-times';
   const dep=textNode('strong',clock(trip.departure)),arr=textNode('strong',clock(trip.arrival));dep.title=clock(trip.departure,true);arr.title=clock(trip.arrival,true);
   times.append(dep,textNode('span','→'),arr);
   body.append(times,textNode('small',`${name(trip.origin)} → ${name(trip.destination)}`),textNode('small',`${t('Catalog trip')} ${trip.id} · ${t('{n} stations',{n:trip.stopCount})}`));
   const side=document.createElement('span');side.className='metro-departure-side';side.append(textNode('span',travelTime(trip.duration)));side.insertAdjacentHTML('beforeend',icon('chevron'));
   button.append(mark,body,side);button.addEventListener('click',()=>{activeTrip=trip;renderTrip();$('#metro-trip-dialog').showModal();});list.append(button);
  }
  $('#metro-departures-more').hidden=matches.length<=limit;$('#metro-departures-more').textContent=t('Show more departures ({n} remaining)',{n:Math.max(0,matches.length-limit)});
  if($('#metro-geometry').open)renderMap();
 }
 function renderTrip(){
  if(!activeTrip||!catalog)return;const trip=activeTrip;
  $('#metro-trip-title').textContent=`${name(catalog.stationCodes[trip.calls[0][0]])} → ${name(catalog.stationCodes[trip.calls.at(-1)[0]])}`;
  $('#metro-trip-summary').textContent=`${t('Catalog trip')} ${trip.id} · ${travelTime(trip.duration)} · ${t('{n} stations',{n:trip.stopCount})}`;
  const list=$('#metro-trip-timeline');list.replaceChildren();
  trip.calls.forEach((call,i)=>{
   const id=catalog.stationCodes[call[0]],li=document.createElement('li');li.className=i===0?'metro-boarding':i===trip.calls.length-1?'metro-alighting':'';
   const dot=textNode('span',String(i+1),'metro-station-dot');dot.setAttribute('aria-hidden','true');
   const body=document.createElement('span');body.className='metro-trip-stop';body.append(textNode('strong',name(id)),textNode('small',id));
   const when=document.createElement('span');when.className='metro-trip-stop-times';
   if(i===0)when.append(textNode('small',t('Departure')),textNode('strong',clock(call[2],true)));
   else if(i===trip.calls.length-1)when.append(textNode('small',t('Arrival')),textNode('strong',clock(call[1],true)));
   else when.append(textNode('small',t('Arrival / departure')),textNode('span',`${clock(call[1],true)} / ${clock(call[2],true)}`));
   li.append(dot,body,when);list.append(li);
  });
 }
 const svgNS='http://www.w3.org/2000/svg';
 function svgEl(tag,attributes={}){const el=document.createElementNS(svgNS,tag);for(const [k,v] of Object.entries(attributes))el.setAttribute(k,v);return el;}
 function renderMap(){
  if(!catalog)return;const selected=routeSelection();if(!selected)return;
  const from=byId.get(selected.from),to=byId.get(selected.to),container=$('#metro-route-map');container.replaceChildren();
  const nearest=(points,s)=>points.reduce((best,p,i)=>{const d=(p[0]-s.latitude)**2+((p[1]-s.longitude)*Math.cos(s.latitude*Math.PI/180))**2;return d<best.d?{i,d}:best;},{i:0,d:Infinity});
  const shape=[...catalog.shapes].sort((a,b)=>nearest(a.points,from).d+nearest(a.points,to).d-nearest(b.points,from).d-nearest(b.points,to).d)[0];
  const points=shape.points,minLat=Math.min(...points.map(p=>p[0]),...stations.map(s=>s.latitude)),maxLat=Math.max(...points.map(p=>p[0]),...stations.map(s=>s.latitude));
  const minLon=Math.min(...points.map(p=>p[1]),...stations.map(s=>s.longitude)),maxLon=Math.max(...points.map(p=>p[1]),...stations.map(s=>s.longitude));
  const cos=Math.cos((minLat+maxLat)/2*Math.PI/180),scale=Math.min(360/((maxLon-minLon)*cos),330/(maxLat-minLat));
  const width=(maxLon-minLon)*cos*scale,height=(maxLat-minLat)*scale;
  const project=(lat,lon)=>[240-width/2+(lon-minLon)*cos*scale,25+(maxLat-lat)*scale];
  const coordinates=pts=>pts.map(p=>project(p[0],p[1]).map(v=>v.toFixed(2)).join(',')).join(' ');
  const svg=svgEl('svg',{viewBox:'0 0 480 390',role:'group','aria-label':t('Catalog route geometry with selected stations')});
  svg.append(svgEl('polyline',{points:coordinates(points),fill:'none',stroke:'#597287','stroke-width':5,'stroke-linecap':'round','stroke-linejoin':'round',opacity:'.5'}));
  const start=nearest(points,from).i,end=nearest(points,to).i,part=points.slice(Math.min(start,end),Math.max(start,end)+1);
  svg.append(svgEl('polyline',{points:coordinates(part),fill:'none',stroke:'#11c7a5','stroke-width':6,'stroke-linecap':'round','stroke-linejoin':'round'}));
  const labels=new Set([stations[0].stop_id,stations.at(-1).stop_id,from.stop_id,to.stop_id]);
  for(const station of stations){
   const [x,y]=project(station.latitude,station.longitude),isFrom=station.stop_id===from.stop_id,isTo=station.stop_id===to.stop_id;
   const circle=svgEl('circle',{cx:x,cy:y,r:isFrom||isTo?6:3.5,fill:isFrom?'#16d4ad':isTo?'#ffbc2f':'#afc7d5',stroke:'#102638','stroke-width':1.5,tabindex:'0',role:'button','aria-label':name(station.stop_id)});
   const title=svgEl('title');title.textContent=name(station.stop_id);circle.append(title);
   const open=()=>window.dispatchEvent(new CustomEvent('neram:metro-station',{detail:station.stop_id}));circle.addEventListener('click',open);circle.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});svg.append(circle);
   if(labels.has(station.stop_id)){const text=svgEl('text',{x:x+12,y:y+4,fill:isFrom?'#35dbb8':isTo?'#ffc747':'#a2b9c9','font-size':11,'font-family':'system-ui'});text.textContent=station.stop_id;svg.append(text);}
  }
  const north=svgEl('text',{x:22,y:28,fill:'#9cb6c7','font-size':11});north.textContent='N ↑';svg.append(north);
  container.append(svg,textNode('p',`${name(selected.from)} → ${name(selected.to)}`,'metro-map-caption'));
 }
 function routeChanged(){limit=12;activeTrip=null;render();if(!$('#metro-view').hidden)loadCatalog();}
 $('#metro-service').addEventListener('change',()=>{limit=12;render();});$('#metro-after').addEventListener('input',()=>{limit=12;render();});
 $('#metro-any-time').addEventListener('click',()=>{$('#metro-after').value='';limit=12;render();});
 $('#metro-schedule-retry').addEventListener('click',loadCatalog);
 $('#metro-departures-more').addEventListener('click',()=>{limit+=20;render();});
 $('#metro-geometry').addEventListener('toggle',()=>{if($('#metro-geometry').open)renderMap();});
 window.addEventListener('neram:metro-route',routeChanged);
 window.addEventListener('neram:metro-mode',e=>{if(e.detail==='metro')loadCatalog();});
 window.addEventListener('neram:preferences',()=>{render();renderTrip();if($('#metro-geometry').open)renderMap();});
 render();if(!$('#metro-view').hidden)loadCatalog();
})();
