import { getKnowledgeById } from "@/app/actions/knowledge";
import { getCategories } from "@/app/actions/categories";
import { KnowledgeForm } from "@/components/knowledge/knowledge-form";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditKnowledgePage({ params }: { params: { id: string } }) {
  const [knowledgeRes, categoriesRes] = await Promise.all([
    getKnowledgeById(params.id),
    getCategories(),
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
    />
  );
}
