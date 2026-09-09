-- 관리자(로그인한 단일 사용자) 전체 CRUD 정책.
-- "authenticated == 관리자 본인"이 성립한다는 전제 하에 작성됨.
-- 이 전제를 지키려면 Supabase 대시보드에서 아래가 반드시 되어 있어야 한다
-- (SQL로 할 수 없는 설정 — docs/access-control.md 참고):
--   1) Authentication > Settings > "Allow new user signups" 끄기
--   2) Authentication > Users에 관리자 본인 이메일 유저를 1명만 미리 생성

create policy "admin full access to profiles"
  on public.profiles for all
  to authenticated
  using (true)
  with check (true);

create policy "admin full access to categories"
  on public.categories for all
  to authenticated
  using (true)
  with check (true);

create policy "admin full access to links"
  on public.links for all
  to authenticated
  using (true)
  with check (true);
