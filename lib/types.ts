// 필드명은 DB 컬럼명(snake_case)과 1:1로 맞춘다 — 매핑 레이어를 두지 않는다.
// README(camelCase)와의 대응 관계는 docs/naming.md 참고.

export type Profile = {
  avatar_url: string;
  nickname: string;
  bio: string;
  banner_enabled: boolean;
  banner_text: string;
  default_columns: 2 | 3;
  business_contact_url: string;
  footer_text: string;
};

export type Category = {
  id: string;
  name: string;
  order_index: number;
  hidden: boolean;
  // true면 항상 목록 맨 앞에 정렬됨 ("이번달 픽" 전용, 보통 하나만 존재).
  is_pinned: boolean;
};

export type Link = {
  id: string;
  category_id: string | null;
  // 원래 카테고리(category_id)를 유지한 채로 "이번달 픽" 같은 is_pinned
  // 카테고리에도 추가로 소속시킬 때 쓴다. 보통 null.
  pinned_category_id: string | null;
  thumbnail_url: string;
  title: string;
  url: string;
  order_index: number;
  created_at: string;
};
