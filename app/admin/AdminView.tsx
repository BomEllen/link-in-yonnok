"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Pencil, Pin, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Switch } from "@/app/components/Switch";
import type { Category, Profile } from "@/lib/types";
import { cx } from "@/lib/utils";
import { logout, saveAdminChanges } from "./actions";
import { CategoryRow } from "./CategoryRow";
import type { CategoryDraft, ProfileDraft } from "./types";

function toDraft(categories: Category[]): CategoryDraft[] {
  return categories.map((c) => ({
    key: c.id,
    id: c.id,
    name: c.name,
    hidden: c.hidden,
    is_pinned: c.is_pinned,
  }));
}

let tempKeySeq = 0;

export function AdminView({
  profile,
  categories,
  linkCountByCategory,
}: {
  profile: Profile;
  categories: Category[];
  linkCountByCategory: Record<string, number>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [nickname, setNickname] = useState(profile.nickname);
  const [bio, setBio] = useState(profile.bio);
  const [bannerEnabled, setBannerEnabled] = useState(profile.banner_enabled);
  const [defaultColumns, setDefaultColumns] = useState<2 | 3>(profile.default_columns);
  const [footerText, setFooterText] = useState(profile.footer_text);
  const [categoryDrafts, setCategoryDrafts] = useState<CategoryDraft[]>(() => toDraft(categories));
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastAddedKey, setLastAddedKey] = useState<string | null>(null);

  // 마지막으로 저장된(=서버와 일치하는) 상태의 스냅샷. dirty 계산 기준점이며,
  // 저장 성공 시에만 갱신한다. ref가 아니라 state로 두는 이유: useMemo 등 렌더 중
  // 코드에서 값을 읽어야 하는데, 렌더 중 ref.current 읽기는 금지되어 있다(react-hooks/refs).
  const [savedSnapshot, setSavedSnapshot] = useState({
    nickname: profile.nickname,
    bio: profile.bio,
    bannerEnabled: profile.banner_enabled,
    defaultColumns: profile.default_columns,
    footerText: profile.footer_text,
    categories: toDraft(categories),
  });

  const pinnedCategory = categoryDrafts.find((c) => c.is_pinned) ?? null;
  const regularCategories = categoryDrafts.filter((c) => !c.is_pinned);

  const dirty = useMemo(() => {
    const strip = (list: CategoryDraft[]) =>
      list.map(({ id, name, hidden, is_pinned }) => ({ id, name, hidden, is_pinned }));
    return (
      nickname !== savedSnapshot.nickname ||
      bio !== savedSnapshot.bio ||
      bannerEnabled !== savedSnapshot.bannerEnabled ||
      defaultColumns !== savedSnapshot.defaultColumns ||
      footerText !== savedSnapshot.footerText ||
      deletedIds.length > 0 ||
      JSON.stringify(strip(categoryDrafts)) !== JSON.stringify(strip(savedSnapshot.categories))
    );
  }, [nickname, bio, bannerEnabled, defaultColumns, footerText, categoryDrafts, deletedIds, savedSnapshot]);

  const confirmLeaveIfDirty = () => {
    if (!dirty) return true;
    return window.confirm("저장하지 않은 변경 사항이 있어요. 그래도 나갈까요?");
  };

  // 탭 닫기/새로고침 - 앱 내 이동(새 링크 등록, 로그아웃)은 confirmLeaveIfDirty로 따로 막는다.
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  // 드래그/위아래/삭제는 전부 "고정 아님" 카테고리 안에서만 순서를 바꾼다 -
  // pinned 카테고리는 항상 맨 앞에 따로 렌더링되고 이 목록엔 안 들어있다.
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setCategoryDrafts((prev) => {
      const pinned = prev.filter((c) => c.is_pinned);
      const regular = prev.filter((c) => !c.is_pinned);
      const oldIndex = regular.findIndex((c) => c.key === active.id);
      const newIndex = regular.findIndex((c) => c.key === over.id);
      return [...pinned, ...arrayMove(regular, oldIndex, newIndex)];
    });
  }

  function updateCategoryByKey(key: string, patch: Partial<CategoryDraft>) {
    setCategoryDrafts((prev) => prev.map((c) => (c.key === key ? { ...c, ...patch } : c)));
  }

  function moveRegularCategory(key: string, direction: -1 | 1) {
    setCategoryDrafts((prev) => {
      const pinned = prev.filter((c) => c.is_pinned);
      const regular = prev.filter((c) => !c.is_pinned);
      const idx = regular.findIndex((c) => c.key === key);
      const newIdx = idx + direction;
      if (idx === -1 || newIdx < 0 || newIdx >= regular.length) return prev;
      return [...pinned, ...arrayMove(regular, idx, newIdx)];
    });
  }

  function addCategory() {
    tempKeySeq += 1;
    const key = `new-${tempKeySeq}`;
    setCategoryDrafts((prev) => [...prev, { key, id: null, name: "", hidden: false, is_pinned: false }]);
    setLastAddedKey(key);
  }

  function removeCategory(key: string) {
    const target = categoryDrafts.find((c) => c.key === key);
    if (!target) return;
    const ok = window.confirm(
      `"${target.name || "이름 없는 카테고리"}"를 삭제할까요? 안에 있던 링크는 미분류로 이동합니다.`
    );
    if (!ok) return;

    setCategoryDrafts((prev) => prev.filter((c) => c.key !== key));
    // 신규(아직 저장 안 한) 카테고리는 서버에 존재하지 않으니 그냥 목록에서만 지운다.
    if (target.id) {
      setDeletedIds((prev) => [...prev, target.id as string]);
    }
  }

  function handleNewLinkClick(e: React.MouseEvent) {
    e.preventDefault();
    if (!confirmLeaveIfDirty()) return;
    router.push("/admin/new");
  }

  function handleManageLinksClick(e: React.MouseEvent) {
    e.preventDefault();
    if (!confirmLeaveIfDirty()) return;
    router.push("/admin/links");
  }

  function handleLogout() {
    if (!confirmLeaveIfDirty()) return;
    startTransition(() => logout());
  }

  function handleSave() {
    setSaveError(null);
    const profileDraft: ProfileDraft = {
      nickname: nickname.trim(),
      bio: bio.trim(),
      banner_enabled: bannerEnabled,
      default_columns: defaultColumns,
      footer_text: footerText.trim(),
    };
    startTransition(async () => {
      const result = await saveAdminChanges(profileDraft, categoryDrafts, deletedIds);
      if (!result.ok) {
        setSaveError(result.message);
        return;
      }
      // RPC가 돌려준 최신 categories로 로컬 상태를 맞춘다 - 신규 카테고리가 방금
      // 받은 실제 id를 포함하고 있어서, 페이지를 새로고침하지 않아도 다음 저장 때
      // 같은 행을 다시 insert하지 않고 update된다.
      const freshDrafts = toDraft(result.categories);
      setNickname(profileDraft.nickname);
      setBio(profileDraft.bio);
      setFooterText(profileDraft.footer_text);
      setCategoryDrafts(freshDrafts);
      setDeletedIds([]);
      setSavedSnapshot({
        nickname: profileDraft.nickname,
        bio: profileDraft.bio,
        bannerEnabled: profileDraft.banner_enabled,
        defaultColumns: profileDraft.default_columns,
        footerText: profileDraft.footer_text,
        categories: freshDrafts,
      });
    });
  }

  return (
    <div className="mx-auto min-h-screen max-w-[420px] bg-surface px-6 pb-32 pt-[22px]">
      <header className="mb-5 flex items-start justify-between">
        <div>
          <h1 className="font-display text-screen-title text-ink">페이지 관리</h1>
          <p className="mt-1 text-screen-sub font-light text-ink/55">
            변경 사항은 저장 시 바로 메인에 반영됩니다
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/admin/links"
            onClick={handleManageLinksClick}
            className="flex h-8 items-center rounded-full border border-brand/20 px-3 text-btn-sm text-ink/66"
          >
            링크 관리
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex h-8 items-center rounded-full border border-brand/20 px-3 text-btn-sm text-ink/66"
          >
            미리보기
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="text-btn-sm text-ink/45 underline underline-offset-2"
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* README Screen 3 - 2. 프로필 카드 */}
      <section className="mb-[22px] rounded-admin-card bg-white p-4 shadow-admin-card">
        <div className="flex items-center gap-4">
          <div className="relative h-[62px] w-[62px] shrink-0">
            <div className="h-full w-full rounded-full bg-avatar-placeholder" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-brand-ink">
              <Pencil size={12} className="text-brand" />
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              disabled
              title="5단계(이미지 업로드)에서 연결됩니다"
              className="h-8 rounded-full bg-brand px-3 text-btn-sm font-medium text-brand-ink opacity-50"
            >
              사진 변경
            </button>
            <button
              type="button"
              disabled
              title="5단계(이미지 업로드)에서 연결됩니다"
              className="h-[30px] rounded-full border border-brand/[18%] px-3 text-btn-sm text-ink/55 opacity-50"
            >
              기본 이미지로
            </button>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2 border-t border-brand/[8%] pt-4">
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임"
            className="h-11 rounded-[14px] bg-surface px-3 font-display text-[16px] text-ink outline-none sm:text-[14px]"
          />
          <input
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="한 줄 소개"
            className="h-11 rounded-[14px] bg-surface px-3 text-[16px] text-ink outline-none sm:text-[14px]"
          />
        </div>
      </section>

      {/* README Screen 3 - 3. 카테고리 목록 */}
      <section className="mb-[22px]">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-field-label text-ink/55">카테고리</span>
          <span className="text-[10.5px] text-ink/35">끌어서 순서 변경 · 눈 아이콘으로 숨기기</span>
        </div>

        {pinnedCategory && (
          <div className="mb-2 flex items-center gap-2 rounded-admin-row bg-white px-[13px] py-3 shadow-admin-card">
            <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-brand">
              <Pin size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <input
                value={pinnedCategory.name}
                onChange={(e) => updateCategoryByKey(pinnedCategory.key, { name: e.target.value })}
                placeholder="카테고리 이름"
                className="w-full rounded-[6px] bg-transparent px-1 font-display text-[16px] text-ink outline-none focus:bg-upload sm:text-[14px]"
              />
              <p className="truncate px-1 text-[10.5px] text-ink/45">
                항상 맨 위 고정 ·{" "}
                {pinnedCategory.id ? (linkCountByCategory[pinnedCategory.id] ?? 0) : 0}개 링크
              </p>
            </div>
            <Switch
              checked={!pinnedCategory.hidden}
              onChange={(visible) => updateCategoryByKey(pinnedCategory.key, { hidden: !visible })}
              ariaLabel={`${pinnedCategory.name || "카테고리"} 노출 여부`}
            />
          </div>
        )}

        <DndContext
          id="admin-categories"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={regularCategories.map((c) => c.key)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2">
              {regularCategories.map((cat, i) => (
                <CategoryRow
                  key={cat.key}
                  category={cat}
                  linkCount={cat.id ? (linkCountByCategory[cat.id] ?? 0) : 0}
                  isFirst={i === 0}
                  isLast={i === regularCategories.length - 1}
                  autoFocus={cat.key === lastAddedKey}
                  onNameChange={(name) => updateCategoryByKey(cat.key, { name })}
                  onToggleHidden={(hidden) => updateCategoryByKey(cat.key, { hidden })}
                  onMoveUp={() => moveRegularCategory(cat.key, -1)}
                  onMoveDown={() => moveRegularCategory(cat.key, 1)}
                  onDelete={() => removeCategory(cat.key)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <button
          type="button"
          onClick={addCategory}
          className="mt-2 flex h-12 w-full items-center justify-center rounded-admin-row border-[1.5px] border-dashed border-brand/[30%] text-btn-sm text-ink/55"
        >
          ＋ 카테고리 추가
        </button>
      </section>

      {/* README Screen 3 - 4. 페이지 설정 카드 */}
      <section className="mb-[22px] rounded-admin-card bg-white shadow-admin-card">
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="text-input text-ink">상단 안내 배너</p>
            <p className="mt-0.5 text-[10.5px] text-ink/45">제휴 수수료 문구 노출</p>
          </div>
          <Switch checked={bannerEnabled} onChange={setBannerEnabled} ariaLabel="상단 안내 배너 노출" />
        </div>
        <div className="border-t border-brand/[8%] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-input text-ink">기본 보기</p>
              <p className="mt-0.5 text-[10.5px] text-ink/45">방문자에게 처음 보이는 열 수</p>
            </div>
            <div className="flex items-center gap-[2px] rounded-segment border border-brand/10 bg-field p-[3px]">
              {([2, 3] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setDefaultColumns(n)}
                  aria-pressed={defaultColumns === n}
                  className={cx(
                    "flex h-6 w-8 items-center justify-center rounded-segment-inner text-btn-sm",
                    defaultColumns === n ? "bg-white text-brand" : "text-ink/45"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-brand/[8%] p-4">
          <p className="text-input text-ink">푸터 문구</p>
          <p className="mt-0.5 text-[10.5px] text-ink/45">공개 페이지 맨 아래에 그대로 표시됩니다 (여러 줄 가능)</p>
          <textarea
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            placeholder={"이 링크는 OOO가 직접 관리합니다\n© 2026 seoyeon.link"}
            rows={2}
            className="mt-2 w-full resize-none rounded-[14px] bg-surface px-3 py-2 font-mono text-[16px] text-ink outline-none sm:text-[12px]"
          />
        </div>
      </section>

      {/* README Screen 3 - 5. 하단 바 */}
      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-[420px] items-center gap-3 bg-gradient-to-t from-surface from-60% to-transparent px-6 pb-6 pt-8">
        <button
          type="button"
          onClick={handleNewLinkClick}
          aria-label="새 링크 등록"
          className="flex h-[52px] w-14 shrink-0 items-center justify-center rounded-cta border border-brand/20 text-brand"
        >
          <Plus size={20} />
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || isPending}
          className={cx(
            "h-[52px] flex-1 rounded-cta text-cta font-medium",
            dirty && !isPending ? "bg-brand text-brand-ink shadow-cta" : "bg-brand/[16%] text-ink/42"
          )}
        >
          {isPending ? "저장 중…" : "변경 사항 저장"}
        </button>
      </div>

      {saveError && (
        <p className="fixed inset-x-6 bottom-24 z-20 mx-auto max-w-[372px] rounded-[10px] bg-ink px-3 py-2 text-center text-[11.5px] text-brand-ink">
          저장 실패: {saveError}
        </p>
      )}
    </div>
  );
}
