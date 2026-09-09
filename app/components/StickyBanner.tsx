// README Screen 1 - 1. 스티키 안내 배너
export function StickyBanner({ text }: { text: string }) {
  return (
    <div className="sticky top-0 z-30 flex items-center justify-center gap-2 bg-brand px-[18px] py-[9px]">
      <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-brand-ink" />
      <p className="text-center text-banner text-white">{text}</p>
    </div>
  );
}
