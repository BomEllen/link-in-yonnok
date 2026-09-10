import { createClient } from "@/lib/supabase/server";
import type { Category, Link, Profile } from "@/lib/types";

// 관리 화면 전용 - authenticated 세션으로 조회하므로 hidden=true 카테고리도 포함된다
// (supabase/migrations/20260909140000_admin_policies.sql의 "admin full access" 정책).
export async function getAdminPageData(): Promise<{
  profile: Profile;
  categories: Category[];
  linkCountByCategory: Record<string, number>;
}> {
  const supabase = await createClient();

  const [profileRes, categoriesRes, linksRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", 1).single(),
    supabase
      .from("categories")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("order_index", { ascending: true })
      .order("id", { ascending: true }),
    supabase.from("links").select("category_id, pinned_category_id"),
  ]);

  if (profileRes.error) throw profileRes.error;
  if (categoriesRes.error) throw categoriesRes.error;
  if (linksRes.error) throw linksRes.error;

  const linkCountByCategory: Record<string, number> = {};
  for (const row of linksRes.data ?? []) {
    if (row.category_id) {
      linkCountByCategory[row.category_id] = (linkCountByCategory[row.category_id] ?? 0) + 1;
    }
    if (row.pinned_category_id) {
      linkCountByCategory[row.pinned_category_id] =
        (linkCountByCategory[row.pinned_category_id] ?? 0) + 1;
    }
  }

  return {
    profile: profileRes.data,
    categories: categoriesRes.data ?? [],
    linkCountByCategory,
  };
}

// 등록/수정 화면의 카테고리 chip 목록용 - hidden 포함 전체를 순서대로.
export async function getCategoriesForAdmin(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("order_index", { ascending: true })
    .order("id", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

// 링크 관리 목록(app/admin/links)용 - 카테고리 전체 + 링크 전체를 한 번에.
export async function getLinksAdminData(): Promise<{
  categories: Category[];
  links: Link[];
}> {
  const supabase = await createClient();

  const [categoriesRes, linksRes] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("order_index", { ascending: true })
      .order("id", { ascending: true }),
    supabase
      .from("links")
      .select("*")
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  if (categoriesRes.error) throw categoriesRes.error;
  if (linksRes.error) throw linksRes.error;

  return {
    categories: categoriesRes.data ?? [],
    links: linksRes.data ?? [],
  };
}

// 링크 수정 화면(app/admin/links/[id])용 - 링크 하나 + 카테고리 전체.
export async function getLinkForEdit(id: string): Promise<{
  link: Link;
  categories: Category[];
}> {
  const supabase = await createClient();

  const [linkRes, categoriesRes] = await Promise.all([
    supabase.from("links").select("*").eq("id", id).single(),
    supabase
      .from("categories")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("order_index", { ascending: true })
      .order("id", { ascending: true }),
  ]);

  if (linkRes.error) throw linkRes.error;
  if (categoriesRes.error) throw categoriesRes.error;

  return {
    link: linkRes.data,
    categories: categoriesRes.data ?? [],
  };
}
