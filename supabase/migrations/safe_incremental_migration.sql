-- Conecta Familia Venezuela
-- Safe incremental migration
-- Fecha: 2026-06-26
--
-- Objetivo:
-- - No borrar datos existentes.
-- - No usar DROP TABLE, DROP VIEW, DELETE ni TRUNCATE.
-- - Solo se reemplaza el CHECK constraint de correction_requests.request_type
--   si existe uno anterior; esto no borra datos, solo actualiza valores permitidos.
-- - Crear tablas faltantes con IF NOT EXISTS.
-- - Agregar columnas faltantes con IF NOT EXISTS.
-- - Activar RLS.
-- - Crear o ajustar policies mediante ALTER POLICY cuando existen.
-- - Crear vistas publicas seguras sin telefonos, cedulas, direcciones exactas,
--   nombres de reportantes, datos medicos sensibles, admin_notes ni private_notes.

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
exception when duplicate_object then null;
end $$;

do $$ begin
  create type app_role as enum ('admin', 'reviewer');
exception when duplicate_object then null;
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
  whatsapp_reportante_private text not null default '',
  relacion_con_persona text not null,
  consentimiento_datos boolean not null default false,
  declaracion_buena_fe boolean not null default false
);

alter table public.reports add column if not exists source_type text;
alter table public.reports add column if not exists source_url text;
alter table public.reports add column if not exists photo_url text;
alter table public.reports add column if not exists duplicate_of_report_id uuid references public.reports(id);
alter table public.reports add column if not exists public_nombre text;
alter table public.reports add column if not exists public_ciudad_sector text;
alter table public.reports add column if not exists public_edad_aproximada text;
alter table public.reports add column if not exists public_resumen text;
alter table public.reports add column if not exists public_source_url text;
alter table public.reports add column if not exists public_photo_url text;
alter table public.reports add column if not exists reviewed_by uuid references auth.users(id);
alter table public.reports add column if not exists reviewed_at timestamptz;

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

create table if not exists public.support_centers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  city text not null,
  type text not null,
  description text,
  lat numeric,
  lng numeric,
  url text,
  published boolean not null default true
);

create table if not exists public.import_batches (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  source_name text,
  source_url text,
  row_count integer not null default 0,
  note text
);

create table if not exists public.correction_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status report_status not null default 'pending_review',
  case_name text not null,
  request_type text not null,
  detail text not null,
  requester_name text not null,
  requester_contact_private text not null,
  good_faith boolean not null default false
);

alter table public.correction_requests add column if not exists source_url text;
alter table public.correction_requests add column if not exists relationship text;
alter table public.correction_requests add column if not exists consent boolean not null default false;

do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select conname
    from pg_constraint
    where conrelid = 'public.correction_requests'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) like '%request_type%'
  loop
    execute format('alter table public.correction_requests drop constraint %I', constraint_name);
  end loop;

  alter table public.correction_requests
    add constraint correction_requests_request_type_safe_check
    check (request_type in (
      'dato_incorrecto',
      'persona_localizada',
      'duplicado',
      'retirar_informacion',
      'informacion_falsa'
    )) not valid;
end $$;

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

-- Base de datos futura para Fase 2/Fase 3. No se publica nada automaticamente.
create table if not exists public.aid_centers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'pendiente',
  public_approved boolean not null default false,
  nombre text not null,
  tipo text not null,
  pais text,
  estado_region text,
  ciudad text,
  direccion_general text,
  referencia text,
  latitud numeric,
  longitud numeric,
  horario text,
  telefono_publico text,
  que_recibe text,
  que_ofrece text,
  fuente_url text,
  fuente_nombre text,
  fecha_verificacion date,
  verificado_por text,
  submitted_by_name text,
  submitted_by_whatsapp_private text,
  consentimiento boolean not null default false,
  declaracion_buena_fe boolean not null default false,
  admin_notes text
);

create table if not exists public.external_sources (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'pendiente',
  public_approved boolean not null default false,
  nombre_fuente text not null,
  tipo_fuente text not null,
  url text not null,
  pais text,
  estado_region text,
  descripcion text,
  fecha_verificacion date,
  verificado_por text,
  nivel_confianza text not null default 'no_confirmada',
  submitted_by_name text,
  submitted_by_whatsapp_private text,
  consentimiento boolean not null default false,
  declaracion_buena_fe boolean not null default false,
  admin_notes text
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('admin', 'reviewer')
  );
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

alter table public.profiles enable row level security;
alter table public.reports enable row level security;
alter table public.tips enable row level security;
alter table public.support_centers enable row level security;
alter table public.import_batches enable row level security;
alter table public.correction_requests enable row level security;
alter table public.case_events enable row level security;
alter table public.aid_centers enable row level security;
alter table public.external_sources enable row level security;

-- Helper: crear policy si falta; si existe, actualizarla con ALTER POLICY.
do $$
begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='profiles visible to owner or admin') then
    alter policy "profiles visible to owner or admin" on public.profiles
      using (id = auth.uid() or public.is_admin());
  else
    create policy "profiles visible to owner or admin"
      on public.profiles for select to authenticated
      using (id = auth.uid() or public.is_admin());
  end if;
end $$;

do $$
begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename='reports' and policyname='anyone can create pending private reports') then
    alter policy "anyone can create pending private reports" on public.reports
      with check (
        status = 'pending_review'
        and visibility = 'private'
        and published = false
        and sensitive_publication_blocked = true
        and consentimiento_datos = true
        and declaracion_buena_fe = true
      );
  else
    create policy "anyone can create pending private reports"
      on public.reports for insert to anon, authenticated
      with check (
        status = 'pending_review'
        and visibility = 'private'
        and published = false
        and sensitive_publication_blocked = true
        and consentimiento_datos = true
        and declaracion_buena_fe = true
      );
  end if;
end $$;

do $$
begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename='reports' and policyname='admins can read reports') then
    alter policy "admins can read reports" on public.reports using (public.is_admin());
  else
    create policy "admins can read reports"
      on public.reports for select to authenticated
      using (public.is_admin());
  end if;

  if exists (select 1 from pg_policies where schemaname='public' and tablename='reports' and policyname='admins can update reports') then
    alter policy "admins can update reports" on public.reports
      using (public.is_admin())
      with check (public.is_admin());
  else
    create policy "admins can update reports"
      on public.reports for update to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end $$;

do $$
begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename='tips' and policyname='anyone can create tips') then
    alter policy "anyone can create tips" on public.tips
      with check (status = 'pending_review' and declaracion_buena_fe = true);
  else
    create policy "anyone can create tips"
      on public.tips for insert to anon, authenticated
      with check (status = 'pending_review' and declaracion_buena_fe = true);
  end if;

  if exists (select 1 from pg_policies where schemaname='public' and tablename='tips' and policyname='admins can manage tips') then
    alter policy "admins can manage tips" on public.tips
      using (public.is_admin())
      with check (public.is_admin());
  else
    create policy "admins can manage tips"
      on public.tips for all to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end $$;

do $$
begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename='support_centers' and policyname='public can read published centers') then
    alter policy "public can read published centers" on public.support_centers
      using (published = true);
  else
    create policy "public can read published centers"
      on public.support_centers for select to anon, authenticated
      using (published = true);
  end if;

  if exists (select 1 from pg_policies where schemaname='public' and tablename='support_centers' and policyname='admins can manage centers') then
    alter policy "admins can manage centers" on public.support_centers
      using (public.is_admin())
      with check (public.is_admin());
  else
    create policy "admins can manage centers"
      on public.support_centers for all to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end $$;

do $$
begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename='correction_requests' and policyname='anyone can request correction') then
    alter policy "anyone can request correction" on public.correction_requests
      with check (status = 'pending_review' and consent = true and good_faith = true);
  else
    create policy "anyone can request correction"
      on public.correction_requests for insert to anon, authenticated
      with check (status = 'pending_review' and consent = true and good_faith = true);
  end if;

  if exists (select 1 from pg_policies where schemaname='public' and tablename='correction_requests' and policyname='admins can read correction requests') then
    alter policy "admins can read correction requests" on public.correction_requests
      using (public.is_admin());
  else
    create policy "admins can read correction requests"
      on public.correction_requests for select to authenticated
      using (public.is_admin());
  end if;

  if exists (select 1 from pg_policies where schemaname='public' and tablename='correction_requests' and policyname='admins can update correction requests') then
    alter policy "admins can update correction requests" on public.correction_requests
      using (public.is_admin())
      with check (public.is_admin());
  else
    create policy "admins can update correction requests"
      on public.correction_requests for update to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end $$;

do $$
begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename='aid_centers' and policyname='anyone can suggest aid center') then
    alter policy "anyone can suggest aid center" on public.aid_centers
      with check (status = 'pendiente' and public_approved = false and consentimiento = true and declaracion_buena_fe = true);
  else
    create policy "anyone can suggest aid center"
      on public.aid_centers for insert to anon, authenticated
      with check (status = 'pendiente' and public_approved = false and consentimiento = true and declaracion_buena_fe = true);
  end if;

  if exists (select 1 from pg_policies where schemaname='public' and tablename='aid_centers' and policyname='admins can manage aid centers') then
    alter policy "admins can manage aid centers" on public.aid_centers
      using (public.is_admin())
      with check (public.is_admin());
  else
    create policy "admins can manage aid centers"
      on public.aid_centers for all to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end $$;

do $$
begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename='external_sources' and policyname='anyone can suggest external source') then
    alter policy "anyone can suggest external source" on public.external_sources
      with check (status = 'pendiente' and public_approved = false and consentimiento = true and declaracion_buena_fe = true);
  else
    create policy "anyone can suggest external source"
      on public.external_sources for insert to anon, authenticated
      with check (status = 'pendiente' and public_approved = false and consentimiento = true and declaracion_buena_fe = true);
  end if;

  if exists (select 1 from pg_policies where schemaname='public' and tablename='external_sources' and policyname='admins can manage external sources') then
    alter policy "admins can manage external sources" on public.external_sources
      using (public.is_admin())
      with check (public.is_admin());
  else
    create policy "admins can manage external sources"
      on public.external_sources for all to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end $$;

do $$
begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename='import_batches' and policyname='admins can manage imports') then
    alter policy "admins can manage imports" on public.import_batches
      using (public.is_admin())
      with check (public.is_admin());
  else
    create policy "admins can manage imports"
      on public.import_batches for all to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;

  if exists (select 1 from pg_policies where schemaname='public' and tablename='case_events' and policyname='admins can manage events') then
    alter policy "admins can manage events" on public.case_events
      using (public.is_admin())
      with check (public.is_admin());
  else
    create policy "admins can manage events"
      on public.case_events for all to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end $$;

create or replace view public.public_people_records as
select
  id,
  created_at as fecha_reporte,
  updated_at as fecha_verificacion,
  status as estado_actual,
  public_nombre as nombre_persona,
  public_edad_aproximada as edad_aproximada,
  public_ciudad_sector as ciudad_estado,
  null::text as sector_general,
  public_resumen,
  'revisado'::text as nivel_confianza,
  public_source_url as fuente_url,
  public_source_url as fuente_nombre,
  public_photo_url
from public.reports
where published = true
  and public_nombre is not null
  and public_resumen is not null;

create or replace view public.public_cases as
select
  id,
  created_at,
  updated_at,
  status,
  public_nombre,
  public_ciudad_sector,
  public_edad_aproximada,
  public_resumen,
  public_source_url,
  public_photo_url
from public.reports
where published = true
  and status in ('urgent', 'active_search', 'possible_match', 'found', 'escalated_to_authority')
  and public_nombre is not null
  and public_ciudad_sector is not null
  and public_resumen is not null;

create or replace view public.public_aid_centers as
select
  id,
  nombre,
  tipo,
  pais,
  estado_region,
  ciudad,
  direccion_general,
  referencia,
  latitud,
  longitud,
  horario,
  telefono_publico,
  que_recibe,
  que_ofrece,
  fuente_url,
  fuente_nombre,
  fecha_verificacion,
  verificado_por,
  status as estado
from public.aid_centers
where public_approved = true
  and status in ('verificado', 'desactualizado');

create or replace view public.public_external_sources as
select
  id,
  nombre_fuente,
  tipo_fuente,
  url,
  pais,
  estado_region,
  descripcion,
  fecha_verificacion,
  verificado_por,
  nivel_confianza,
  status as estado
from public.external_sources
where public_approved = true
  and status = 'activa';

create or replace view public.public_centers as
select id, name, city, type, description, lat, lng, url
from public.support_centers
where published = true;

grant select on public.public_people_records to anon, authenticated;
grant select on public.public_cases to anon, authenticated;
grant select on public.public_aid_centers to anon, authenticated;
grant select on public.public_external_sources to anon, authenticated;
grant select on public.public_centers to anon, authenticated;
