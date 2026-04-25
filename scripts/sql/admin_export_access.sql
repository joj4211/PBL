begin;

drop policy if exists "app_users_select_admin_all" on public.app_users;
create policy "app_users_select_admin_all"
on public.app_users
for select
using (public.is_current_user_admin());

drop policy if exists "udp_select_admin_all" on public.user_domain_progress;
create policy "udp_select_admin_all"
on public.user_domain_progress
for select
using (public.is_current_user_admin());

drop policy if exists "da_select_admin_all" on public.domain_assessments;
create policy "da_select_admin_all"
on public.domain_assessments
for select
using (public.is_current_user_admin());

drop policy if exists "ca_select_admin_all" on public.case_attempts;
create policy "ca_select_admin_all"
on public.case_attempts
for select
using (public.is_current_user_admin());

commit;
