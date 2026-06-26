drop view if exists public.public_cases;
drop table if exists public.case_events;
drop table if exists public.tips;
drop table if exists public.reports;
drop table if exists public.profiles;
drop type if exists report_status;
drop type if exists app_role;

create extension if not exists pgcrypto;

create type report_status as enum (
  'pending_review',
  'urgent',
  'active_search',
  'possible_match',
  'found',
  'escalated_to_authority',
  'false_report'
);

create type app_role as enum ('admin', 'reviewer');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role app_role not null default 'reviewer',
  created_at timestamptz not null default now()
);

create table public.reports (
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

create table public.tips (
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

create table public.case_events (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references public.reports(id) on delete cascade,
  actor_id uuid references auth.users(id),
  created_at timestamptz not null default now(),
  event_type text not null,
  previous_status report_status,
  new_status report_status,
  note text
);
