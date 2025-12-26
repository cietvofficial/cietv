"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, ArrowUpDown } from "lucide-react";

export const AdminPostToolbar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ambil state awal dari URL
  const initialSearch = searchParams.get("q") || "";
  const initialSort = searchParams.get("sort") || "desc"; // Default desc (terbaru)

  const [search, setSearch] = useState(initialSearch);

  // Fungsi saat user menekan Enter di kolom search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (search) {
      params.set("q", search);
    } else {
      params.delete("q");
    }

    // Reset ke halaman 1 setiap kali search berubah
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  // Fungsi ganti sorting (Ascending / Descending)
  const toggleSort = () => {
    const params = new URLSearchParams(searchParams.toString());
    const newSort = initialSort === "desc" ? "asc" : "desc";

    params.set("sort", newSort);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* SEARCH FORM */}
        {/* Saya set w-full tapi max-width di desktop agar tidak kepanjangan */}
        <form onSubmit={handleSearch} className="relative w-full md:max-w-md">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari berdasarkan judul, kategori, atau status..."
              className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-lg text-sm 
                       text-gray-900 placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 
                       transition-all shadow-sm"
            />
          </div>
        </form>

        {/* SORT BUTTON (COMMENTED OUT) */}
        {/* <button
          onClick={toggleSort}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-md hover:bg-gray-50 transition-colors"
        >
          <ArrowUpDown className="h-4 w-4" />
          {initialSort === "asc" ? "Terlama" : "Terbaru"}
        </button> 
        */}
      </div>
    </div>
  );
};
