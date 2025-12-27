"use server";

import { db } from "@/db/drizzle";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { uploadToCloudinary } from "@/lib/cloudinary"; // Import helper tadi
import { redirect } from "next/navigation";

// --- CREATE ---
export async function createPostAction(prevState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const author = formData.get("author") as string;
  const categoryId = formData.get("categoryId");
  const imageFile = formData.get("image") as File;
  const actionType = formData.get("submitAction") as string;
  const isPublished = actionType === "publish"; // True jika publish, False jika draft

  const slug = title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

  try {
    // 1. Upload ke Cloudinary
    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      const uploadResult = await uploadToCloudinary(imageFile, "cietv/berita");
      if (uploadResult) {
        imageUrl = uploadResult.url; // Kita simpan URL dari Cloudinary
      }
    }

    // 2. Simpan ke Database
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
    console.error(error);
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
  // 1. Validasi ID
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
      console.log("Mulai upload gambar update...", imageFile.name); // Debugging

      const uploadResult = await uploadToCloudinary(imageFile, "cietv/berita");

      if (uploadResult) {
        updateData.imageUrl = uploadResult.url;
        console.log("Upload berhasil:", uploadResult.url);
      } else {
        throw new Error("Gagal upload ke Cloudinary");
      }
    }

    // Update DB
    await db.update(posts).set(updateData).where(eq(posts.id, id));
  } catch (error) {
    // PENTING: Log error ke terminal VS Code agar kita tahu alasannya
    console.error("ERROR UPDATE POST:", error);
    return {
      success: false,
      error: "Gagal update berita. Cek terminal server.",
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
