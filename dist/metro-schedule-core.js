// Pure catalogue operations. Times are seconds from the published service-day start.
window.NeramMetroSchedule = (() => {
 function query(data,from,to,service,after=null){
  const a=data.stationCodes.indexOf(from),b=data.stationCodes.indexOf(to);
  if(a<0||b<0||a===b)return [];
  const matches=[];
  for(const [id,serviceId,direction,shapeId,calls] of data.trips){
   if(service&&serviceId!==service)continue;
   const start=calls.findIndex(s=>s[0]===a);if(start<0)continue;
   const end=calls.findIndex((s,i)=>i>start&&s[0]===b);if(end<0)continue;
   const departure=calls[start][2],arrival=calls[end][1];
   if(arrival<departure||(after!==null&&departure<after))continue;
   matches.push({id,serviceId,direction,shapeId,departure,arrival,duration:arrival-departure,
    origin:data.stationCodes[calls[0][0]],destination:data.stationCodes[calls.at(-1)[0]],
    calls:calls.slice(start,end+1),fullCalls:calls,stopCount:end-start+1});
  }
  return matches.sort((x,y)=>x.departure-y.departure||x.id.localeCompare(y.id));
 }
 function fare(data,from,to){const price=data.fares[`${from}:${to}`];return typeof price==='number'?price:null;}
 function seconds(value){if(!/^\d{1,3}:[0-5]\d(?::[0-5]\d)?$/.test(value))return null;const [h,m,s=0]=value.split(':').map(Number);return h*3600+m*60+s;}
 function fields(value){return {day:Math.floor(value/86400),hours:Math.floor(value/3600)%24,minutes:Math.floor(value/60)%60,seconds:value%60};}
 function validOn(calendar,date){
  const d=new Date(date+'T12:00:00Z');if(!Number.isFinite(d.getTime()))return false;
  const numeric=Number(date.replaceAll('-',''));const day=['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][d.getUTCDay()];
  return numeric>=calendar.start_date&&numeric<=calendar.end_date&&calendar.days[day]===true;
 }
 return {query,fare,seconds,fields,validOn};
})();
