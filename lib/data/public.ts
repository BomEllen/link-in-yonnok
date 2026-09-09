import { createPublicClient } from "@/lib/supabase/public-client";
import type { Category, Link, Profile } from "@/lib/types";

// 공개 메인 페이지가 필요로 하는 데이터를 한 번에 가져온다.
// hidden 카테고리 / 미분류 링크 제외는 앱 코드가 아니라 RLS 정책(마이그레이션 참고)이 책임진다 —
// anon key는 브라우저에 노출되므로 가시성 규칙은 DB 레벨에서 강제해야 한다.
export async function getPublicPageData(): Promise<{
  profile: Profile;
  categories: Category[];
  links: Link[];
}> {
  const supabase = createPublicClient();

  const [profileRes, categoriesRes, linksRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", 1).single(),
    // order_index가 겹칠 수 있으므로 tiebreaker를 둔다 (드래그 정렬 시 순서가 흔들리지 않도록).
    supabase
      .from("categories")
      .select("*")
      .order("order_index", { ascending: true })
      .order("id", { ascending: true }),
    supabase
      .from("links")
      .select("*")
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  if (profileRes.error) throw profileRes.error;
  if (categoriesRes.error) throw categoriesRes.error;
  if (linksRes.error) throw linksRes.error;

  return {
    profile: profileRes.data,
    categories: categoriesRes.data ?? [],
    links: linksRes.data ?? [],
  };
}
