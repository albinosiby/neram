-- Read-only timetable API for the separate neram-railway project.
-- Keep original JSON and import/report tables private. No SECURITY DEFINER.
begin;
alter table public.railway_stations enable row level security;
alter table public.railway_trains enable row level security;
alter table public.railway_stop_times enable row level security;
grant usage on schema public to anon, authenticated;
revoke all on public.railway_stations,public.railway_trains,public.railway_stop_times from anon,authenticated;
grant select (station_code,station_name,state,district) on public.railway_stations to anon,authenticated;
grant select (train_id,train_number,train_name,origin_station_code,destination_station_code,operating_days) on public.railway_trains to anon,authenticated;
grant select (train_id,train_number,stop_order,station_code,station_name,arrival_time,departure_time,journey_day) on public.railway_stop_times to anon,authenticated;
create policy neram_station_catalog_read on public.railway_stations for select to anon,authenticated using (true);
create policy neram_train_catalog_read on public.railway_trains for select to anon,authenticated using (true);
create policy neram_railway_times_read on public.railway_stop_times for select to anon,authenticated using (true);
create or replace function public.neram_rail_stations(p_query text)
returns table(code text,name text,state text,district text)
language sql stable security invoker set search_path='' as $$
 select s.station_code,s.station_name,s.state,s.district from public.railway_stations s
 where length(trim(p_query)) between 1 and 80 and
 (lower(s.station_code) like replace(replace(replace(lower(trim(p_query)),'\','\\'),'%','\%'),'_','\_')||'%' or
 lower(s.station_name) like replace(replace(replace(lower(trim(p_query)),'\','\\'),'%','\%'),'_','\_')||'%')
 order by (lower(s.station_code)=lower(trim(p_query))) desc,s.station_name,s.station_code limit 20;
$$;
create or replace function public.neram_rail_search(p_from text,p_to text,p_after integer default null,p_offset integer default 0)
returns table(train_id text,train_number text,train_name text,origin_code text,destination_code text,operating_days text,
 boarding_code text,boarding_name text,departure_time text,boarding_day text,boarding_order integer,
 alighting_code text,alighting_name text,arrival_time text,alighting_day text,alighting_order integer,
 duration_minutes integer,total_results bigint)
language sql stable security invoker set search_path='' as $$
 with matches as (
 select t.train_id,t.train_number,t.train_name,t.origin_station_code,t.destination_station_code,t.operating_days,
 a.station_code as bcode,a.station_name as bname,a.departure_time,a.journey_day as bday,a.stop_order as bord,
 b.station_code as acode,b.station_name as aname,b.arrival_time,b.journey_day as aday,b.stop_order as aord,
 case when a.departure_time ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$' and b.arrival_time ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'
 and a.journey_day ~ '^[0-9]{1,3}$' and b.journey_day ~ '^[0-9]{1,3}$' then
 (b.journey_day::integer-a.journey_day::integer)*1440 +split_part(b.arrival_time,':',1)::integer*60+split_part(b.arrival_time,':',2)::integer
 -split_part(a.departure_time,':',1)::integer*60-split_part(a.departure_time,':',2)::integer end as elapsed
 from public.railway_stop_times a
 join public.railway_stop_times b on b.train_id=a.train_id and b.stop_order>a.stop_order
 join public.railway_trains t on t.train_id=a.train_id
 where a.station_code=upper(trim(p_from)) and b.station_code=upper(trim(p_to)) and p_from<>p_to
 and length(p_from)<=12 and length(p_to)<=12
 and (p_after is null or (p_after between 0 and 1439 and a.departure_time ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$' and a.departure_time::time >= make_time(p_after/60,p_after%60,0)))
 )
 select train_id,train_number,train_name,origin_station_code,destination_station_code,operating_days,
 bcode,bname,departure_time,bday,bord,acode,aname,arrival_time,aday,aord,
 case when elapsed between 0 and 20160 then elapsed else null end,count(*) over()
 from matches order by nullif(departure_time,''),train_number,train_id,bord,aord
 limit 30 offset greatest(0,least(coalesce(p_offset,0),5000));
$$;
create or replace function public.neram_rail_journey(p_id text)
returns table(stop_order integer,station_code text,station_name text,arrival_time text,departure_time text,journey_day text)
language sql stable security invoker set search_path='' as $$
 select s.stop_order,s.station_code,s.station_name,s.arrival_time,s.departure_time,s.journey_day
 from public.railway_stop_times s where s.train_id=p_id and length(p_id)<=30 order by s.stop_order limit 500;
$$;
revoke all on function public.neram_rail_stations(text),public.neram_rail_search(text,text,integer,integer),public.neram_rail_journey(text) from public;
grant execute on function public.neram_rail_stations(text),public.neram_rail_search(text,text,integer,integer),public.neram_rail_journey(text) to anon,authenticated;
commit;
