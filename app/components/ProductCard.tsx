import type { Link as LinkItem } from "@/lib/types";
import { cx } from "@/lib/utils";

// README Screen 1 - 6. 상품 카드
export function ProductCard({
  link,
  cols,
}: {
  link: LinkItem;
  cols: 2 | 3;
}) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cx(
        "flex aspect-[3/4] flex-col overflow-hidden bg-white shadow-card border border-brand/[6%]",
        cols === 2 ? "rounded-card2" : "rounded-card3"
      )}
    >
      <div className="min-h-0 flex-1 overflow-hidden">
        {link.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- Storage 도메인이 정해지는 5단계에서 next/image로 교체
          <img src={link.thumbnail_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-thumb-placeholder" />
        )}
      </div>
      <div
        className={cx(
          "shrink-0",
          cols === 2 ? "h-[64px] px-[11px] pb-[11px] pt-[9px]" : "h-[53px] px-[8px] pb-[9px] pt-[7px]"
        )}
      >
        <p
          className={cx(
            "line-clamp-2 text-ink",
            cols === 2 ? "min-h-[42px] text-product-title-2col" : "min-h-[37px] text-product-title-3col"
          )}
        >
          {link.title}
        </p>
      </div>
    </a>
  );
}
