import Link from "next/link";
import { db } from "@/db/drizzle";
import { posts, categories } from "@/db/schema";
import { desc, asc, eq, ilike, sql, or } from "drizzle-orm";
import { Plus, Pencil, Eye, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminPostToolbar } from "@/components/admin-post-toolbar";
import { SortableHeader } from "@/components/sortable-header";
import { DeletePostButton } from "@/components/delete-post-button";
import { PostToastListener } from "@/components/post-toast-listener";

const ITEMS_PER_PAGE = 10;

interface AdminPostsPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    sortCol?: string;
    sortOrder?: "asc" | "desc";
  }>;
}

export default async function AdminPostsPage(props: AdminPostsPageProps) {
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const query = searchParams.q || "";
  const sortCol = searchParams.sortCol || "date";
  const sortOrder = searchParams.sortOrder || "desc";
  const offset = (page - 1) * ITEMS_PER_PAGE;

  // SEARCH LOGIC
  const searchCondition = query
    ? or(
        ilike(posts.title, `%${query}%`),
        ilike(categories.name, `%${query}%`),
        sql`CAST(${posts.createdAt} AS TEXT) ILIKE ${`%${query}%`}`,
        sql`CASE WHEN ${
          posts.published
        } THEN 'published' ELSE 'draft' END ILIKE ${`%${query}%`}`
      )
    : undefined;

  // SORT LOGIC
  let orderByClause;
  const direction = sortOrder === "asc" ? asc : desc;

  switch (sortCol) {
    case "title":
      orderByClause = direction(posts.title);
      break;
    case "category":
      orderByClause = direction(categories.name);
      break;
    case "status":
      orderByClause = direction(posts.published);
      break;
    case "date":
    default:
      orderByClause = direction(posts.createdAt);
      break;
  }

  // QUERY UTAMA
  const dataQuery = db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      published: posts.published,
      createdAt: posts.createdAt,
      categoryName: categories.name,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(searchCondition)
    .orderBy(orderByClause)
    .limit(ITEMS_PER_PAGE)
    .offset(offset);

  // QUERY TOTAL COUNT
  const countQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(searchCondition);

  const [postList, totalCountRes] = await Promise.all([dataQuery, countQuery]);

  const totalItems = Number(totalCountRes[0].count);
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      <PostToastListener />
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kelola Berita</h1>
          <p className="text-gray-500 text-sm">
            Total {totalItems} artikel ditemukan
          </p>
        </div>
        <Link href="/admin/posts/create" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" /> Buat Berita
          </Button>
        </Link>
      </div>

      {/* TOOLBAR */}
      <AdminPostToolbar />

      {/* JIKA KOSONG */}
      {postList.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed">
          <p className="text-gray-500">Tidak ada data ditemukan.</p>
        </div>
      ) : (
        <>
          {/* --- VIEW 1: DESKTOP TABLE (Hidden on Mobile) --- */}
          <div className="hidden md:block bg-white rounded-xl border shadow-sm overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 font-medium border-b">
                <tr>
                  <th className="px-6 py-4">
                    <SortableHeader label="Judul Berita" value="title" />
                  </th>
                  <th className="px-6 py-4">
                    <SortableHeader label="Kategori" value="category" />
                  </th>
                  <th className="px-6 py-4">
                    <SortableHeader label="Status" value="status" />
                  </th>
                  <th className="px-6 py-4">
                    <SortableHeader label="Tanggal" value="date" />
                  </th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {postList.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 line-clamp-1 max-w-xs">
                        {post.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="font-normal">
                        {post.categoryName || "Uncategorized"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={
                          post.published
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(post.createdAt!).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/berita/${post.slug}?form=admin`} target="_blank">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/posts/${post.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>

                        {/* 2. GANTI TOMBOL SAMPAH LAMA DENGAN INI */}
                        <DeletePostButton id={post.id} title={post.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- VIEW 2: MOBILE CARDS (Visible only on Mobile) --- */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {postList.map((post) => (
              <div
                key={post.id}
                className="bg-white p-4 rounded-xl border shadow-sm space-y-3"
              >
                {/* Header Card: Kategori & Status */}
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs font-normal">
                    {post.categoryName || "Uncategorized"}
                  </Badge>
                  <Badge
                    className={`text-xs px-2 py-0.5 ${
                      post.published
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                </div>

                {/* Content: Judul */}
                <div>
                  <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.createdAt!).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>

                {/* Footer Card: Actions */}
                <div className="pt-3 border-t flex items-center justify-between">
                  <span className="text-xs text-gray-400">Actions</span>
                  <div className="flex gap-1">
                    <Link href={`/berita/${post.slug}?from=admin`} target="_blank">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </Button>
                    </Link>
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Pencil className="w-4 h-4 text-blue-600" />
                      </Button>
                    </Link>
                    <div>
                      <DeletePostButton id={post.id} title={post.title} />
                    </div>

                    {/* Contoh Dropdown Menu untuk Mobile agar hemat tempat jika banyak tombol
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-red-600 focus:text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" /> Hapus Berita
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <div className="text-sm text-gray-500 order-2 sm:order-1">
            Halaman {page} dari {totalPages}
          </div>
          <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto">
            <Link
              href={`?page=${
                page - 1
              }&q=${query}&sortCol=${sortCol}&sortOrder=${sortOrder}`}
              className={`w-1/2 sm:w-auto ${
                !hasPrev ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                disabled={!hasPrev}
              >
                Sebelumnya
              </Button>
            </Link>

            <Link
              href={`?page=${
                page + 1
              }&q=${query}&sortCol=${sortCol}&sortOrder=${sortOrder}`}
              className={`w-1/2 sm:w-auto ${
                !hasNext ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                disabled={!hasNext}
              >
                Selanjutnya
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
