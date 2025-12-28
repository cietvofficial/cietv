import { db } from "@/db/drizzle";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import CategoryForm from "@/components/admin/category-form";
import { updateCategoryAction } from "@/server/category-actions";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const catId = parseInt(id);

  if (isNaN(catId)) return notFound();

  const result = await db.select().from(categories).where(eq(categories.id, catId)).limit(1);
  const category = result[0];

  if (!category) return notFound();

  // bind ID ke action update
  const updateActionWithId = updateCategoryAction.bind(null, category.id);

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Kategori</h1>
      <CategoryForm 
        actionHandler={updateActionWithId} 
        initialData={category}
        buttonLabel="Update Kategori" 
      />
    </div>
  );
}