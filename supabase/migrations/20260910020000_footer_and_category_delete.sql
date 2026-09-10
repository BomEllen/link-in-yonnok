-- 1) Profile에 footer_text 추가 (README 데이터 모델에는 없던 필드 - 공개 페이지
--    푸터 두 번째 줄, 지금까지는 "© 2026 seoyeon.link"로 하드코딩돼 있었음).
alter table public.profiles
  add column if not exists footer_text text not null default '© 2026 seoyeon.link';

-- 2) admin_save_page: 카테고리 삭제 지원 추가 + footer_text 반영.
--    파라미터 개수가 바뀌므로(2개 -> 3개) create or replace로는 기존 2-인자 함수가
--    남아 새 오버로드가 하나 더 생기는 꼴이 된다. 옛 시그니처를 명시적으로 지운다.
drop function if exists public.admin_save_page(jsonb, jsonb);

create or replace function public.admin_save_page(
  p_profile jsonb,
  p_categories jsonb,
  p_deleted_category_ids uuid[] default '{}'
)
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
    default_columns = coalesce((p_profile->>'default_columns')::smallint, default_columns),
    footer_text = coalesce(p_profile->>'footer_text', footer_text)
  where id = 1;

  -- 카테고리 삭제 - 해당 카테고리의 링크는 FK의 on delete set null로 자동 미분류 처리됨.
  delete from public.categories where id = any(p_deleted_category_ids);

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

revoke execute on function public.admin_save_page(jsonb, jsonb, uuid[]) from public;
grant execute on function public.admin_save_page(jsonb, jsonb, uuid[]) to authenticated;
