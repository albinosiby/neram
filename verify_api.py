"""Run against the configured read-only transit API: python3 verify_api.py."""
import json
import pathlib
import urllib.request

root=pathlib.Path(__file__).parent
config=json.loads((root/'dist/config.js').read_text().split('window.NERAM_CONFIG = ')[1].strip().rstrip(';'))
def rpc(name,body):
    request=urllib.request.Request(config['url']+'/rest/v1/rpc/'+name,data=json.dumps(body).encode(),headers={'apikey':config['publishableKey'],'Content-Type':'application/json'})
    with urllib.request.urlopen(request,timeout=30) as response:
        return json.load(response)

stops=rpc('neram_find_stops',{'p_query':'Aluva'})
assert any(x['stop_key']=='aluva' for x in stops)
assert not rpc('neram_find_stops',{'p_query':'%unlikely_'})
args={'p_from':'aluva','p_to':'ernakulam','p_after':None,'p_limit':200}
rows=rpc('neram_search_buses',args)
assert rows and all(x['boarding_sequence']<x['alighting_sequence'] for x in rows)
assert all(x['duration_minutes'] is None or x['duration_minutes']>=0 for x in rows)
assert not rpc('neram_search_buses',dict(args,p_to='aluva'))
filtered=rpc('neram_search_buses',dict(args,p_after=1080))
assert filtered and all(x['departure_time']>='18:00' for x in filtered)
journey=rpc('neram_journey',{'p_id':rows[0]['service_id']})
assert len(journey)>=2 and [x['sequence'] for x in journey]==sorted(x['sequence'] for x in journey)
assert any(x['stop'].strip().lower()=='aluva' for x in journey)
assert any(x['stop'].strip().lower()=='ernakulam' for x in journey)
overnight=rpc('neram_search_buses',{'p_from':'mananthavady','p_to':'kottayam','p_after':None,'p_limit':200})
assert any(x['arrival_day'] and x['arrival_day']>0 and x['duration_minutes']>0 for x in overnight)
print(json.dumps({'passed':True,'aluva_ernakulam_matches':len(rows),'after_18_matches':len(filtered),'journey_stop_count':len(journey),'overnight_validated':True}))
