-- "이번달 픽" 기능: 특정 카테고리를 항상 최상단에 고정하고, 링크가 원래
-- 카테고리(category_id)에 속한 채로 동시에 이 카테고리에도 들어갈 수 있게 한다.
--
-- 설계: 새 컬럼 두 개만 추가한다.
--   categories.is_pinned  - true인 카테고리는 정렬 시 항상 맨 앞
--   links.pinned_category_id - "추가로" 소속되는 카테고리(항상 is_pinned=true인
--     카테고리를 가리킬 것을 기대함). links.category_id(원래 카테고리)는 그대로 둔다.
-- 범용 다대다(link_categories 정션 테이블)로 만들지 않은 이유: 지금 필요한 건
-- "이번달 픽 카테고리 하나만 중복 소속 허용"이지 모든 카테고리 간 다대다가
-- 아니라서, 컬럼 두 개가 스키마도 쿼리도 훨씬 단순하다.

alter table public.categories
  add column if not exists is_pinned boolean not null default false;

alter table public.links
  add column if not exists pinned_category_id uuid references public.categories(id) on delete set null;

create index if not exists links_pinned_category_id_idx on public.links (pinned_category_id);

-- "이번달 픽" 카테고리가 아직 없으면 하나 만든다 (이미 있으면 건너뜀).
insert into public.categories (name, order_index, hidden, is_pinned)
select '이번달 픽', -1, false, true
where not exists (select 1 from public.categories where is_pinned = true);

-- 공개 조회 정책 갱신: 링크가 pinned_category_id를 통해서만 보여도(주 카테고리가
-- 없거나 숨김이어도) 그 pinned 카테고리가 공개 상태면 노출한다.
drop policy if exists "public can read links in visible categories" on public.links;

create policy "public can read links in visible categories"
  on public.links for select
  using (
    (
      category_id is not null
      and exists (select 1 from public.categories c where c.id = links.category_id and c.hidden = false)
    )
    or
    (
      pinned_category_id is not null
      and exists (select 1 from public.categories c where c.id = links.pinned_category_id and c.hidden = false)
    )
  );
