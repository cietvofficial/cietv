'use server'

import { db } from "@/db/drizzle";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

function generateSlug(text: string) {
  return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

// --- CREATE ---
export async function createCategoryAction(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const slug = generateSlug(name);

  try {
    await db.insert(categories).values({ name, slug });
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal membuat kategori. Mungkin nama sudah ada?" };
  }
}

// --- UPDATE ---
export async function updateCategoryAction(id: number, prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const slug = generateSlug(name);

  try {
    await db.update(categories)
      .set({ name, slug })
      .where(eq(categories.id, id));
      
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal update kategori." };
  }
}

// --- DELETE ---
export async function deleteCategoryAction(formData: FormData) {
  const id = formData.get('id') as string;
  if (!id) return;

  try {
    await db.delete(categories).where(eq(categories.id, parseInt(id)));
    revalidatePath("/admin/categories");
  } catch (error) {
    // console.error("Gagal hapus category", error);
  }
}