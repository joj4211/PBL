begin;

alter table public.app_users
  add column if not exists display_name text;

alter table public.app_users
  add column if not exists user_account text;

update public.app_users as app
set
  user_account = coalesce(
    nullif(trim(app.user_account), ''),
    auth_user.email
  ),
  display_name = coalesce(
    nullif(trim(app.display_name), ''),
    nullif(trim(auth_user.raw_user_meta_data ->> 'display_name'), ''),
    nullif(trim(auth_user.raw_user_meta_data ->> 'full_name'), ''),
    split_part(auth_user.email, '@', 1)
  )
from auth.users as auth_user
where app.user_id = auth_user.id::text
  and (
    app.user_account is null
    or trim(app.user_account) = ''
    or app.display_name is null
    or trim(app.display_name) = ''
  );

alter table public.app_users
  drop constraint if exists app_users_display_name_not_blank;

alter table public.app_users
  add constraint app_users_display_name_not_blank
  check (display_name is not null and length(trim(display_name)) > 0)
  not valid;

alter table public.app_users
  drop constraint if exists app_users_user_account_not_blank;

alter table public.app_users
  add constraint app_users_user_account_not_blank
  check (user_account is not null and length(trim(user_account)) > 0)
  not valid;

create unique index if not exists idx_app_users_user_account_unique
  on public.app_users (lower(user_account))
  where user_account is not null and length(trim(user_account)) > 0;

commit;

-- 找出還沒補齊姓名/帳號的 legacy rows
select
  app.user_id,
  app.user_account,
  app.display_name,
  auth_user.email as auth_email,
  auth_user.raw_user_meta_data ->> 'display_name' as auth_display_name,
  app.created_at
from public.app_users as app
left join auth.users as auth_user
  on auth_user.id::text = app.user_id
where app.display_name is null
   or trim(app.display_name) = ''
   or app.user_account is null
   or trim(app.user_account) = ''
order by app.created_at desc;

-- 查目前已註冊帳號與 user_id 對應
select
  auth_user.id::text as user_id,
  auth_user.email as user_account,
  coalesce(
    nullif(trim(app.display_name), ''),
    nullif(trim(auth_user.raw_user_meta_data ->> 'display_name'), ''),
    nullif(trim(auth_user.raw_user_meta_data ->> 'full_name'), ''),
    split_part(auth_user.email, '@', 1)
  ) as display_name,
  app.medical_role,
  app."isAdmin",
  auth_user.created_at,
  auth_user.last_sign_in_at
from auth.users as auth_user
left join public.app_users as app
  on app.user_id = auth_user.id::text
order by auth_user.created_at desc;
