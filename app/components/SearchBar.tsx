import { Search, X } from "lucide-react";

// README Screen 1 - 3. 검색바
export function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex h-[46px] items-center gap-[10px] rounded-[23px] border border-brand/10 bg-field px-4">
      <Search size={15} strokeWidth={2} className="shrink-0 text-[#A0906F]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="상품 · 링크 제목 검색"
        className="w-full bg-transparent text-[16px] text-ink outline-none placeholder:text-ink/45 sm:text-[14px]"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="검색어 지우기"
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink/20 text-white"
        >
          <X size={12} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
