"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateLink(
  id: string,
  input: {
    thumbnail_url: string;
    title: string;
    url: string;
    category_id: string | null;
    pinned_category_id: string | null;
  }
): Promise<{ ok: true } | { ok: false; message: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("links")
    .update({
      category_id: input.category_id,
      pinned_category_id: input.pinned_category_id,
      thumbnail_url: input.thumbnail_url,
      title: input.title.trim(),
      url: input.url.trim(),
    })
    .eq("id", id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/");
  return { ok: true };
}

export async function deleteLink(id: string): Promise<{ ok: true } | { ok: false; message: string }> {
  const supabase = await createClient();

  // Storage에 올라간 썸네일 파일 자체는 지우지 않는다 - 개인 프로젝트 규모에서
  // 가끔 남는 orphan 이미지 몇 개는 감수할 만하고, URL에서 경로를 역산하는 건
  // 괜히 취약한 코드가 된다.
  const { error } = await supabase.from("links").delete().eq("id", id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/");
  return { ok: true };
}
