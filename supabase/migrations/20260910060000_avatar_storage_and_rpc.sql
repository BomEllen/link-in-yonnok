-- 프로필 아바타용 공개 Storage 버킷 + 권한 (link-thumbnails와 동일한 패턴).
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "public can read avatars"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

create policy "admin can upload avatars"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars');

create policy "admin can update avatars"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars');

create policy "admin can delete avatars"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'avatars');

-- admin_save_page가 avatar_url도 갱신하게 확장.
drop function if exists public.admin_save_page(jsonb, jsonb, uuid[]);

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
    avatar_url = coalesce(p_profile->>'avatar_url', avatar_url),
    nickname = coalesce(p_profile->>'nickname', nickname),
    bio = coalesce(p_profile->>'bio', bio),
    banner_enabled = coalesce((p_profile->>'banner_enabled')::boolean, banner_enabled),
    default_columns = coalesce((p_profile->>'default_columns')::smallint, default_columns),
    footer_text = coalesce(p_profile->>'footer_text', footer_text)
  where id = 1;

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
