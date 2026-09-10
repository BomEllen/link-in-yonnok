"use client";

import { ArrowLeft, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CropperOverlay } from "@/app/admin/CropperOverlay";
import { Switch } from "@/app/components/Switch";
import { fetchLinkMetadata } from "@/lib/fetchLinkMetadata";
import type { Category, Link as LinkItem } from "@/lib/types";
import { cx } from "@/lib/utils";
import { useImageCropper } from "../../useImageCropper";
import { deleteLink, updateLink } from "../actions";

// app/admin/new/NewLinkView와 같은 폼 UI를 재사용하되, 기존 값으로 채워서 시작하고
// "등록"이 아니라 "저장"/"삭제"로 끝난다.
export function EditLinkView({ link, categories }: { link: LinkItem; categories: Category[] }) {
  const router = useRouter();
  const pinnedCategory = categories.find((c) => c.is_pinned) ?? null;
  const regularCategories = categories.filter((c) => !c.is_pinned);

  const cropper = useImageCropper("link-thumbnails");
  const [thumbnail, setThumbnail] = useState<{ url: string; path: string | null }>({
    url: link.thumbnail_url,
    path: null,
  });

  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  const [categoryId, setCategoryId] = useState<string | null>(link.category_id);
  const [pinned, setPinned] = useState(
    !!pinnedCategory && link.pinned_category_id === pinnedCategory.id
  );

  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fetchingMeta, setFetchingMeta] = useState(false);

  const dirty =
    thumbnail.url !== link.thumbnail_url ||
    title !== link.title ||
    url !== link.url ||
    categoryId !== link.category_id ||
    pinned !== (!!pinnedCategory && link.pinned_category_id === pinnedCategory.id);

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const canSubmit = !!thumbnail.url && title.trim() !== "" && url.trim() !== "";

  function handleBackClick(e: React.MouseEvent) {
    if (dirty && !window.confirm("저장하지 않은 변경 사항이 있어요. 그래도 나갈까요?")) {
      e.preventDefault();
    }
  }

  async function handleCropConfirm() {
    const result = await cropper.confirmCrop();
    if (result) setThumbnail(result);
  }

  async function handleRemoveThumbnail() {
    await cropper.removeUploaded(thumbnail.path);
    setThumbnail({ url: "", path: null });
  }

  async function handlePasteUrl() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        const trimmed = text.trim();
        setUrl(trimmed);
        handleUrlPasted(trimmed);
      }
    } catch {
      // 클립보드 권한이 없으면 조용히 무시.
    }
  }

  // 6단계: URL을 붙여넣으면 og:title/og:image를 가져와 제목/사진이 비어있을 때만
  // 채워준다. 실패해도 조용히 넘어가고 사용자가 직접 입력하면 된다.
  async function handleUrlPasted(pastedUrl: string) {
    if (!pastedUrl) return;
    setFetchingMeta(true);
    try {
      const result = await fetchLinkMetadata(pastedUrl);
      if (result.title) {
        setTitle((prev) => (prev.trim() === "" ? (result.title as string) : prev));
      }
      if (result.imageDataUrl && !thumbnail.url) {
        cropper.openWithSrc(result.imageDataUrl);
      }
    } finally {
      setFetchingMeta(false);
    }
  }

  function handleSubmit() {
    if (!canSubmit || !dirty || submitting) return;
    setSubmitting(true);
    cropper.setError(null);
    updateLink(link.id, {
      thumbnail_url: thumbnail.url,
      title,
      url,
      category_id: categoryId,
      pinned_category_id: pinned && pinnedCategory ? pinnedCategory.id : null,
    }).then((result) => {
      setSubmitting(false);
      if (!result.ok) {
        cropper.setError(result.message);
        return;
      }
      router.push("/admin/links");
    });
  }

  function handleDelete() {
    if (deleting) return;
    if (!window.confirm("이 링크를 삭제할까요? 되돌릴 수 없습니다.")) return;
    setDeleting(true);
    deleteLink(link.id).then((result) => {
      setDeleting(false);
      if (!result.ok) {
        cropper.setError(result.message);
        return;
      }
      router.push("/admin/links");
    });
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[420px] flex-col bg-surface">
      <header className="flex items-center gap-3 px-[22px] pb-[14px] pt-[22px]">
        <Link
          href="/admin/links"
          onClick={handleBackClick}
          aria-label="뒤로가기"
          className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border border-brand/20 text-ink"
        >
          <ArrowLeft size={16} />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-screen-title text-ink">링크 수정</h1>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          aria-label="링크 삭제"
          className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border border-brand/20 text-ink/55"
        >
          <Trash2 size={16} />
        </button>
      </header>

      <div className="flex-1 space-y-4 px-[22px] pb-32">
        <div>
          <input
            ref={cropper.fileInputRef}
            type="file"
            accept="image/*"
            onChange={cropper.handleFileChange}
            className="hidden"
          />
          {thumbnail.url ? (
            <div className="relative aspect-square w-full overflow-hidden rounded-upload">
              <button
                type="button"
                onClick={cropper.openFilePicker}
                aria-label="사진 다시 선택"
                className="block h-full w-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- Storage 공개 URL */}
                <img src={thumbnail.url} alt="" className="h-full w-full object-cover" />
              </button>
              <button
                type="button"
                onClick={handleRemoveThumbnail}
                aria-label="사진 삭제"
                className="absolute right-2 top-2 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-ink/55 text-white"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={cropper.openFilePicker}
              className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-upload border-[1.5px] border-dashed border-brand/[35%] bg-upload"
            >
              <span className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-brand-ink">
                <Plus size={26} className="text-brand" />
              </span>
              <span className="font-display text-[14px] text-ink">사진 추가</span>
              <span className="text-[10.5px] text-ink/45">탭해서 앨범에서 선택 · 1:1 권장</span>
            </button>
          )}
          {cropper.error && <p className="mt-2 text-[11.5px] text-ink/66">{cropper.error}</p>}
        </div>

        <div>
          <label className="text-field-label text-ink/55">제목</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="상품명을 입력하세요"
            className="mt-1 h-[52px] w-full rounded-input border border-brand/[14%] bg-white px-4 text-[16px] text-ink shadow-input outline-none sm:text-[14px]"
          />
        </div>

        <div>
          <label className="text-field-label text-ink/55">링크</label>
          <div className="mt-1 flex h-[52px] items-center gap-2 rounded-input border border-brand/[14%] bg-white px-4 shadow-input">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onPaste={(e) => {
                const text = e.clipboardData.getData("text").trim();
                if (text) handleUrlPasted(text);
              }}
              placeholder="https://"
              className="w-full text-[16px] text-ink outline-none sm:text-[14px]"
            />
            <button
              type="button"
              onClick={handlePasteUrl}
              disabled={fetchingMeta}
              className="h-9 shrink-0 rounded-[12px] bg-accent px-3 text-btn-sm text-accent-ink"
            >
              {fetchingMeta ? "가져오는 중…" : "붙여넣기"}
            </button>
          </div>
        </div>

        {regularCategories.length > 0 && (
          <div>
            <div className="flex items-baseline gap-2">
              <label className="text-field-label text-ink/55">카테고리</label>
              <span className="text-[10.5px] text-ink/35">선택</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {regularCategories.map((c) => {
                const selected = categoryId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategoryId(selected ? null : c.id)}
                    className={cx(
                      "h-9 rounded-full px-[15px] text-btn-sm",
                      selected
                        ? "bg-brand text-brand-ink"
                        : "border border-brand/[16%] bg-white text-ink/70"
                    )}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {pinnedCategory && (
          <div className="flex items-center justify-between rounded-input border border-brand/[14%] bg-white px-4 py-3 shadow-input">
            <span className="text-input text-ink">{pinnedCategory.name}에도 추가</span>
            <Switch checked={pinned} onChange={setPinned} ariaLabel={`${pinnedCategory.name}에도 추가`} />
          </div>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[420px] bg-gradient-to-t from-surface from-60% to-transparent px-[22px] pb-6 pt-8">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit || !dirty || submitting}
          className={cx(
            "h-14 w-full rounded-cta text-cta font-medium",
            canSubmit && dirty && !submitting
              ? "bg-brand text-brand-ink shadow-cta"
              : "bg-brand/[16%] text-ink/42"
          )}
        >
          {submitting ? "저장 중…" : "저장하기"}
        </button>
      </div>

      {cropper.cropSrc && (
        <CropperOverlay
          cropSrc={cropper.cropSrc}
          crop={cropper.crop}
          zoom={cropper.zoom}
          uploading={cropper.uploading}
          error={cropper.error}
          onCropChange={cropper.setCrop}
          onZoomChange={cropper.setZoom}
          onCropComplete={cropper.setCroppedArea}
          onCancel={cropper.closeCropper}
          onConfirm={handleCropConfirm}
        />
      )}
    </div>
  );
}
