import Link from "next/link";
import Image from "next/image";
// import { Button } from "./ui/button"; // Tidak dibutuhkan lagi karena tombol login dihapus
import { Search } from "lucide-react"; // Bell dihapus dari import
import { db } from "@/db/drizzle";
import { categories } from "@/db/schema";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";
import { SearchInput } from "./search-input";

export async function Navbar() {
  // Ambil data kategori dari database (Server Side)
  const categoryList = await db.select().from(categories);

  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* --- BAGIAN KIRI: LOGO & MOBILE MENU --- */}
        <div className="flex items-center gap-4">
          <MobileNav categories={categoryList} />

          <Link href="/" className="flex items-center">
            <Image
              src="/cietv.jpeg"
              alt="CIETV Logo"
              width={120}
              height={50}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* --- BAGIAN TENGAH: NAVIGATION (DESKTOP) --- */}
        <NavLinks categories={categoryList} />

        {/* ACTIONS: SEARCH */}
        <div className="flex items-center">
          {/* Panggil Component Search Input di sini */}
          <SearchInput />
        </div>
      </div>
    </header>
  );
}
