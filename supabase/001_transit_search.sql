-- Public timetable projection. Source payloads and migration backups remain private.
create table public.neram_services (
 id text primary key, name text, origin text, destination text,
 operator text not null, service_type text, source_url text, fetched_at text
);
create table public.neram_stop_times (
 service_id text references public.neram_services(id), sequence integer,
 stop text, stop_key text, time text, day_offset integer, minutes integer,
 primary key(service_id,sequence)
);
insert into public.neram_services
select id,name,origin,destination,
 case when upper(name) like '%KSRTC%' or upper(name) like '%K S R T C%' then 'KSRTC' else 'Private' end,
 payload->>'service_type',payload->>'source_url',payload->>'fetched_at'
from neram_data.services;
insert into public.neram_stop_times
select service_id,sequence,trim(stop),lower(trim(stop)),time,day_offset,
case when time ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'
 then split_part(time,':',1)::integer*60+split_part(time,':',2)::integer+coalesce(day_offset,0)*1440 end
from neram_data.stops;
create table public.neram_stops (stop_key text primary key, name text not null, service_count integer not null);
insert into public.neram_stops
select stop_key,min(stop),count(distinct service_id)::integer from public.neram_stop_times
where length(stop_key) between 2 and 100 and stop_key !~ E'[\\n\\r]' and stop_key !~ '[0-9]:[0-9]' group by stop_key;
create index neram_stop_times_lookup_idx on public.neram_stop_times(stop_key,service_id,sequence) include(minutes,time,day_offset);
create index neram_stops_prefix_idx on public.neram_stops(stop_key text_pattern_ops);
alter table public.neram_services enable row level security;
alter table public.neram_stop_times enable row level security;
alter table public.neram_stops enable row level security;
revoke all on public.neram_services,public.neram_stop_times,public.neram_stops from public,anon,authenticated;
grant select on public.neram_services,public.neram_stop_times,public.neram_stops to anon,authenticated;
create policy "Read public timetables" on public.neram_services for select to anon,authenticated using(true);
create policy "Read public stop times" on public.neram_stop_times for select to anon,authenticated using(true);
create policy "Read public stops" on public.neram_stops for select to anon,authenticated using(true);
create function public.neram_find_stops(p_query text default '')
returns table(stop_key text,name text,service_count integer)
language sql stable security invoker set search_path=pg_catalog
as $$
 select s.stop_key,s.name,s.service_count from public.neram_stops s
 where length(p_query)<=100 and (length(trim(p_query))=0 or s.stop_key like replace(replace(replace(lower(trim(p_query)),'\','\\'),'%','\%'),'_','\_') || '%')
 order by case when s.stop_key=lower(trim(p_query)) then 0 else 1 end,s.service_count desc,s.stop_key limit 20;
$$;
create function public.neram_search_buses(p_from text,p_to text,p_after integer default null,p_limit integer default 100)
returns table(service_id text,name text,operator text,service_type text,origin text,destination text,boarding_stop text,alighting_stop text,departure_time text,arrival_time text,duration_minutes integer,boarding_sequence integer,alighting_sequence integer,arrival_day integer,total_matches bigint)
language sql stable security invoker set search_path=pg_catalog
as $$
 with matches as (
 select distinct on(s.id) s.id,s.name,s.operator,s.service_type,s.origin,s.destination,
 a.stop as boarding_stop,b.stop as alighting_stop,a.time as departure_time,b.time as arrival_time,
 case when b.minutes>=a.minutes then b.minutes-a.minutes end as duration_minutes,
 a.sequence as boarding_sequence,b.sequence as alighting_sequence,
 case when a.minutes is not null and b.minutes is not null then b.minutes/1440-a.minutes/1440 end as arrival_day,
 a.minutes%1440 as departure_minute
 from public.neram_stop_times a
 join public.neram_stop_times b on b.service_id=a.service_id and b.sequence>a.sequence
 join public.neram_services s on s.id=a.service_id
 where length(p_from) between 2 and 100 and length(p_to) between 2 and 100
 and a.stop_key=lower(trim(p_from)) and b.stop_key=lower(trim(p_to))
 and lower(trim(p_from))<>lower(trim(p_to))
 and (p_after is null or a.minutes%1440>=p_after)
 order by s.id,a.sequence,b.sequence
 )
 select id,name,operator,service_type,origin,destination,boarding_stop,alighting_stop,departure_time,arrival_time,duration_minutes,boarding_sequence,alighting_sequence,arrival_day,count(*) over()
 from matches order by departure_minute nulls last,name,id limit greatest(1,least(coalesce(p_limit,100),200));
$$;
create function public.neram_journey(p_id text)
returns table(sequence integer,stop text,"time" text,day_offset integer)
language sql stable security invoker set search_path=pg_catalog
as $$ select s.sequence,s.stop,s.time,s.day_offset from public.neram_stop_times s where s.service_id=p_id and length(p_id)<=100 order by s.sequence limit 500; $$;
revoke all on function public.neram_find_stops(text),public.neram_search_buses(text,text,integer,integer),public.neram_journey(text) from public,anon,authenticated;
grant execute on function public.neram_find_stops(text),public.neram_search_buses(text,text,integer,integer),public.neram_journey(text) to anon,authenticated;
analyze public.neram_services;
analyze public.neram_stop_times;
analyze public.neram_stops;
notify pgrst,'reload schema';
