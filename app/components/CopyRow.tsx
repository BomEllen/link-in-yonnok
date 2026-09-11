"use client";

// 값 하나를 보여주고 복사 버튼으로 클립보드에 담게 하는 행. 공유 링크/비즈니스
// 이메일이 공유한다.
export function CopyRow({ value }: { value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-[14px] bg-field px-4 py-3">
      <span className="flex-1 truncate font-mono text-[12px] text-ink/66">{value}</span>
      <button
        type="button"
        onClick={() => navigator.clipboard?.writeText(value)}
        className="rounded-[10px] bg-brand px-3 py-[6px] text-btn-sm font-medium text-brand-ink"
      >
        복사
      </button>
    </div>
  );
}
