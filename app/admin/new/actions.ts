"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createLink(input: {
  thumbnail_url: string;
  title: string;
  url: string;
  category_id: string | null;
  pinned_category_id: string | null;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const supabase = await createClient();

  // README: "등록하면 메인 페이지 맨 위에 추가됩니다" - 같은 카테고리(또는 미분류)
  // 안에서 현재 가장 작은 order_index보다 하나 더 작은 값을 줘서 맨 앞에 오게 한다.
  let minQuery = supabase
    .from("links")
    .select("order_index")
    .order("order_index", { ascending: true })
    .limit(1);
  minQuery = input.category_id
    ? minQuery.eq("category_id", input.category_id)
    : minQuery.is("category_id", null);

  const { data: existing, error: selectError } = await minQuery;
  if (selectError) {
    return { ok: false, message: selectError.message };
  }

  const newOrderIndex = existing && existing.length > 0 ? existing[0].order_index - 1 : 0;

  const { error } = await supabase.from("links").insert({
    category_id: input.category_id,
    pinned_category_id: input.pinned_category_id,
    thumbnail_url: input.thumbnail_url,
    title: input.title.trim(),
    url: input.url.trim(),
    order_index: newOrderIndex,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/");
  return { ok: true };
}
