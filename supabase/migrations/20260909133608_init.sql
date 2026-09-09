-- 초기 스키마: Profile(단일 행) / Category / Link
-- 필드명 매핑은 docs/naming.md 참고 (README camelCase -> DB snake_case, position -> order_index)

create extension if not exists pgcrypto;

-- Profile: 행이 정확히 1개만 존재해야 하므로 PK를 상수 1로 고정한다("싱글턴 테이블" 패턴).
create table public.profiles (
  id smallint primary key default 1,
  avatar_url text not null default '',
  nickname text not null default '',
  bio text not null default '',
  banner_enabled boolean not null default true,
  banner_text text not null default '',
  default_columns smallint not null default 2,
  business_contact_url text not null default '',
  constraint profiles_singleton check (id = 1),
  constraint profiles_default_columns_check check (default_columns in (2, 3))
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  order_index integer not null default 0,
  hidden boolean not null default false
);

create index categories_order_index_idx on public.categories (order_index);

create table public.links (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories (id) on delete set null,
  thumbnail_url text not null default '',
  title text not null,
  url text not null,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create index links_category_id_order_index_idx on public.links (category_id, order_index);

-- Row Level Security
-- 지금은 "공개 메인 화면에서 보여도 되는 것만 익명 조회 가능"까지만 정의한다.
-- 관리자(인증된 소유자) 전체 조회/쓰기 정책은 3단계(로그인)에서 별도 마이그레이션으로 추가한다.
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.links enable row level security;

create policy "public can read profile"
  on public.profiles for select
  using (true);

create policy "public can read visible categories"
  on public.categories for select
  using (hidden = false);

create policy "public can read links in visible categories"
  on public.links for select
  using (
    category_id is not null
    and exists (
      select 1 from public.categories c
      where c.id = links.category_id and c.hidden = false
    )
  );

-- Profile 행은 앱이 아니라 이 마이그레이션이 미리 만들어둔다 (행 1개 보장).
insert into public.profiles (id) values (1) on conflict (id) do nothing;
