import { getCategories } from "@/app/actions/categories";
import { getTags } from "@/app/actions/tags";
import { KnowledgeForm } from "@/components/knowledge/knowledge-form";

export const dynamic = "force-dynamic";

export default async function NewKnowledgePage() {
  const [categoriesRes, tagsRes] = await Promise.all([
    getCategories(),
    getTags(),
  ]);

  if (!categoriesRes.success) {
    return (
      <div className="p-12 text-center text-red-500">
        Failed to load categories.
      </div>
    );
  }

  return (
    <KnowledgeForm 
      categories={categoriesRes.data || []} 
      tags={tagsRes.data || []}
    />
  );
}
