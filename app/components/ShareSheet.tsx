import { Camera, MessageCircle, MessageSquare, MoreHorizontal } from "lucide-react";
import { BottomSheet } from "./BottomSheet";
import { CopyRow } from "./CopyRow";

// README Screen 1 - 9. 공유 바텀시트
// 타깃 아이콘: 카카오톡 → MessageCircle, 인스타그램 → Camera, 메시지 → MessageSquare,
// 더보기 → MoreHorizontal. lucide-react에는 브랜드 로고가 없어 의미가 같은 아이콘으로 대체.
// 아이콘 4개는 아직 장식용 - 실제 카카오톡 공유 등은 SDK 연동이 필요해 이후 과제.
const targets = [
  { label: "카카오톡", Icon: MessageCircle },
  { label: "인스타그램", Icon: Camera },
  { label: "메시지", Icon: MessageSquare },
  { label: "더보기", Icon: MoreHorizontal },
];

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
      <div className="mb-4 grid grid-cols-4 gap-3">
        {targets.map(({ label, Icon }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            className="flex aspect-square items-center justify-center rounded-2xl bg-field text-brand"
          >
            <Icon size={20} strokeWidth={1.8} />
          </button>
        ))}
      </div>
      <CopyRow value={shareUrl} />
    </BottomSheet>
  );
}
