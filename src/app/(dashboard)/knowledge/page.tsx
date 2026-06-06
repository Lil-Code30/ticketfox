import { getKnowledgeList } from "@/app/actions/knowledge";
import { getCategories } from "@/app/actions/categories";
import { KnowledgeClient } from "@/components/knowledge/knowledge-client";

export const dynamic = "force-dynamic";

export default async function KnowledgePage() {
  const [knowledgeRes, categoriesRes] = await Promise.all([
    getKnowledgeList(),
    getCategories(),
  ]);

  if (!knowledgeRes.success) {
    return (
      <div className="p-12 text-center text-red-500">
        Failed to load knowledge base: {knowledgeRes.error}
      </div>
    );
  }

  return (
    <KnowledgeClient 
      initialData={knowledgeRes.data || []} 
      categories={categoriesRes.data || []} 
    />
  );
}
