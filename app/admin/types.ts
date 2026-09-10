// 관리 화면의 로컬 초안(draft) 상태 타입.
// key는 React/dnd-kit용 안정적인 id (신규 카테고리는 id가 아직 없으므로 별도로 둔다).
export type CategoryDraft = {
  key: string;
  id: string | null;
  name: string;
  hidden: boolean;
  // true면 "이번달 픽" 같은 고정 카테고리 - 드래그/삭제 대상에서 제외된다.
  is_pinned: boolean;
};

export type ProfileDraft = {
  nickname: string;
  bio: string;
  banner_enabled: boolean;
  default_columns: 2 | 3;
  footer_text: string;
};
