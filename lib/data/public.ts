import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public-client";
import type { Category, Link, Profile } from "@/lib/types";

// generateMetadata(OG 태그)와 페이지 컴포넌트가 같은 요청 안에서 둘 다 프로필을
// 필요로 한다. React cache()로 감싸 요청 하나당 실제 조회는 한 번만 나가게 한다.
export const getPublicProfile = cache(async (): Promise<Profile> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("profiles").select("*").eq("id", 1).single();
  if (error) throw error;
  return data;
});

// 공개 메인 페이지가 필요로 하는 데이터를 한 번에 가져온다.
// hidden 카테고리 / 미분류 링크 제외는 앱 코드가 아니라 RLS 정책(마이그레이션 참고)이 책임진다 —
// anon key는 브라우저에 노출되므로 가시성 규칙은 DB 레벨에서 강제해야 한다.
export async function getPublicPageData(): Promise<{
  profile: Profile;
  categories: Category[];
  links: Link[];
}> {
  const supabase = createPublicClient();

  const [profile, categoriesRes, linksRes] = await Promise.all([
    getPublicProfile(),
    // is_pinned 카테고리("이번달 픽")가 항상 맨 앞. order_index가 겹칠 수 있으므로
    // tiebreaker를 둔다 (드래그 정렬 시 순서가 흔들리지 않도록).
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
    profile,
    categories: categoriesRes.data ?? [],
    links: linksRes.data ?? [],
  };
}
