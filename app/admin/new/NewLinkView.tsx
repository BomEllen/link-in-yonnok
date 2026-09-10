"use client";

import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser-client";
import type { Category } from "@/lib/types";
import { cx } from "@/lib/utils";
import { createLink } from "./actions";
import { getCroppedImageBlob } from "./cropImage";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// README Screen 2 - 새 링크 등록. 시안엔 없던 이미지 크롭/업로드는 react-easy-crop +
// Supabase Storage(link-thumbnails 버킷)로 구현.
export function NewLinkView({ categories }: { categories: Category[] }) {
  const [thumbnail, setThumbnail] = useState<{ url: string; path: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const croppedAreaRef = useRef<Area | null>(null);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit = !!thumbnail && title.trim() !== "" && url.trim() !== "";

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // 같은 파일을 다시 골라도 onChange가 또 나게
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFormError("이미지 파일만 선택할 수 있어요");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFormError("10MB 이하 이미지만 가능해요");
      return;
    }
    setFormError(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCropSrc(URL.createObjectURL(file));
  }

  function closeCropper() {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  }

  async function handleCropConfirm() {
    if (!cropSrc || !croppedAreaRef.current) return;
    setUploading(true);
    setFormError(null);
    try {
      const blob = await getCroppedImageBlob(cropSrc, croppedAreaRef.current);
      const supabase = createBrowserSupabaseClient();
      const path = `${crypto.randomUUID()}.jpg`;
      const { error: uploadErr } = await supabase.storage
        .from("link-thumbnails")
        .upload(path, blob, { contentType: "image/jpeg", upsert: false });
      if (uploadErr) throw uploadErr;

      const { data } = supabase.storage.from("link-thumbnails").getPublicUrl(path);
      setThumbnail({ url: data.publicUrl, path });
      closeCropper();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "업로드에 실패했어요");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemoveThumbnail() {
    if (!thumbnail) return;
    const supabase = createBrowserSupabaseClient();
    await supabase.storage.from("link-thumbnails").remove([thumbnail.path]);
    setThumbnail(null);
  }

  async function handlePasteUrl() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text.trim());
    } catch {
      // 클립보드 권한이 없으면 조용히 무시 - 직접 입력하면 된다.
    }
  }

  function handleSubmit() {
    if (!canSubmit || !thumbnail || submitting) return;
    setSubmitting(true);
    setFormError(null);
    createLink({ thumbnail_url: thumbnail.url, title, url, category_id: categoryId }).then(
      (result) => {
        setSubmitting(false);
        if (!result.ok) {
          setFormError(result.message);
          return;
        }
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          setTitle("");
          setUrl("");
          setCategoryId(null);
          setThumbnail(null);
        }, 2200);
      }
    );
  }

  const stepsDone = [!!thumbnail, title.trim() !== "", url.trim() !== ""];

  return (
    <div className="mx-auto flex min-h-screen max-w-[420px] flex-col bg-surface">
      <header className="flex items-center gap-3 px-[22px] pb-[14px] pt-[22px]">
        <Link
          href="/admin"
          aria-label="뒤로가기"
          className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border border-brand/20 text-ink"
        >
          <ArrowLeft size={16} />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-screen-title text-ink">새 링크 등록</h1>
          <p className="text-screen-sub font-light text-ink/55">사진 · 제목 · 링크만 있으면 끝</p>
        </div>
        <div className="flex shrink-0 gap-1">
          {stepsDone.map((done, i) => (
            <span
              key={i}
              className={cx("h-[3px] w-4 rounded-full", done ? "bg-brand" : "bg-brand/[18%]")}
            />
          ))}
        </div>
      </header>

      <div className="flex-1 space-y-4 px-[22px] pb-32">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {thumbnail ? (
            <div className="relative aspect-square w-full animate-fadein overflow-hidden rounded-upload">
              {/* eslint-disable-next-line @next/next/no-img-element -- Storage 공개 URL, next/image 도메인 설정 불필요 */}
              <img src={thumbnail.url} alt="" className="h-full w-full object-cover" />
              <span className="absolute bottom-2 left-2 rounded-[4px] bg-white/75 px-[5px] py-[2px] font-mono text-[8px] text-ink">
                thumbnail 1:1
              </span>
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
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-upload border-[1.5px] border-dashed border-brand/[35%] bg-upload"
            >
              <span className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-brand-ink">
                <Plus size={26} className="text-brand" />
              </span>
              <span className="font-display text-[14px] text-ink">사진 추가</span>
              <span className="text-[10.5px] text-ink/45">탭해서 앨범에서 선택 · 1:1 권장</span>
            </button>
          )}
          {formError && <p className="mt-2 text-[11.5px] text-ink/66">{formError}</p>}
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
              placeholder="https://"
              className="w-full text-[16px] text-ink outline-none sm:text-[14px]"
            />
            <button
              type="button"
              onClick={handlePasteUrl}
              className="h-9 shrink-0 rounded-[12px] bg-accent px-3 text-btn-sm text-accent-ink"
            >
              붙여넣기
            </button>
          </div>
        </div>

        {categories.length > 0 && (
          <div>
            <div className="flex items-baseline gap-2">
              <label className="text-field-label text-ink/55">카테고리</label>
              <span className="text-[10.5px] text-ink/35">선택</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((c) => {
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
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[420px] bg-gradient-to-t from-surface from-60% to-transparent px-[22px] pb-6 pt-8">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className={cx(
            "h-14 w-full rounded-cta text-cta font-medium",
            canSubmit && !submitting
              ? "bg-brand text-brand-ink shadow-cta"
              : "bg-brand/[16%] text-ink/42"
          )}
        >
          {canSubmit ? (submitting ? "등록 중…" : "등록하기") : "사진 · 제목 · 링크를 채워주세요"}
        </button>
        <p className="mt-2 text-center text-[10.5px] text-ink/45">
          등록하면 메인 페이지 맨 위에 추가됩니다
        </p>
      </div>

      {showToast && (
        <div
          className="fixed inset-x-6 z-30 mx-auto max-w-[372px] animate-toast-in rounded-2xl bg-ink px-4 py-3 text-center text-[11.5px] text-brand-ink shadow-toast"
          style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 118px)" }}
        >
          ✓ 등록 완료 · 메인 페이지에 추가했어요
        </div>
      )}

      {cropSrc && (
        <div className="fixed inset-0 z-40 flex flex-col bg-ink">
          <div className="relative flex-1">
            <Cropper
              image={cropSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="rect"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, areaPixels) => {
                croppedAreaRef.current = areaPixels;
              }}
            />
          </div>
          <div className="bg-ink px-6 py-5">
            {formError && <p className="mb-3 text-center text-[11.5px] text-white/80">{formError}</p>}
            <div className="flex items-center justify-between gap-3">
              <button type="button" onClick={closeCropper} className="text-btn-sm text-white/70">
                취소
              </button>
              <button
                type="button"
                onClick={handleCropConfirm}
                disabled={uploading}
                className="h-11 rounded-full bg-brand-ink px-6 text-btn-sm font-medium text-brand"
              >
                {uploading ? "업로드 중…" : "자르기 완료"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
