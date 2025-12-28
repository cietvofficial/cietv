import "dotenv/config";

import { db } from "@/db/drizzle";
import { posts, categories } from "@/db/schema"; 
import { fakerID_ID as faker } from "@faker-js/faker"; 
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

// Daftar Kategori Statis
const CATEGORIES = [
  { name: "Politik", slug: "politik" },
  { name: "Ekonomi", slug: "ekonomi" },
  { name: "Olahraga", slug: "olahraga" },
  { name: "Teknologi", slug: "teknologi" },
  { name: "Hiburan", slug: "hiburan" },
  { name: "Kesehatan", slug: "kesehatan" },
  { name: "Otomotif", slug: "otomotif" },
];

// Helper untuk membuat slug unik
const createSlug = (title: string) => {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") +
    "-" +
    Math.floor(Math.random() * 1000)
  );
};

// Helper gambar dummy (agar loading cepat & variatif)
const getTopicImage = (topic: string) => {
  return `https://placehold.co/600x400/png?text=${topic}+News`;
};

async function main() {
  console.log("🌱 Memulai seeding database...");

  try {
    // Bersihkan data lama (Opsional - Hati-hati di Production!)
    console.log("🧹 Menghapus data lama...");
    await db.delete(posts);
    await db.delete(categories);

    // Insert Kategori
    console.log("📂 Membuat kategori...");
    const insertedCategories = await db
      .insert(categories)
      .values(
        CATEGORIES.map((cat) => ({
          name: cat.name,
          slug: cat.slug,
          description: `Berita seputar dunia ${cat.name}`,
        }))
      )
      .returning();

    // Generate 100 Berita
    console.log("📝 Membuat 100 berita dummy...");
    const newPosts: any[] = [];

    for (let i = 0; i < 100; i++) {
      // Pilih kategori acak
      const randomCategory = faker.helpers.arrayElement(insertedCategories);

      // Buat Judul Berita yang terdengar Indonesia
      const titlePrefix = faker.helpers.arrayElement([
        "Terbaru:",
        "Breaking News:",
        "Eksklusif:",
        "Viral,",
        "Update:",
        "",
      ]);
      const title = `${titlePrefix} ${faker.lorem
        .sentence(5)
        .replace(".", "")}`;

      // Buat Content HTML
      const content = `
        <p><strong>${randomCategory.name.toUpperCase()}</strong> - ${faker.lorem.paragraph()}</p>
        <p>${faker.lorem.paragraph()}</p>
        <h3>${faker.lorem.sentence(3)}</h3>
        <p>${faker.lorem.paragraph()}</p>
        <blockquote>"${faker.lorem.sentence()}"</blockquote>
        <p>${faker.lorem.paragraph()}</p>
      `;

      newPosts.push({
        title: title,
        slug: createSlug(title),
        content: content,
        imageUrl: getTopicImage(randomCategory.name),
        author: faker.person.fullName(),
        published: faker.datatype.boolean(0.9), 
        categoryId: randomCategory.id, 
        createdAt: faker.date.recent({ days: 365 }), 
        updatedAt: new Date(),
      });
    }

    const batchSize = 10;
    for (let i = 0; i < newPosts.length; i += batchSize) {
      await db.insert(posts).values(newPosts.slice(i, i + batchSize));
    }

    console.log("✅ Seeding selesai! 100 Berita berhasil dibuat.");
  } catch (error) {
    console.error("❌ Terjadi kesalahan saat seeding:", error);
  } finally {
    process.exit(0);
  }
}

main();
