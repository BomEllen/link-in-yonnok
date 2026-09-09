import { Camera, MessageCircle, MessageSquare, MoreHorizontal } from "lucide-react";

// README Screen 1 - 9. 공유 바텀시트
// 타깃 아이콘: 카카오톡 → MessageCircle, 인스타그램 → Camera, 메시지 → MessageSquare,
// 더보기 → MoreHorizontal. lucide-react에는 브랜드 로고가 없어 의미가 같은 아이콘으로 대체.
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
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40">
      <button
        type="button"
        aria-label="공유 시트 닫기"
        onClick={onClose}
        className="absolute inset-0 animate-overlay-in bg-overlay/[.42]"
      />
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[420px] animate-sheet-up rounded-t-[26px] bg-surface px-5 pb-[26px] pt-[10px]">
        <div className="mx-auto mb-4 h-1 w-[38px] rounded-full bg-ink/20" />
        <h2 className="mb-4 font-display text-[15px] text-ink">페이지 공유</h2>
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
        <div className="flex items-center gap-2 rounded-[14px] bg-field px-4 py-3">
          <span className="flex-1 truncate font-mono text-[12px] text-ink/66">{shareUrl}</span>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(shareUrl)}
            className="rounded-[10px] bg-brand px-3 py-[6px] text-btn-sm font-medium text-brand-ink"
          >
            복사
          </button>
        </div>
      </div>
    </div>
  );
}
