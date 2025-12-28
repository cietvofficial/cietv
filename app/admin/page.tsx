import { db } from "@/db/drizzle";
import { posts, categories } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { FileText, List, CheckCircle } from "lucide-react";

// Komponen Kartu Statistik Kecil
function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`rounded-full p-3 ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
      </div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  // 1. Hitung Total Berita
  const [postsCount] = await db.select({ value: count() }).from(posts);

  // 2. Hitung Berita Published
  const [publishedCount] = await db
    .select({ value: count() })
    .from(posts)
    .where(eq(posts.published, true));

  // 3. Hitung Total Kategori
  const [categoriesCount] = await db
    .select({ value: count() })
    .from(categories);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-gray-500">Selamat datang kembali, Admin!</p>
      </div>

      {/* Grid Kartu Statistik */}
      {/* grid-cols-1 = 1 kolom di HP */}
      {/* sm:grid-cols-2 = 2 kolom di Tablet */}
      {/* lg:grid-cols-3 = 3 kolom di Laptop */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Berita"
          value={postsCount.value}
          icon={FileText}
          color="bg-blue-500"
        />
        <StatCard
          title="Berita Terbit"
          value={publishedCount.value}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatCard
          title="Total Kategori"
          value={categoriesCount.value}
          icon={List}
          color="bg-purple-500"
        />
      </div>
      {/* Tips Admin */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Tips Admin</h3>
        <ul className="list-disc pl-5 text-gray-600 space-y-2">
          <li>
            Pastikan setiap berita memiliki <strong>Gambar Thumbnail</strong>{" "}
            agar tampil bagus di halaman depan.
          </li>
          <li>
            Gunakan kategori yang relevan agar pembaca mudah mencari berita.
          </li>
          <li>
            Jangan lupa klik <strong>Logout</strong> jika mengakses dari
            komputer umum.
          </li>
        </ul>
      </div>
    </div>
  );
}
