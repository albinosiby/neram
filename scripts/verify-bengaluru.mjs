import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const sandbox={window:{}};vm.createContext(sandbox);for(const name of ['bengaluru-data.js','bengaluru-core.js'])vm.runInContext(readFileSync(new URL('../dist/'+name,import.meta.url),'utf8'),sandbox);
const data=sandbox.window.NERAM_BENGALURU,core=sandbox.window.NeramBengaluruCore;
assert.equal(core.stations(data).length,83);
for(const line of data.lines){assert.equal(line.stations_in_order.length,line.station_count);for(const reversed of [false,true]){const from=line.stations_in_order[reversed?line.station_count-1:0],to=line.stations_in_order[reversed?0:line.station_count-1],r=core.route(data,from,to);assert.equal(r.transfers,0);assert.equal(r.hops,line.station_count-1);}}
const r=core.route(data,'Whitefield (Kadugodi)','Delta Electronics Bommasandra');assert.equal(r.transfers,2);assert.equal(r.legs[0].stations.at(-1),'Nadaprabhu Kempegowda Station (Majestic)');assert.equal(r.legs[1].stations.at(-1),'Rashtreeya Vidyalaya Road');assert.equal(r.legs[2].stations[0],'Rashtreeya Vidyalaya Road');
assert.equal(core.route(data,'Rashtreeya Vidyalaya Road','Ragigudda').transfers,0);assert.equal(core.route(data,'Aluva','Ragigudda'),null);assert.equal(core.route(data,'Ragigudda','Ragigudda'),null);
console.log('Passed: 83 stations, direct routes in both directions on all lines, two-transfer route, interchange starts, invalid/same stations.');
