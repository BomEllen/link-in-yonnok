import { BottomSheet } from "./BottomSheet";
import { CopyRow } from "./CopyRow";

// README Screen 1 - 9. 공유 바텀시트. 시안엔 카카오톡/인스타/메시지/더보기 타깃
// 아이콘이 있었지만 실제 공유 API 연동 없이는 장식일 뿐이라 링크 복사만 남겼다.
export function ShareSheet({
  open,
  onClose,
  shareUrl,
}: {
  open: boolean;
  onClose: () => void;
  shareUrl: string;
}) {
  return (
    <BottomSheet open={open} onClose={onClose} title="페이지 공유">
      <CopyRow value={shareUrl} />
    </BottomSheet>
  );
}
