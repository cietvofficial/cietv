import { db } from "@/db/drizzle";
import { posts } from "@/db/schema";
import { ilike, or, desc, and, eq } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, SearchX } from "lucide-react";
import { Navbar } from "@/components/navbar";

// Helper format tanggal
function formatDate(date: Date | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function stripHtml(html: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
}

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export default async function SearchPage(props: SearchPageProps) {
  // 2. LAKUKAN AWAIT TERLEBIH DAHULU
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";
  // Jika tidak ada query, tampilkan kosong atau redirect
  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center text-gray-500">
          <p>Silakan masukkan kata kunci pencarian.</p>
        </div>
      </div>
    );
  }

  // QUERY DATABASE
  // Menggunakan ilike (case-insensitive) untuk mencari di Title ATAU Content
  const searchResults = await db.query.posts.findMany({
    where: and(
      eq(posts.published, true), // Hanya cari yang published
      or(ilike(posts.title, `%${query}%`), ilike(posts.content, `%${query}%`))
    ),
    orderBy: [desc(posts.createdAt)],
    with: {
      category: true,
    },
    limit: 20, // Batasi hasil agar tidak terlalu berat
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            Hasil Pencarian: <span className="text-red-600">"{query}"</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Ditemukan {searchResults.length} artikel.
          </p>
        </div>

        {/* JIKA HASIL KOSONG */}
        {searchResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-dashed">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <SearchX className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">
              Tidak ditemukan
            </h3>
            <p className="text-gray-500 text-sm max-w-xs text-center mt-2">
              Maaf, kami tidak menemukan berita dengan kata kunci "{query}".
              Coba kata kunci lain.
            </p>
          </div>
        ) : (
          /* GRID HASIL PENCARIAN */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((post) => (
              <Link
                href={`/berita/${post.slug}`} // Sesuaikan dengan route detail berita kamu
                key={post.id}
                className="group flex flex-col bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-video w-full bg-gray-200">
                  {post.imageUrl ? (
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant="secondary"
                      className="bg-white/90 backdrop-blur-sm text-xs shadow-sm"
                    >
                      {post.category?.name}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" /> {post.author || "Admin"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />{" "}
                      {formatDate(post.createdAt)}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                    {stripHtml(post.content).substring(0, 100)}...
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
