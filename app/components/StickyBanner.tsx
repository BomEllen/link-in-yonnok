import { cx } from "@/lib/utils";

// README Screen 1 - 1. 스티키 안내 배너.
// 텍스트를 오른쪽에서 왼쪽으로 끊김 없이 흘려보내는 마퀴. 내용을 똑같이 두 벌
// 나란히 두고 트랙을 -50%까지 옮기면, 첫 벌이 화면 밖으로 나가는 순간 둘째 벌이
// 정확히 그 자리를 채워서 이음매 없이 반복된다(seamless loop).
// prefers-reduced-motion이면 motion-reduce: 변형으로 애니메이션을 끄고 정적으로
// 가운데 정렬해서 보여준다 - 이때 화면 낭독기/보이는 텍스트가 중복되지 않도록
// 두 번째 사본은 aria-hidden + 완전히 숨긴다.
function BannerCopy({ text, hidden = false }: { text: string; hidden?: boolean }) {
  return (
    <span
      aria-hidden={hidden || undefined}
      className={cx(
        "flex shrink-0 items-center gap-2 px-[18px] text-banner text-white",
        hidden && "motion-reduce:hidden"
      )}
    >
      <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-brand-ink" />
      {text}
    </span>
  );
}

export function StickyBanner({ text }: { text: string }) {
  return (
    <div className="sticky top-0 z-30 overflow-hidden bg-brand py-[9px]">
      <div className="flex w-max animate-marquee motion-reduce:w-full motion-reduce:animate-none motion-reduce:justify-center">
        <BannerCopy text={text} />
        <BannerCopy text={text} hidden />
      </div>
    </div>
  );
}
