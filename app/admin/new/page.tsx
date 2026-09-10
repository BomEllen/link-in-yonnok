import { getCategoriesForAdmin } from "@/lib/data/admin";
import { NewLinkView } from "./NewLinkView";

export default async function NewLinkPage() {
  const categories = await getCategoriesForAdmin();

  return <NewLinkView categories={categories} />;
}
