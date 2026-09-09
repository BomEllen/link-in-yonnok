import { ChevronDown, ChevronUp } from "lucide-react";
import type { Category, Link as LinkItem } from "@/lib/types";
import { cx } from "@/lib/utils";
import { ProductCard } from "./ProductCard";

// README Screen 1 - 5. 카테고리 섹션 (아코디언)
export function CategorySection({
  category,
  links,
  cols,
  open,
  onToggle,
}: {
  category: Category;
  links: LinkItem[];
  cols: 2 | 3;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <section>
      <button
        type="button"
        onClick={onToggle}
        className="mb-3 flex w-full items-center gap-2 text-left"
      >
        <span className="font-display text-category-title text-ink">{category.name}</span>
        <span className="rounded-[9px] bg-brand-ink px-[6px] py-[2px] font-mono text-[10.5px] text-brand">
          {links.length}
        </span>
        <span className="ml-auto text-ink/45">
          {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
        </span>
      </button>
      {open && (
        <div
          className={cx(
            "grid animate-fadein",
            cols === 2 ? "grid-cols-2 gap-3" : "grid-cols-3 gap-[9px]"
          )}
        >
          {links.map((link) => (
            <ProductCard key={link.id} link={link} cols={cols} />
          ))}
        </div>
      )}
    </section>
  );
}
