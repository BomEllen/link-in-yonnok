"use client";

import Cropper, { type Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";

// 사진 선택 후 뜨는 전체화면 1:1 크롭 오버레이. 링크 등록/수정, 프로필 아바타가 공유한다.
export function CropperOverlay({
  cropSrc,
  crop,
  zoom,
  uploading,
  error,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onCancel,
  onConfirm,
}: {
  cropSrc: string;
  crop: { x: number; y: number };
  zoom: number;
  uploading: boolean;
  error: string | null;
  onCropChange: (crop: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  onCropComplete: (area: Area) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-ink">
      <div className="relative flex-1">
        <Cropper
          image={cropSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="rect"
          showGrid={false}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={(_, areaPixels) => onCropComplete(areaPixels)}
        />
      </div>
      <div className="bg-ink px-6 py-5">
        {error && <p className="mb-3 text-center text-[11.5px] text-white/80">{error}</p>}
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={onCancel} className="text-btn-sm text-white/70">
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={uploading}
            className="h-11 rounded-full bg-brand-ink px-6 text-btn-sm font-medium text-brand"
          >
            {uploading ? "업로드 중…" : "자르기 완료"}
          </button>
        </div>
      </div>
    </div>
  );
}
