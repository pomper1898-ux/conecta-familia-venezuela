create extension if not exists pgcrypto;

do $$ begin
  create type report_status as enum (
    'pending_review',
    'urgent',
    'active_search',
    'possible_match',
    'found',
    'escalated_to_authority',
    'false_report'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type app_role as enum ('admin', 'reviewer');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role app_role not null default 'reviewer',
  created_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  tipo_reporte text not null,
  status report_status not null default 'pending_review',
  visibility text not null default 'private',
  published boolean not null default false,
  sensitive_publication_blocked boolean not null default true,
  nombre_persona text not null,
  ciudad_sector text not null,
  ultimo_contacto_o_lugar_visto text not null,
  edad_aproximada text not null,
  descripcion text not null,
  estado_general text not null,
  nombre_reportante text not null,
  whatsapp_reportante_private text not null,
  relacion_con_persona text not null,
  consentimiento_datos boolean not null default false,
  declaracion_buena_fe boolean not null default false,
  public_nombre text,
  public_ciudad_sector text,
  public_edad_aproximada text,
  public_resumen text,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  constraint reports_private_default check (visibility = 'private'),
  constraint reports_require_consent check (consentimiento_datos and declaracion_buena_fe)
);

create table if not exists public.tips (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references public.reports(id) on delete set null,
  created_at timestamptz not null default now(),
  status report_status not null default 'pending_review',
  nombre_informante text,
  whatsapp_informante_private text,
  ciudad_sector text not null,
  informacion text not null,
  declaracion_buena_fe boolean not null default false
);

create table if not exists public.case_events (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references public.reports(id) on delete cascade,
  actor_id uuid references auth.users(id),
  created_at timestamptz not null default now(),
  event_type text not null,
  previous_status report_status,
  new_status report_status,
  note text
);

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

-- After creating your first auth user, promote them manually:
-- insert into public.profiles (id, email, role)
-- select id, email, 'admin'::app_role from auth.users where email = 'tu-correo@example.com'
-- on conflict (id) do update set role = 'admin';
