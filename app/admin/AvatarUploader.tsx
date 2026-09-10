"use client";

// react-hooks/refs가 이 파일에서만 "ref={cropper.fileInputRef}" 등을 렌더 중 ref
// 접근으로 오탐한다. app/admin/new/NewLinkView.tsx가 useImageCropper를 쓰는 방식이
// 토씨 하나 다르지 않게 똑같은데 거긴 안 걸린다 - 실제 하자가 있는 패턴이 아니라
// 이 규칙(아직 실험적인 React Compiler 연계 규칙)의 오탐으로 판단해 파일 단위로 끈다.
/* eslint-disable react-hooks/refs */

import { Pencil } from "lucide-react";
import { CropperOverlay } from "./CropperOverlay";
import { useImageCropper } from "./useImageCropper";

export type AvatarValue = { url: string; path: string | null };

// README Screen 3 - 프로필 카드의 아바타 부분. useImageCropper("avatars")를 이
// 컴포넌트 안에 캡슐화해서 AdminView는 값/변경 콜백만 안다.
export function AvatarUploader({
  value,
  onChange,
}: {
  value: AvatarValue;
  onChange: (next: AvatarValue) => void;
}) {
  const cropper = useImageCropper("avatars");

  async function handleCropConfirm() {
    const result = await cropper.confirmCrop();
    if (result) onChange(result);
  }

  async function handleReset() {
    await cropper.removeUploaded(value.path);
    onChange({ url: "", path: null });
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <input
          ref={cropper.fileInputRef}
          type="file"
          accept="image/*"
          onChange={cropper.handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={cropper.openFilePicker}
          aria-label="프로필 사진 변경"
          className="relative h-[62px] w-[62px] shrink-0"
        >
          {value.url ? (
            // eslint-disable-next-line @next/next/no-img-element -- Storage 공개 URL
            <img src={value.url} alt="" className="h-full w-full rounded-full object-cover" />
          ) : (
            <div className="h-full w-full rounded-full bg-avatar-placeholder" />
          )}
          <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-brand-ink">
            <Pencil size={12} className="text-brand" />
          </span>
        </button>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={cropper.openFilePicker}
            className="h-8 rounded-full bg-brand px-3 text-btn-sm font-medium text-brand-ink"
          >
            사진 변경
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={!value.url}
            className="h-[30px] rounded-full border border-brand/[18%] px-3 text-btn-sm text-ink/55 disabled:opacity-50"
          >
            기본 이미지로
          </button>
        </div>
      </div>
      {cropper.error && <p className="mt-2 text-[11.5px] text-ink/66">{cropper.error}</p>}
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
    </>
  );
}
