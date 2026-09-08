-- Record the consent version accepted during account registration.
-- Existing accounts remain valid and have null consent fields.

begin;

alter table public.app_users
  add column if not exists consent_version text;

alter table public.app_users
  add column if not exists consented_at timestamptz;

comment on column public.app_users.consent_version is
  'Version of the consent statement accepted during registration.';

comment on column public.app_users.consented_at is
  'Timestamp at which the participant accepted the consent statement.';

commit;
