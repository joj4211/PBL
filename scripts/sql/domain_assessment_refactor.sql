-- Domain pre/post assessments + unified case_attempts answers payload
-- Safe to run in Supabase SQL Editor.

begin;

-- 0) Optional cleanup: remove legacy attempts data before enforcing new payload shape.
-- Uncomment if you want a clean reset.
-- truncate table public.case_attempts;

-- 1) user_domain_progress: per-user, per-domain access gates and rollups.
create table if not exists public.user_domain_progress (
  user_id text not null references public.app_users(user_id) on delete cascade,
  domain_id text not null check (domain_id in ('ear', 'nose', 'throat')),
  pretest_completed boolean not null default false,
  posttest_completed boolean not null default false,
  latest_pretest_score int4,
  best_pretest_score int4,
  latest_posttest_score int4,
  best_posttest_score int4,
  pretest_completed_at timestamptz,
  posttest_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, domain_id)
);

create index if not exists idx_user_domain_progress_user_id
  on public.user_domain_progress(user_id);

create index if not exists idx_user_domain_progress_domain_id
  on public.user_domain_progress(domain_id);

-- 2) domain_assessments: keep full history of retries.
create table if not exists public.domain_assessments (
  id bigserial primary key,
  user_id text not null references public.app_users(user_id) on delete cascade,
  domain_id text not null check (domain_id in ('ear', 'nose', 'throat')),
  assessment_type text not null check (assessment_type in ('preTest', 'postTest')),
  score int4 not null check (score between 0 and 100),
  answers jsonb not null,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_domain_assessments_user_domain
  on public.domain_assessments(user_id, domain_id);

create index if not exists idx_domain_assessments_type
  on public.domain_assessments(assessment_type);

create index if not exists idx_domain_assessments_completed_at
  on public.domain_assessments(completed_at desc);

-- 3) Trigger helper for updated_at.
create or replace function public.set_updated_at_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Recreate trigger to avoid duplicates.
drop trigger if exists trg_user_domain_progress_set_updated_at on public.user_domain_progress;

create trigger trg_user_domain_progress_set_updated_at
before update on public.user_domain_progress
for each row
execute function public.set_updated_at_timestamp();

-- 4) Enforce new answers payload shape for case_attempts.
--    Required keys: schemaVersion, caseMeta, summary.overall(number), steps(array)
alter table public.case_attempts
  alter column answers set not null;

alter table public.case_attempts
  drop constraint if exists case_attempts_answers_shape_check;

alter table public.case_attempts
  add constraint case_attempts_answers_shape_check
  check (
    jsonb_typeof(answers) = 'object'
    and answers ? 'schemaVersion'
    and answers ? 'caseMeta'
    and answers ? 'summary'
    and answers ? 'steps'
    and jsonb_typeof(answers->'steps') = 'array'
    and jsonb_typeof(answers->'summary') = 'object'
    and jsonb_typeof((answers->'summary'->'overall')) = 'number'
  );

create index if not exists idx_case_attempts_user_domain_case
  on public.case_attempts(user_id, domain, case_id);

-- 5) Keep progress and score rollups in sync with domain_assessments inserts.
create or replace function public.sync_user_domain_progress_from_assessment()
returns trigger
language plpgsql
as $$
declare
  latest_score int4;
  best_score int4;
begin
  -- latest score = this inserted attempt score
  latest_score := new.score;

  -- best score from history of the same assessment type
  select max(score)
    into best_score
    from public.domain_assessments
   where user_id = new.user_id
     and domain_id = new.domain_id
     and assessment_type = new.assessment_type;

  if new.assessment_type = 'preTest' then
    insert into public.user_domain_progress (
      user_id,
      domain_id,
      pretest_completed,
      latest_pretest_score,
      best_pretest_score,
      pretest_completed_at
    ) values (
      new.user_id,
      new.domain_id,
      true,
      latest_score,
      coalesce(best_score, latest_score),
      new.completed_at
    )
    on conflict (user_id, domain_id)
    do update set
      pretest_completed = true,
      latest_pretest_score = excluded.latest_pretest_score,
      best_pretest_score = greatest(coalesce(public.user_domain_progress.best_pretest_score, 0), excluded.best_pretest_score),
      pretest_completed_at = coalesce(public.user_domain_progress.pretest_completed_at, excluded.pretest_completed_at),
      updated_at = now();
  else
    insert into public.user_domain_progress (
      user_id,
      domain_id,
      posttest_completed,
      latest_posttest_score,
      best_posttest_score,
      posttest_completed_at
    ) values (
      new.user_id,
      new.domain_id,
      true,
      latest_score,
      coalesce(best_score, latest_score),
      new.completed_at
    )
    on conflict (user_id, domain_id)
    do update set
      posttest_completed = true,
      latest_posttest_score = excluded.latest_posttest_score,
      best_posttest_score = greatest(coalesce(public.user_domain_progress.best_posttest_score, 0), excluded.best_posttest_score),
      posttest_completed_at = coalesce(public.user_domain_progress.posttest_completed_at, excluded.posttest_completed_at),
      updated_at = now();
  end if;

  return new;
end;
$$;

drop trigger if exists trg_domain_assessments_sync_progress on public.domain_assessments;

create trigger trg_domain_assessments_sync_progress
after insert on public.domain_assessments
for each row
execute function public.sync_user_domain_progress_from_assessment();

-- 6) RLS
alter table public.user_domain_progress enable row level security;
alter table public.domain_assessments enable row level security;

-- drop/recreate policies for idempotency
-- user_domain_progress
DROP POLICY IF EXISTS "udp_select_own" ON public.user_domain_progress;
DROP POLICY IF EXISTS "udp_insert_own" ON public.user_domain_progress;
DROP POLICY IF EXISTS "udp_update_own" ON public.user_domain_progress;

create policy "udp_select_own"
on public.user_domain_progress
for select
using (auth.uid()::text = user_id);

create policy "udp_insert_own"
on public.user_domain_progress
for insert
with check (auth.uid()::text = user_id);

create policy "udp_update_own"
on public.user_domain_progress
for update
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

-- domain_assessments
DROP POLICY IF EXISTS "da_select_own" ON public.domain_assessments;
DROP POLICY IF EXISTS "da_insert_own" ON public.domain_assessments;

create policy "da_select_own"
on public.domain_assessments
for select
using (auth.uid()::text = user_id);

create policy "da_insert_own"
on public.domain_assessments
for insert
with check (auth.uid()::text = user_id);

commit;
