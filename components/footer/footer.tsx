import Link from "next/link";
import Image from "next/image";
import { db } from "@/db/drizzle";
import { categories } from "@/db/schema";
import { Instagram, Twitter, Youtube } from "lucide-react";

export async function Footer() {
  // Ambil data kategori dari database secara dinamis
  const categoryList = await db.select().from(categories);

  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* BAGIAN KIRI: LOGO & SOSMED */}
          <div className="flex flex-col space-y-4 max-w-xs">
            <Link href="/">
              <Image
                src="/logo_cietv.png"
                alt="CIE TV Logo"
                width={160}
                height={50}
                className="h-15 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-gray-500">
              Menyajikan berita terkini, akurat, dan terpercaya untuk Anda
              setiap hari.
            </p>

            {/* Social Media Icons (Hiasan) */}
            <div className="flex gap-4 pt-2">
              <Link
                href="https://www.tiktok.com/@cietvutm?_r=1&_t=ZS-9250Ac7EuhA"
                className="text-gray-400 hover:text-black transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </Link>
              <Link
                href="https://www.instagram.com/cietelevisi?igsh=bW9pcW02ajIxOHF0"
                className="text-gray-400 hover:text-pink-600 transition"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="https://youtube.com/@CIEtelevisi?si=XdX990aZa1YDArJE"
                className="text-gray-400 hover:text-red-600 transition"
              >
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* BAGIAN KANAN: KATEGORI (GRID) */}
          <div className="flex-1 md:text-right">
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider">
              Kategori Berita
            </h3>
            {/* Grid layout: 2 kolom di HP, 3-4 kolom di Desktop agar rapi */}
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-3">
              {categoryList.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm text-gray-600 hover:text-red-600 hover:underline transition"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* COPYRIGHT BOTTOM */}
        <div className="border-t border-gray-100 mt-10 pt-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} CIE TV. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
