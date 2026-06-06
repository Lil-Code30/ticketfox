import { getTags } from "@/app/actions/tags";
import { TagList } from "@/components/tags/tag-list";

export const dynamic = "force-dynamic";

export default async function TagsPage() {
  const { data, success, error } = await getTags();

  if (!success) {
    return (
      <div className="p-12 text-center text-red-500">
        Failed to load tags: {error}
      </div>
    );
  }

  return <TagList initialData={data || []} />;
}
