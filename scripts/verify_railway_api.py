"""Read-only smoke checks against the separate railway project's public API."""
import json, pathlib, re, urllib.request, urllib.error
config=(pathlib.Path(__file__).resolve().parents[1]/'dist/config.js').read_text()
match=re.search(r'NERAM_RAIL_CONFIG=\{url:"([^"]+)",publishableKey:"([^"]+)"',config)
url,key=match.groups()
def rpc(name,body):
    request=urllib.request.Request(url+'/rest/v1/rpc/'+name,data=json.dumps(body).encode(),headers={'apikey':key,'Content-Type':'application/json'})
    with urllib.request.urlopen(request,timeout=25) as response:return json.load(response)
assert rpc('neram_rail_stations',{'p_query':'CAN'})[0]['code']=='CAN'
assert not rpc('neram_rail_stations',{'p_query':'%'})
first=rpc('neram_rail_search',{'p_from':'CAN','p_to':'TLY','p_after':None,'p_offset':0})
assert len(first)==30 and first[0]['total_results']>=30
second=rpc('neram_rail_search',{'p_from':'CAN','p_to':'TLY','p_after':None,'p_offset':30})
identity=lambda r:(r['train_id'],r['boarding_order'],r['alighting_order'])
assert not set(map(identity,first))&set(map(identity,second))
assert len(first)+len(second)==first[0]['total_results']
assert all(r['boarding_order']<r['alighting_order'] for r in first+second)
assert not rpc('neram_rail_search',{'p_from':'CAN','p_to':'CAN'})
after=rpc('neram_rail_search',{'p_from':'CAN','p_to':'TLY','p_after':720})
assert after and all(r['departure_time']>='12:00' for r in after)
route=rpc('neram_rail_journey',{'p_id':'4646'})
assert len(route)==28 and route[0]['station_code']=='CAN' and route[-1]['station_code']=='ALLP'
assert route[0]['departure_time']=='05:10' and route[1]['arrival_time']=='05:29'
assert [r['stop_order'] for r in route]==sorted(r['stop_order'] for r in route)
for path in ['/rest/v1/railway_trains?select=data&limit=1','/rest/v1/railway_dataset_sections?select=*&limit=1']:
    try:
        urllib.request.urlopen(urllib.request.Request(url+path,headers={'apikey':key}),timeout=25)
        raise AssertionError('Raw data unexpectedly readable')
    except urllib.error.HTTPError as error:assert error.code in (401,403)
print(json.dumps({'passed':True,'route_matches':first[0]['total_results'],'pagination':True,'after_time':True,'route_stops':len(route),'raw_data_blocked':True}))
