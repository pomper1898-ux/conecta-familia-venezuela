-- Safe incremental migration for hospital admissions.
-- Does not drop data. Keeps imported hospital records private until approved.

create table if not exists public.hospital_admissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  import_batch_id text,
  source_url text,
  source_name text,
  nombre_persona text not null,
  edad_aproximada text,
  hospital text,
  ciudad_estado text,
  fecha_ingreso text,
  fecha_publicacion text,
  estado_revision text not null default 'pending_review',
  estado_publico text not null default 'hospitalizado',
  notas_publicas text,
  public_approved boolean not null default false,
  possible_duplicate boolean not null default false,
  duplicate_of uuid references public.hospital_admissions(id),
  confirmado_por_familiar boolean not null default false,
  trasladado boolean not null default false,
  dado_de_alta_reportado boolean not null default false,
  retirado_por_solicitud boolean not null default false,
  private_notes text,
  admin_notes text,
  raw_row jsonb
);

alter table public.hospital_admissions enable row level security;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists hospital_admissions_touch_updated_at on public.hospital_admissions;
create trigger hospital_admissions_touch_updated_at
before update on public.hospital_admissions
for each row execute function public.touch_updated_at();

do $$
begin
  if exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='hospital_admissions'
      and policyname='admins can manage hospital admissions'
  ) then
    alter policy "admins can manage hospital admissions" on public.hospital_admissions
      using (public.is_admin())
      with check (public.is_admin());
  else
    create policy "admins can manage hospital admissions"
      on public.hospital_admissions for all to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end $$;

create or replace view public.public_hospital_admissions as
select
  id,
  updated_at,
  import_batch_id,
  source_url,
  source_name,
  nombre_persona,
  edad_aproximada,
  hospital,
  ciudad_estado,
  fecha_ingreso,
  fecha_publicacion,
  estado_publico,
  notas_publicas,
  possible_duplicate,
  confirmado_por_familiar,
  trasladado,
  dado_de_alta_reportado
from public.hospital_admissions
where public_approved = true
  and retirado_por_solicitud = false;

grant select on public.public_hospital_admissions to anon, authenticated;
