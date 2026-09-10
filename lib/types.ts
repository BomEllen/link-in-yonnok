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
};

export type Link = {
  id: string;
  category_id: string | null;
  thumbnail_url: string;
  title: string;
  url: string;
  order_index: number;
  created_at: string;
};
