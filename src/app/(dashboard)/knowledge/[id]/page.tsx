import { getKnowledgeById } from "@/app/actions/knowledge";
import { KnowledgeDetailClient } from "@/components/knowledge/knowledge-detail-client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function KnowledgeDetailPage({ params }: { params: { id: string } }) {
  const { data, success } = await getKnowledgeById(params.id);

  if (!success || !data) {
    notFound();
  }

  return <KnowledgeDetailClient item={data} />;
}
