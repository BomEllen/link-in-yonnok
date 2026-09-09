import { getAdminPageData } from "@/lib/data/admin";
import { AdminView } from "./AdminView";

export default async function AdminPage() {
  const { profile, categories, linkCountByCategory } = await getAdminPageData();

  return (
    <AdminView profile={profile} categories={categories} linkCountByCategory={linkCountByCategory} />
  );
}
