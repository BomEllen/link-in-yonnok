import { getPublicPageData } from "@/lib/data/public";
import { PublicMainView } from "./components/PublicMainView";

// ISR: 60초마다 재검증. 7단계에서 관리자 저장 시 revalidatePath('/')로 즉시 갱신되도록 보강한다.
export const revalidate = 60;

export default async function PublicMainPage() {
  const { profile, categories, links } = await getPublicPageData();

  return <PublicMainView profile={profile} categories={categories} links={links} />;
}
