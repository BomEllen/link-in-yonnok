-- 관리 화면(4단계) "변경 사항 저장" 커밋 지점.
-- 프로필 필드 + 카테고리 전체(이름/노출/순서, 신규 포함)를 한 함수 호출 = 한 트랜잭션으로
-- 처리한다. PostgREST는 rpc 호출 하나를 하나의 트랜잭션으로 감싸므로, 중간에 예외가 나면
-- (예: default_columns check 제약 위반) 전부 롤백되고 order_index가 반쯤 어긋나는 일이 없다.
--
-- security invoker: 호출한 세션의 권한으로 실행되므로 RLS가 그대로 적용된다
-- (authenticated만 admin_policies 마이그레이션 정책으로 쓰기 가능 - 함수 자체가 별도
-- 우회 경로가 되지 않는다).
--
-- 갱신된 categories 전체를 돌려준다 - 신규 카테고리가 방금 받은 실제 id를 클라이언트가
-- 알아야 다음 저장 때 같은 행을 다시 insert하지 않고 update할 수 있다.

create or replace function public.admin_save_page(p_profile jsonb, p_categories jsonb)
returns setof public.categories
language plpgsql
security invoker
set search_path = public
as $$
declare
  cat jsonb;
  cat_id uuid;
begin
  update public.profiles set
    nickname = coalesce(p_profile->>'nickname', nickname),
    bio = coalesce(p_profile->>'bio', bio),
    banner_enabled = coalesce((p_profile->>'banner_enabled')::boolean, banner_enabled),
    default_columns = coalesce((p_profile->>'default_columns')::smallint, default_columns)
  where id = 1;

  for cat in select * from jsonb_array_elements(p_categories)
  loop
    cat_id := nullif(cat->>'id', '')::uuid;

    if cat_id is not null then
      update public.categories set
        name = cat->>'name',
        hidden = (cat->>'hidden')::boolean,
        order_index = (cat->>'order_index')::integer
      where id = cat_id;
    else
      insert into public.categories (name, hidden, order_index)
      values (cat->>'name', (cat->>'hidden')::boolean, (cat->>'order_index')::integer);
    end if;
  end loop;

  return query select * from public.categories order by order_index, id;
end;
$$;

-- CREATE FUNCTION은 기본적으로 PUBLIC에 EXECUTE를 준다 - 명시적으로 잠그고 authenticated만 허용.
revoke execute on function public.admin_save_page(jsonb, jsonb) from public;
grant execute on function public.admin_save_page(jsonb, jsonb) to authenticated;
