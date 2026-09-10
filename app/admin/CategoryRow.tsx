"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronUp, GripVertical, Trash2 } from "lucide-react";
import { Switch } from "@/app/components/Switch";
import { cx } from "@/lib/utils";
import type { CategoryDraft } from "./types";

// README Screen 3 - 3. 카테고리 목록의 한 행.
// 그립(⠿)은 dnd-kit 드래그 핸들로 연결하고, ▲/▼ 버튼도 접근성을 위해 같이 둔다
// (README 자체가 "구현 시 포인터 드래그로 확장하고 그립을 핸들로 쓰라"고 안내함).
export function CategoryRow({
  category,
  linkCount,
  isFirst,
  isLast,
  autoFocus,
  onNameChange,
  onToggleHidden,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  category: CategoryDraft;
  linkCount: number;
  isFirst: boolean;
  isLast: boolean;
  autoFocus?: boolean;
  onNameChange: (name: string) => void;
  onToggleHidden: (hidden: boolean) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.key,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cx(
        "flex items-center gap-2 rounded-admin-row bg-white px-[13px] py-3 shadow-admin-card",
        category.hidden && "opacity-55",
        isDragging && "opacity-50"
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="순서 변경 (드래그)"
        className="shrink-0 touch-none cursor-grab text-ink/28"
      >
        <GripVertical size={18} />
      </button>

      <div className="min-w-0 flex-1">
        <input
          value={category.name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="카테고리 이름"
          autoFocus={autoFocus}
          className="w-full rounded-[6px] bg-transparent px-1 font-display text-[14px] text-ink outline-none focus:bg-upload"
        />
        <p className="truncate px-1 text-[10.5px] text-ink/45">
          {category.hidden ? `숨김 · ${linkCount}개 링크` : `${linkCount}개 링크 · 이름 탭해서 수정`}
        </p>
      </div>

      <div className="flex shrink-0 flex-col gap-[2px]">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isFirst}
          aria-label="위로 이동"
          className={cx(
            "flex h-[26px] w-[26px] items-center justify-center rounded-[9px]",
            isFirst ? "text-ink/20" : "text-ink/66"
          )}
        >
          <ChevronUp size={14} />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={isLast}
          aria-label="아래로 이동"
          className={cx(
            "flex h-[26px] w-[26px] items-center justify-center rounded-[9px]",
            isLast ? "text-ink/20" : "text-ink/66"
          )}
        >
          <ChevronDown size={14} />
        </button>
      </div>

      <Switch
        checked={!category.hidden}
        onChange={(visible) => onToggleHidden(!visible)}
        ariaLabel={`${category.name || "카테고리"} 노출 여부`}
      />

      <button
        type="button"
        onClick={onDelete}
        aria-label={`${category.name || "카테고리"} 삭제`}
        className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[9px] text-ink/35"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
