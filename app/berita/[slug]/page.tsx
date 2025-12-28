import { db } from "@/db/drizzle";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/back-button";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  // Ambil data berita berdasarkan slug (sesuaikan dengan query kamu)
  const post = await db.query.posts.findFirst({
    where: eq(posts.slug, (await params).slug),
  });

  if (!post) {
    return {
      title: "Berita Tidak Ditemukan",
    };
  }

  return {
    title: post.title, // Judul tab akan menjadi judul berita
    description: post.content.substring(0, 150), // Deskripsi singkat untuk SEO
    openGraph: {
      images: [post.imageUrl || ""], // Gambar thumbnail saat di-share di WA/FB
    },
  };
}

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Ambil data berita berdasarkan slug + Relasi Kategori
  const post = await db.query.posts.findFirst({
    where: eq(posts.slug, slug),
    with: {
      category: true,
    },
  });

  if (!post) return notFound();

  return (
    <article className="min-h-screen bg-white pb-20">
      {/* Header/Navigation Back */}
      <div className="container mx-auto px-4 py-6">
        <BackButton />
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Kategori & Tanggal */}
        <div className="flex items-center justify-center gap-3 mb-4">
          {post.category && <Badge>{post.category.name}</Badge>}
          <span className="text-gray-500 text-sm">
            {formatDate(post.createdAt)}
          </span>
        </div>

        {/* Judul Besar */}
        <h1 className="text-3xl md:text-5xl font-black text-center leading-tight mb-8 text-gray-900">
          {post.title}
        </h1>

        {/* Gambar Utama */}
        {post.imageUrl && (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-10 shadow-lg">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Isi Berita */}
        <div className="prose prose-lg prose-blue mx-auto text-gray-800 leading-relaxed">
          <div
            className="prose prose-lg prose-red max-w-none text-gray-700 leading-relaxed 
                prose-img:rounded-xl prose-img:shadow-md prose-img:w-full prose-img:object-cover"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Footer Author */}
        <div className="mt-12 border-t pt-6 text-center text-gray-500">
          Ditulis oleh{" "}
          <span className="font-bold text-gray-800">
            {post.author || "Redaksi CieTV"}
          </span>
        </div>
      </div>
    </article>
  );
}
