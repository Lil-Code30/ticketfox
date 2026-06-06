import { getCategories } from "@/app/actions/categories";
import { KnowledgeForm } from "@/components/knowledge/knowledge-form";

export const dynamic = "force-dynamic";

export default async function NewKnowledgePage() {
  const { data: categories, success } = await getCategories();

  if (!success) {
    return (
      <div className="p-12 text-center text-red-500">
        Failed to load categories.
      </div>
    );
  }

  return <KnowledgeForm categories={categories || []} />;
}
