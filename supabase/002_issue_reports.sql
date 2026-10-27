-- Visitors may submit bounded timetable corrections, but cannot read or edit reports.
create table public.neram_issue_reports (
 id uuid primary key default gen_random_uuid(),
 service_id text not null references public.neram_services(id),
 category text not null check(category in ('wrong_time','missing_stop','wrong_route','other')),
 details text not null check(length(trim(details)) between 10 and 1000),
 created_at timestamptz not null default now()
);
alter table public.neram_issue_reports enable row level security;
revoke all on public.neram_issue_reports from public,anon,authenticated;
grant insert(service_id,category,details) on public.neram_issue_reports to anon,authenticated;
create policy "Submit a timetable correction" on public.neram_issue_reports
 for insert to anon,authenticated with check (length(trim(details)) between 10 and 1000);
create index neram_issue_reports_service_idx on public.neram_issue_reports(service_id);
notify pgrst,'reload schema';
