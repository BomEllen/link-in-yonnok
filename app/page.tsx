import type { Metadata } from "next";
import { getPublicPageData, getPublicProfile } from "@/lib/data/public";
import { PublicMainView } from "./components/PublicMainView";

// ISR: 60초마다 재검증. 관리자가 저장하면 각 서버 액션의 revalidatePath('/')로 즉시 갱신된다.
export const revalidate = 60;

// 카카오톡/인스타 등에 링크를 공유했을 때 뜨는 미리보기 카드용 OG 태그.
export async function generateMetadata(): Promise<Metadata> {
  const profile = await getPublicProfile();

  return {
    title: profile.nickname,
    description: profile.bio,
    openGraph: {
      title: profile.nickname,
      description: profile.bio,
      images: profile.avatar_url ? [profile.avatar_url] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: profile.nickname,
      description: profile.bio,
      images: profile.avatar_url ? [profile.avatar_url] : undefined,
    },
  };
}

export default async function PublicMainPage() {
  const { profile, categories, links } = await getPublicPageData();

  return <PublicMainView profile={profile} categories={categories} links={links} />;
}
