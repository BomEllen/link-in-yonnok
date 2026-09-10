"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types";
import type { CategoryDraft, ProfileDraft } from "./types";

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// 이 화면의 유일한 서버 커밋 지점. 프로필 필드 + 카테고리(이름/노출/순서, 신규/삭제
// 포함)를 admin_save_page RPC 한 번 호출로 트랜잭션 처리한다 (중간 실패 시 전부 롤백).
export async function saveAdminChanges(
  profile: ProfileDraft,
  categories: CategoryDraft[],
  deletedCategoryIds: string[]
): Promise<{ ok: true; categories: Category[] } | { ok: false; message: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("admin_save_page", {
    p_profile: profile,
    p_categories: categories.map(({ id, name, hidden }, index) => ({
      id,
      name: name.trim(),
      hidden,
      order_index: index,
    })),
    p_deleted_category_ids: deletedCategoryIds,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  // 공개 페이지 재검증 - 방금 저장한 값이 ISR 캐시를 기다리지 않고 바로 보이게.
  revalidatePath("/");
  return { ok: true, categories: data ?? [] };
}
