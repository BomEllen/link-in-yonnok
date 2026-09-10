import { notFound } from "next/navigation";
import { getLinkForEdit } from "@/lib/data/admin";
import { EditLinkView } from "./EditLinkView";

export default async function EditLinkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let data: Awaited<ReturnType<typeof getLinkForEdit>>;
  try {
    data = await getLinkForEdit(id);
  } catch {
    notFound();
  }

  return <EditLinkView link={data.link} categories={data.categories} />;
}
