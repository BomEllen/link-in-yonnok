// 페이지 공유/비즈니스 제안이 공유하는 하단 시트 뼈대(오버레이 + 슬라이드업 카드 + 핸들 + 제목).
export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40">
      <button
        type="button"
        aria-label="시트 닫기"
        onClick={onClose}
        className="absolute inset-0 animate-overlay-in bg-overlay/[.42]"
      />
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[420px] animate-sheet-up rounded-t-[26px] bg-surface px-5 pb-[26px] pt-[10px]">
        <div className="mx-auto mb-4 h-1 w-[38px] rounded-full bg-ink/20" />
        <h2 className="mb-4 font-display text-[15px] text-ink">{title}</h2>
        {children}
      </div>
    </div>
  );
}
