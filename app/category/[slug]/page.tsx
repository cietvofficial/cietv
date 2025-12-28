import { db } from "@/db/drizzle";
import { posts, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";

// Fungsi helper format tanggal
function formatDate(date: Date | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  const categoryData = await db.query.categories.findFirst({
    where: eq(categories.slug, slug), 
  });

  if (!categoryData) return notFound();

  const categoryPosts = await db.query.posts.findMany({
    where: eq(posts.categoryId, categoryData.id),
    orderBy: [desc(posts.createdAt)],
    with: { category: true },
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header Kategori */}
        <div className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-black uppercase text-gray-900">
            Berita: <span className="text-red-600">{categoryData.name}</span>
          </h1>
          <p className="text-gray-500 mt-2">
            Menampilkan {categoryPosts.length} berita terbaru di kategori ini.
          </p>
        </div>

        {/* Grid Berita */}
        {categoryPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryPosts.map((post: any) => (
              <Link
                href={`/news/${post.slug}`}
                key={post.id}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition border"
              >
                <div className="relative aspect-video w-full bg-gray-200">
                  {post.imageUrl ? (
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No Image
                    </div>
                  )}
                  <Badge className="absolute top-2 left-2 bg-red-600">
                    {categoryData.name}
                  </Badge>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex text-xs text-gray-500 gap-3">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" /> {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />{" "}
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                  <h2 className="font-bold text-lg leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <div
                    className="text-sm text-gray-600 line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: post.content.substring(0, 150),
                    }}
                  ></div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            Belum ada berita di kategori ini.
          </div>
        )}
      </main>
    </div>
  );
}
