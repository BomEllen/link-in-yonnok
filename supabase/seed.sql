-- 로컬/개발용 샘플 데이터. `supabase db reset` 또는 SQL 편집기에서 수동 실행.
-- 1단계 더미 데이터(lib/dummy-data.ts)와 동일한 내용 + 검증용 케이스 포함:
--   - "비공개 초안" 카테고리(hidden=true) -> 공개 페이지 미노출 확인용
--   - category_id가 null인 링크 -> 공개 페이지 미노출 확인용

insert into public.profiles (id, avatar_url, nickname, bio, banner_enabled, banner_text, default_columns, business_contact_url)
values (
  1,
  '',
  '서연',
  '카페 · 뷰티 · 여행 기록을 링크로 모아둡니다',
  true,
  '제휴 링크를 통한 판매 발생시 소정의 수수료를 제공받습니다.',
  2,
  'mailto:hello@seoyeon.link'
)
on conflict (id) do update set
  avatar_url = excluded.avatar_url,
  nickname = excluded.nickname,
  bio = excluded.bio,
  banner_enabled = excluded.banner_enabled,
  banner_text = excluded.banner_text,
  default_columns = excluded.default_columns,
  business_contact_url = excluded.business_contact_url;

insert into public.categories (id, name, order_index, hidden) values
  ('11111111-1111-1111-1111-111111111111', '카페', 0, false),
  ('22222222-2222-2222-2222-222222222222', '뷰티', 1, false),
  ('33333333-3333-3333-3333-333333333333', '여행', 2, false),
  ('44444444-4444-4444-4444-444444444444', '비공개 초안', 3, true)
on conflict (id) do nothing;

insert into public.links (category_id, thumbnail_url, title, url, order_index) values
  ('11111111-1111-1111-1111-111111111111', '', '핸드드립 원두 - 에티오피아 예가체프 200g', 'https://smartstore.naver.com/coffee-roastery/products/1', 0),
  ('11111111-1111-1111-1111-111111111111', '', '도자기 드리퍼 1~2인용', 'https://www.coupang.com/vp/products/2', 1),
  ('11111111-1111-1111-1111-111111111111', '', '원두 보관용 밀폐 캐니스터', 'https://www.oliveyoung.co.kr/store/goods/3', 2),
  ('11111111-1111-1111-1111-111111111111', '', '내열 유리 커피잔 세트', 'https://www.oliveyoung.co.kr/store/goods/4', 3),
  ('22222222-2222-2222-2222-222222222222', '', '촉촉 립밤 무색 3g', 'https://www.oliveyoung.co.kr/store/goods/5', 0),
  ('22222222-2222-2222-2222-222222222222', '', '저자극 진정 앰플 30ml', 'https://www.coupang.com/vp/products/6', 1),
  ('22222222-2222-2222-2222-222222222222', '', '무기자차 선크림 SPF50+', 'https://www.oliveyoung.co.kr/store/goods/7', 2),
  ('22222222-2222-2222-2222-222222222222', '', '글로우 쿠션 21호', 'https://www.oliveyoung.co.kr/store/goods/8', 3),
  ('33333333-3333-3333-3333-333333333333', '', '제주 오션뷰 숙소 예약 링크', 'https://www.yanolja.com/reservation/9', 0),
  ('33333333-3333-3333-3333-333333333333', '', '기내용 캐리어 20인치', 'https://www.coupang.com/vp/products/10', 1),
  ('33333333-3333-3333-3333-333333333333', '', '여행용 세면 파우치', 'https://www.coupang.com/vp/products/11', 2),
  ('44444444-4444-4444-4444-444444444444', '', '비공개 카테고리 테스트 링크', 'https://example.com/12', 0),
  (null, '', '미분류 링크 - 공개 페이지에는 렌더링되지 않음', 'https://example.com/13', 0);
