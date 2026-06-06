import { getCategories } from "@/app/actions/categories";
import { CategoryList } from "@/components/categories/category-list";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const { data, success, error } = await getCategories();

  if (!success) {
    return (
      <div className="p-12 text-center text-red-500">
        Failed to load categories: {error}
      </div>
    );
  }

  return <CategoryList initialData={data || []} />;
}
