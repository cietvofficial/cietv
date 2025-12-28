import { db } from "@/db/drizzle";
import { posts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";

// --- TYPES ---
// Mengambil tipe data otomatis dari skema Drizzle + relasi category
type PostWithCategory = typeof posts.$inferSelect & {
  category: { name: string } | null;
};

// --- HELPERS ---

// Format Tanggal Indonesia
function formatDate(date: Date | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Strip HTML Tags (Penting untuk preview teks agar layout tidak pecah)
function stripHtml(html: string) {
  if (!html) return "";

  return html
    .replace(/<[^>]*>?/gm, "") // Hapus semua tag HTML (<...>)
    .replace(/&nbsp;/g, " ") // Ganti &nbsp; menjadi spasi biasa
    .replace(/\s+/g, " ") // Gabungkan spasi yang berdempetan menjadi satu spasi
    .trim(); // Hapus spasi di awal dan akhir kalimat
}

export const revalidate = 60;

export default async function HomePage() {
  // Ambil Data
  const allPosts = await db.query.posts.findMany({
    where: eq(posts.published, true),
    orderBy: [desc(posts.createdAt)],
    with: {
      category: true,
    },
    limit: 10,
  });

  // Jika tidak ada data
  if (!allPosts || allPosts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center px-4">
          <div className="bg-white p-6 rounded-full shadow-sm">
            <Calendar className="w-12 h-12 text-gray-300" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700">
            Belum ada berita
          </h2>
          <p className="text-gray-500 max-w-md">
            Saat ini belum ada artikel yang diterbitkan. Silakan kembali lagi
            nanti.
          </p>
        </div>
      </div>
    );
  }

  // Bagi Data Layout
  const typedPosts = allPosts as PostWithCategory[];
  const [heroPost, ...restPosts] = typedPosts;
  const sidePosts = restPosts.slice(0, 3);
  const gridPosts = restPosts.slice(3);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* --- SECTION 1: HERO & SIDEBAR --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* HERO POST (Kiri - 8 Kolom) */}
          <div className="lg:col-span-8 group cursor-pointer">
            <Link href={`/berita/${heroPost.slug}`}>
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-gray-200 shadow-sm">
                {heroPost.imageUrl ? (
                  <Image
                    src={heroPost.imageUrl}
                    alt={heroPost.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400 bg-gray-100">
                    <span className="text-sm font-medium">
                      No Image Available
                    </span>
                  </div>
                )}
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-red-600 hover:bg-red-700 text-white border-none px-3 py-1 text-sm shadow-lg">
                    {heroPost.category?.name || "Umum"}
                  </Badge>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center text-sm text-gray-500 gap-4">
                  <span className="flex items-center gap-1.5 font-medium text-gray-600">
                    <User className="w-4 h-4 text-red-600" />{" "}
                    {heroPost.author || "Redaksi"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {formatDate(heroPost.createdAt)}
                  </span>
                </div>

                <h1 className="text-2xl md:text-4xl font-extrabold leading-tight group-hover:text-red-700 transition-colors">
                  {heroPost.title}
                </h1>

                <p className="text-gray-600 md:text-lg leading-relaxed line-clamp-3">
                  {stripHtml(heroPost.content).substring(0, 150)}...
                </p>
              </div>
            </Link>
          </div>

          {/* SIDEBAR (Kanan - 4 Kolom) */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Widget: Top News */}
            <div className="bg-white p-5 rounded-xl border shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span className="w-1 h-6 bg-red-600 rounded-full"></span>
                  Terpopuler
                </h3>
                <Link
                  href="/news"
                  className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline"
                >
                  Lihat Semua
                </Link>
              </div>

              <div className="flex flex-col gap-6">
                {sidePosts.map((post) => (
                  <Link
                    href={`/berita/${post.slug}`}
                    key={post.id}
                    className="group flex gap-4 items-start"
                  >
                    <div className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border">
                      {post.imageUrl && (
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100px, 150px"
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Badge
                        variant="secondary"
                        className="w-fit text-[10px] px-1.5 py-0 h-5 text-gray-600 bg-gray-100 group-hover:bg-red-50 group-hover:text-red-600 transition-colors"
                      >
                        {post.category?.name || "News"}
                      </Badge>
                      <h4 className="font-bold text-sm leading-snug line-clamp-2 group-hover:text-red-700 transition-colors">
                        {post.title}
                      </h4>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />{" "}
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Widget: Iklan */}
            {/* <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
              <span className="text-sm font-semibold">Space Iklan</span>
              <span className="text-xs">300 x 250</span>
            </div> */}
          </aside>
        </section>

        {/* --- SECTION 2: LATEST STORIES GRID --- */}
        {gridPosts.length > 0 && (
          <section className="pt-8 border-t">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-3 w-3 bg-red-600 rounded-full animate-pulse shadow-red-200 shadow-lg"></div>
              <h2 className="text-2xl font-bold text-gray-800">
                Berita Terbaru Lainnya
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
              {gridPosts.map((post) => (
                <Link
                  href={`/berita/${post.slug}`}
                  key={post.id}
                  className="group flex flex-col h-full"
                >
                  {/* Image Card */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-gray-200 mb-4 border shadow-sm">
                    {post.imageUrl && (
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/95 backdrop-blur-sm hover:bg-white text-gray-800 border-none shadow-sm text-xs font-semibold">
                        {post.category?.name || "News"}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center text-xs text-gray-500 gap-2 mb-2">
                      <span className="font-medium text-gray-700">
                        {post.author || "Admin"}
                      </span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>

                    <h3 className="text-xl font-bold leading-snug mb-3 group-hover:text-red-700 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4 flex-1">
                      {stripHtml(post.content).substring(0, 120)}...
                    </p>

                    <div className="text-red-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Baca Selengkapnya <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
