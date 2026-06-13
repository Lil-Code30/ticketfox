import { getKnowledgeById } from "@/app/actions/knowledge";
import { getCategories } from "@/app/actions/categories";
import { getTags } from "@/app/actions/tags";
import { KnowledgeForm } from "@/components/knowledge/knowledge-form";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditKnowledgePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [knowledgeRes, categoriesRes, tagsRes] = await Promise.all([
    getKnowledgeById(id),
    getCategories(),
    getTags(),
  ]);

  if (!knowledgeRes.success || !knowledgeRes.data) {
    notFound();
  }

  if (!categoriesRes.success) {
    return (
      <div className="p-12 text-center text-red-500">
        Failed to load categories.
      </div>
    );
  }

  return (
    <KnowledgeForm 
      initialData={knowledgeRes.data} 
      categories={categoriesRes.data || []} 
      tags={tagsRes.data || []}
    />
  );
}
