import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const base=new URL('../dist/',import.meta.url),context={window:{}};vm.createContext(context);
vm.runInContext(await readFile(new URL('metro-catalog-manifest.js',base),'utf8'),context);
vm.runInContext(await readFile(new URL('metro-schedule-core.js',base),'utf8'),context);
const manifest=context.window.NERAM_METRO_CATALOG_MANIFEST,api=context.window.NeramMetroSchedule;
const data=JSON.parse(await readFile(new URL(manifest.url.slice(1),base),'utf8'));
assert.equal(data.trips.length,446);assert.equal(new Set(data.trips.map(t=>t[0])).size,446);
assert.equal(data.trips.reduce((n,t)=>n+t[4].length,0),10652);
assert.deepEqual(data.missingTrips,['WK_12','WK_18','WK_256','WK_4']);
assert.equal(api.fare(data,'ALVA','TPHT'),60);assert.equal(api.fare(data,'TPHT','ALVA'),60);
assert.equal(api.fare(data,'UNKNOWN','TPHT'),null);
const forward=api.query(data,'ALVA','TPHT','WE');const example=forward.find(t=>t.id==='WE_10');
// Independent sample from the uploaded stop_times.json: Aluva dep 11:37:10,
// Tripunithura arr 12:27:48; full forward trip has 25 station calls.
assert.ok(example);assert.equal(example.departure,41830);assert.equal(example.arrival,44868);
assert.equal(example.duration,3038);assert.equal(example.stopCount,25);
assert.ok(!api.query(data,'ALVA','TPHT','WE',api.seconds('11:40')).some(t=>t.id==='WE_10'));
assert.equal(api.query(data,'ALVA','ALVA','WE').length,0);
// WE_1 is a short turn from Tripunithura to Muttom, not a train to Aluva.
assert.ok(!api.query(data,'TPHT','ALVA','WE').some(t=>t.id==='WE_1'));
assert.ok(api.query(data,'TPHT','MUTT','WE').some(t=>t.id==='WE_1'));
for(const trip of forward)assert.ok(trip.arrival>=trip.departure);
const midnight=api.fields(api.seconds('24:03:45'));
assert.equal(midnight.day,1);assert.equal(midnight.hours,0);assert.equal(midnight.minutes,3);assert.equal(midnight.seconds,45);
for(const calendar of data.calendar)assert.equal(api.validOn(calendar,'2026-10-27'),false);
assert.equal(api.validOn(data.calendar.find(c=>c.service_id==='WE'),'2025-12-28'),true);
assert.equal(api.validOn(data.calendar.find(c=>c.service_id==='WK'),'2025-12-28'),false);
assert.equal(api.validOn(data.calendar.find(c=>c.service_id==='WK'),'2025-12-27'),true);
console.log(JSON.stringify({passed:true,completeTrips:data.trips.length,sundayAluvaTripunithura:forward.length,overnightHandling:true,shortTurns:true,expiredCalendar:true}));
