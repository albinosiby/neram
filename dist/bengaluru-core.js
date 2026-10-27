// Route states keep the line identity so transfer cost is counted explicitly.
window.NeramBengaluruCore={
 stations(data){return [...new Set(data.lines.flatMap(l=>l.stations_in_order))];},
 route(data,from,to){
  if(from===to)return null;
  const states=new Map(),key=(line,station)=>JSON.stringify([line,station]);
  data.lines.forEach(l=>l.stations_in_order.forEach((station,i)=>states.set(key(l.line_id,station),{line:l.line_id,station,index:i})));
  const costs=new Map(),parents=new Map(),pending=new Set(states.keys());
  for(const [id,s] of states)if(s.station===from)costs.set(id,0);
  let finish;
  while(pending.size){
   let at,best=Infinity;for(const id of pending){if((costs.get(id)??Infinity)<best){at=id;best=costs.get(id);}}
   if(!at)break;pending.delete(at);const s=states.get(at);if(s.station===to){finish=at;break;}
   for(const [id,n] of states){if(!pending.has(id))continue;const same=s.line===n.line&&Math.abs(s.index-n.index)===1,transfer=s.station===n.station&&s.line!==n.line;if(!same&&!transfer)continue;
    const cost=best+(transfer?1000:1);if(cost<(costs.get(id)??Infinity)){costs.set(id,cost);parents.set(id,at);}
   }
  }
  if(!finish)return null;const path=[];for(let id=finish;id;id=parents.get(id))path.unshift(states.get(id));
  const legs=[];for(const state of path){let leg=legs.at(-1);if(!leg||leg.line!==state.line){leg={line:state.line,stations:[]};legs.push(leg);}leg.stations.push(state.station);}
  return {legs,transfers:legs.length-1,hops:legs.reduce((n,l)=>n+l.stations.length-1,0),stations:[...new Set(path.map(s=>s.station))]};
 }
};
