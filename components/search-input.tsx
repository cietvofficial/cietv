"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ambil nilai query yang ada di URL (jika ada) agar input tidak kosong saat refresh
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah reload halaman

    // Jika input kosong, jangan lakukan apa-apa
    if (!query.trim()) return;

    // Redirect ke halaman search dengan parameter q
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative group">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-red-600 transition-colors" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari berita..."
        className="pl-10 pr-4 py-2 bg-gray-100 border-transparent border focus:bg-white focus:border-red-600 rounded-full text-sm outline-none transition-all w-40 focus:w-64"
      />
    </form>
  );
};
