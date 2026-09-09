-- RLS 정책(CREATE POLICY)은 "행 필터"일 뿐, 그 전에 테이블 자체에 대한
-- GRANT가 없으면 Postgres가 permission denied를 낸다. 0001/0002 마이그레이션에서
-- 정책만 만들고 GRANT를 빠뜨렸던 것을 보강한다.

grant usage on schema public to anon, authenticated;

-- 공개 조회(anon): RLS 정책이 hidden=false 등으로 행을 이미 걸러주므로
-- 여기서는 select만 열어준다.
grant select on public.profiles to anon;
grant select on public.categories to anon;
grant select on public.links to anon;

-- 관리자(authenticated): 전체 CRUD. 실제 허용 범위는 RLS 정책이 결정한다.
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.categories to authenticated;
grant select, insert, update, delete on public.links to authenticated;
