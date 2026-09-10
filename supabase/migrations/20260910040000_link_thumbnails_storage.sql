-- 5단계: 링크 썸네일 이미지를 담을 공개 Storage 버킷 + 권한.
-- public=true라 getPublicUrl()로 바로 접근 가능하지만, storage.objects의
-- select 정책도 명시적으로 열어둔다(버킷 public 플래그만으로는 목록 조회 등
-- 일부 동작에서 RLS가 계속 적용될 수 있음).

insert into storage.buckets (id, name, public)
values ('link-thumbnails', 'link-thumbnails', true)
on conflict (id) do nothing;

create policy "public can read link thumbnails"
  on storage.objects for select
  to public
  using (bucket_id = 'link-thumbnails');

create policy "admin can upload link thumbnails"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'link-thumbnails');

create policy "admin can update link thumbnails"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'link-thumbnails');

create policy "admin can delete link thumbnails"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'link-thumbnails');
