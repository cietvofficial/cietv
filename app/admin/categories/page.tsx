import Link from "next/link";
import { db } from "@/db/drizzle";
import { categories } from "@/db/schema";
import { desc, asc, ilike, sql } from "drizzle-orm";
import { Pencil, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminCategoryToolbar } from "@/components/admin-category-toolbar";
import { SortableHeader } from "@/components/sortable-header";
import { CreateCategoryModal } from "@/components/create-category-modal"; 
import { DeleteCategoryButton } from "@/components/delete-category-button";
import { EditCategoryModal } from "@/components/edit-category-modal";

const ITEMS_PER_PAGE = 5;

interface AdminCategoriesPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    sortCol?: string;
    sortOrder?: "asc" | "desc";
  }>;
}

export default async function AdminCategoriesPage(
  props: AdminCategoriesPageProps
) {
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const query = searchParams.q || "";
  const sortCol = searchParams.sortCol || "date";
  const sortOrder = searchParams.sortOrder || "desc";
  const offset = (page - 1) * ITEMS_PER_PAGE;

  // SEARCH LOGIC
  const searchCondition = query
    ? ilike(categories.name, `%${query}%`)
    : undefined;

  // SORT LOGIC
  let orderByClause;
  const direction = sortOrder === "asc" ? asc : desc;

  switch (sortCol) {
    case "name":
      orderByClause = direction(categories.name);
      break;
    case "date":
    default:
      orderByClause = direction(categories.createdAt);
      break;
  }

  // QUERY UTAMA
  const dataQuery = db
    .select()
    .from(categories)
    .where(searchCondition)
    .orderBy(orderByClause)
    .limit(ITEMS_PER_PAGE)
    .offset(offset);

  // QUERY TOTAL COUNT
  const countQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(categories)
    .where(searchCondition);

  const [categoryList, totalCountRes] = await Promise.all([
    dataQuery,
    countQuery,
  ]);

  const totalItems = Number(totalCountRes[0].count);
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kategori</h1>
          <p className="text-gray-500 text-sm">
            Total {totalItems} kategori ditemukan
          </p>
        </div>
        {/* Tombol Modal Tambah Kategori */}
        <CreateCategoryModal />
      </div>

      {/* TOOLBAR */}
      <AdminCategoryToolbar />

      {/* DATA DISPLAY */}
      {categoryList.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed">
          <p className="text-gray-500">Tidak ada kategori ditemukan.</p>
        </div>
      ) : (
        <>
          {/* VIEW DESKTOP (TABLE) */}
          <div className="hidden md:block bg-white rounded-xl border shadow-sm overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 font-medium border-b">
                <tr>
                  <th className="px-6 py-4">
                    <SortableHeader label="Nama Kategori" value="name" />
                  </th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">
                    <SortableHeader label="Dibuat Tanggal" value="date" />
                  </th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {categoryList.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {cat.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500 italic">
                      {cat.slug}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {cat.createdAt
                        ? new Date(cat.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Component Edit */}
                        <EditCategoryModal category={cat} />

                        {/* Component Delete */}
                        <DeleteCategoryButton id={cat.id} name={cat.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* VIEW MOBILE (CARDS) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {categoryList.map((cat) => (
              <div
                key={cat.id}
                className="bg-white p-4 rounded-xl border shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">{cat.name}</h3>
                  <span className="text-xs text-gray-400 italic">
                    /{cat.slug}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {cat.createdAt
                    ? new Date(cat.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "-"}
                </div>

                <div className="pt-3 border-t flex items-center justify-end gap-2">
                  <div className="scale-90 origin-right">
                    {" "}
                    <EditCategoryModal category={cat} />
                  </div>

                  {/* Delete Versi Mobile */}
                  <div className="scale-90 origin-right">
                    <DeleteCategoryButton id={cat.id} name={cat.name} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* PAGINATION */}
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
