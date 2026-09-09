// 관리 화면의 로컬 초안(draft) 상태 타입.
// key는 React/dnd-kit용 안정적인 id (신규 카테고리는 id가 아직 없으므로 별도로 둔다).
export type CategoryDraft = {
  key: string;
  id: string | null;
  name: string;
  hidden: boolean;
};

export type ProfileDraft = {
  nickname: string;
  bio: string;
  banner_enabled: boolean;
  default_columns: 2 | 3;
};
