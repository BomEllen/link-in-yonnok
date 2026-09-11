import { BottomSheet } from "./BottomSheet";
import { CopyRow } from "./CopyRow";

// "비즈니스 제안" 버튼을 누르면 뜨는 시트. mailto: 링크로 바로 이동시키는 대신
// 이메일을 보여주고 복사할 수 있게 한다.
export function BusinessContactSheet({
  open,
  onClose,
  email,
}: {
  open: boolean;
  onClose: () => void;
  email: string;
}) {
  return (
    <BottomSheet open={open} onClose={onClose} title="비즈니스 제안">
      <CopyRow value={email} />
    </BottomSheet>
  );
}
