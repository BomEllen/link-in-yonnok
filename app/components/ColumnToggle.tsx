import { Grid2x2, Grid3x3 } from "lucide-react";
import { cx } from "@/lib/utils";

// README Screen 1 - 4. 열 수 토글
// 원본 디자인은 세로 막대 픽토그램이지만, 아이콘은 lucide-react로 통일하기로 해
// 의미가 같은 Grid2x2 / Grid3x3로 대체했다.
export function ColumnToggle({
  cols,
  onChange,
}: {
  cols: 2 | 3;
  onChange: (cols: 2 | 3) => void;
}) {
  return (
    <div className="flex items-center gap-[2px] rounded-segment border border-brand/10 bg-field p-[3px]">
      <button
        type="button"
        onClick={() => onChange(2)}
        aria-label="2열로 보기"
        aria-pressed={cols === 2}
        className={cx(
          "flex h-6 w-[30px] items-center justify-center rounded-segment-inner",
          cols === 2 ? "bg-brand text-brand-ink" : "text-ink/30"
        )}
      >
        <Grid2x2 size={14} strokeWidth={2} />
      </button>
      <button
        type="button"
        onClick={() => onChange(3)}
        aria-label="3열로 보기"
        aria-pressed={cols === 3}
        className={cx(
          "flex h-6 w-[34px] items-center justify-center rounded-segment-inner",
          cols === 3 ? "bg-brand text-brand-ink" : "text-ink/30"
        )}
      >
        <Grid3x3 size={14} strokeWidth={2} />
      </button>
    </div>
  );
}
