create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $is_admin$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'reviewer')
  );
$is_admin$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $touch_updated_at$
begin
  new.updated_at = now();
  return new;
end;
$touch_updated_at$;

drop trigger if exists reports_touch_updated_at on public.reports;
create trigger reports_touch_updated_at
before update on public.reports
for each row execute function public.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.reports enable row level security;
alter table public.tips enable row level security;
alter table public.case_events enable row level security;

drop policy if exists "profiles are visible to owner" on public.profiles;
create policy "profiles are visible to owner"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "anyone can create reports" on public.reports;
create policy "anyone can create reports"
on public.reports for insert
to anon, authenticated
with check (
  status = 'pending_review'
  and visibility = 'private'
  and published = false
  and sensitive_publication_blocked = true
  and consentimiento_datos = true
  and declaracion_buena_fe = true
);

drop policy if exists "admins can read reports" on public.reports;
create policy "admins can read reports"
on public.reports for select
to authenticated
using (public.is_admin());

drop policy if exists "admins can update reports" on public.reports;
create policy "admins can update reports"
on public.reports for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "anyone can create tips" on public.tips;
create policy "anyone can create tips"
on public.tips for insert
to anon, authenticated
with check (status = 'pending_review' and declaracion_buena_fe = true);

drop policy if exists "admins can read tips" on public.tips;
create policy "admins can read tips"
on public.tips for select
to authenticated
using (public.is_admin());

drop policy if exists "admins can manage tips" on public.tips;
create policy "admins can manage tips"
on public.tips for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admins can read events" on public.case_events;
create policy "admins can read events"
on public.case_events for select
to authenticated
using (public.is_admin());

drop policy if exists "admins can create events" on public.case_events;
create policy "admins can create events"
on public.case_events for insert
to authenticated
with check (public.is_admin());

create or replace view public.public_cases as
select
  id,
  created_at,
  status,
  public_nombre,
  public_ciudad_sector,
  public_edad_aproximada,
  public_resumen,
  updated_at
from public.reports
where published = true
  and status in ('urgent', 'active_search', 'possible_match', 'found', 'escalated_to_authority')
  and public_nombre is not null
  and public_ciudad_sector is not null
  and public_resumen is not null;

grant select on public.public_cases to anon, authenticated;
