import Link from "next/link";
import Image from "next/image";
import { SearchInput } from "./search-input";
import { db } from "@/db/drizzle";
import { categories } from "@/db/schema";
import { MobileNav } from "./mobile-nav"; 
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";
import { Suspense } from "react";

export async function Navbar() {
  // Ambil data kategori
  const categoryList = await db.select().from(categories);

  // Ambil 7 kategori pertama untuk ditampilkan di baris menu (agar tidak penuh)
  // Sisanya akan ada di dalam Burger Menu
  const featuredCategories = categoryList.slice(0, 7);

  return (
    <header className="bg-white text-gray-900 sticky top-0 z-50 shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        {/* === BARIS 1: LOGO, SEARCH, AKSI === */}
        <div className="h-16 flex items-center justify-between gap-4 py-3">
          {/* LOGO */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo_cietv.png"
              alt="CIETV Logo"
              width={150}
              height={60}
              // Gunakan brightness-0 invert jika logo aslinya hitam agar jadi putih
              // Atau biarkan jika logo sudah berwarna terang
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* SEARCH BAR (Tengah & Lebar) */}
          {/* <div className="d-flex justify-end max-w-2xl mx-4 hidden sm:block"> */}
          <div className="d-flex justify-end max-w-2xl mx-4">
            <Suspense fallback={<div className="h-10 w-full bg-gray-100 rounded-md animate-pulse" />}>
                <SearchInput className="bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-500 focus-visible:ring-blue-600" />
            </Suspense>
          </div>
        </div>

        {/* === BARIS 2: KATEGORI & BURGER MENU === */}
        <div className="border-t border-gray-100 h-12 flex items-center justify-between">
          <nav className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2 w-full">
            <Link
              href="/"
              className="text-sm font-bold uppercase text-gray-800 hover:text-red-600 whitespace-nowrap"
            >
              Beranda
            </Link>

            {featuredCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`} 
                className="text-sm font-bold uppercase text-gray-600 hover:text-red-600 transition whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          <div className="pl-4 border-l border-gray-300 ml-2">
            <MobileNav categories={categoryList} />
          </div>
        </div>
      </div>
    </header>
  );
}
