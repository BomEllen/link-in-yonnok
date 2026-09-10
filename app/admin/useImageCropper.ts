"use client";

import { useRef, useState } from "react";
import type { Area } from "react-easy-crop";
import { getCroppedImageBlob } from "@/lib/cropImage";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser-client";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// 사진 선택 -> 1:1 크롭 -> Storage 업로드까지 공통 흐름.
// 링크 등록/수정, 프로필 아바타가 전부 이 훅을 쓴다 (버킷만 다름).
export function useImageCropper(bucket: string) {
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const croppedAreaRef = useRef<Area | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // 같은 파일을 다시 골라도 onChange가 또 나게
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 선택할 수 있어요");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("10MB 이하 이미지만 가능해요");
      return;
    }
    openWithSrc(URL.createObjectURL(file));
  }

  // og:image 자동 추출처럼 이미 확보한 이미지 소스(예: data URL)로 바로 크롭을 열 때.
  function openWithSrc(src: string) {
    setError(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCropSrc(src);
  }

  function closeCropper() {
    if (cropSrc?.startsWith("blob:")) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  }

  function setCroppedArea(area: Area) {
    croppedAreaRef.current = area;
  }

  async function confirmCrop(): Promise<{ url: string; path: string } | null> {
    if (!cropSrc || !croppedAreaRef.current) return null;
    setUploading(true);
    setError(null);
    try {
      const blob = await getCroppedImageBlob(cropSrc, croppedAreaRef.current);
      const supabase = createBrowserSupabaseClient();
      const path = `${crypto.randomUUID()}.jpg`;
      const { error: uploadErr } = await supabase.storage
        .from(bucket)
        .upload(path, blob, { contentType: "image/jpeg", upsert: false });
      if (uploadErr) throw uploadErr;

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      closeCropper();
      return { url: data.publicUrl, path };
    } catch (err) {
      setError(err instanceof Error ? err.message : "업로드에 실패했어요");
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function removeUploaded(path: string | null) {
    if (!path) return;
    const supabase = createBrowserSupabaseClient();
    await supabase.storage.from(bucket).remove([path]);
  }

  return {
    cropSrc,
    crop,
    zoom,
    setCrop,
    setZoom,
    uploading,
    error,
    setError,
    fileInputRef,
    openFilePicker,
    handleFileChange,
    openWithSrc,
    closeCropper,
    setCroppedArea,
    confirmCrop,
    removeUploaded,
  };
}
