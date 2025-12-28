"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export function MobileNav({ categories }: { categories: Category[] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-gray-100">
          <Menu className="h-6 w-6 text-gray-800" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="bg-white text-gray-900 border-l border-gray-200 w-[300px] overflow-y-auto"
      >
        <SheetHeader className="border-b pb-4 mb-4">
          <div className="flex items-center justify-center">
            <Image
              src="/logo_cietv.png"
              alt="Logo"
              width={100}
              height={40}
              className="object-contain"
            />
          </div>
          <SheetTitle className="text-center text-sm font-bold uppercase text-gray-600">
            Menu Navigasi
          </SheetTitle>
          <SheetDescription className="sr-only">
            Pilih kategori berita yang ingin Anda baca.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
              Kategori Berita
            </h3>

            <Link
              href="/"
              className="block px-2 py-2text-lg font-medium hover:bg-gray-50 hover:text-red-600 rounded-md transition"
            >
              Beranda
            </Link>

            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="block px-2 py-2 text-lg font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded-md transition"
              >
                {cat.name}
              </Link>
            ))}
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
}
