"use server";

import { db } from "@/db/drizzle";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { redirect } from "next/navigation";

// --- CREATE ---
export async function createPostAction(prevState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const author = formData.get("author") as string;
  const categoryId = formData.get("categoryId");
  const imageFile = formData.get("image") as File;
  const actionType = formData.get("submitAction") as string;
  const isPublished = actionType === "publish"; 

  const slug = title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

  try {
    // Upload ke Cloudinary
    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      const uploadResult = await uploadToCloudinary(imageFile, "cietv/berita");
      if (uploadResult) {
        imageUrl = uploadResult.url; 
      }
    }

    // Simpan ke Database
    await db.insert(posts).values({
      title,
      slug,
      content,
      imageUrl,
      author,
      categoryId: categoryId ? parseInt(categoryId as string) : null,
      published: isPublished,
    });
  } catch (error) {
    // console.error(error);
    return { success: false, error: "Gagal membuat berita." };
  }
  revalidatePath("/admin/posts");
  redirect("/admin/posts?success=created");
}

// --- UPDATE ---
export async function updatePostAction(
  id: number,
  prevState: any,
  formData: FormData
) {
  // Validasi ID
  if (!id) {
    return { success: false, error: "ID Berita tidak ditemukan." };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const author = formData.get("author") as string;
  const categoryId = formData.get("categoryId");
  const imageFile = formData.get("image") as File;
  const actionType = formData.get("submitAction") as string;

  const isPublished = actionType === "publish";

  // Buat slug baru jika judul berubah
  const slug = title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

  try {
    const updateData: any = {
      title,
      slug,
      content,
      author,
      categoryId: categoryId ? parseInt(categoryId as string) : null,
      published: isPublished,
    };

    // --- LOGIKA GAMBAR ---
    // Pastikan file benar-benar ada dan memiliki ukuran (bukan file kosong)
    if (imageFile && imageFile.size > 0 && imageFile.name !== "undefined") {

      const uploadResult = await uploadToCloudinary(imageFile, "cietv/berita");

      if (uploadResult) {
        updateData.imageUrl = uploadResult.url;
        // console.log("Upload berhasil:", uploadResult.url);
      } else {
        throw new Error("Gagal upload ke Cloudinary");
      }
    }

    await db.update(posts).set(updateData).where(eq(posts.id, id));
  } catch (error) {
    // console.error("ERROR UPDATE POST:", error);
    return {
      success: false,
      error: "Gagal update berita.",
    };
  }
  revalidatePath("/admin/posts");
  redirect("/admin/posts?success=updated");
}

export async function deletePost(id: number) {
  try {
    await db.delete(posts).where(eq(posts.id, id));

    // Refresh halaman admin agar data hilang dari tabel
    revalidatePath("/admin/posts");

    // Return sukses ke Client
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menghapus" };
  }
}
