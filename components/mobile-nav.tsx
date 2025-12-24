"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Tambah ini
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils"; // Tambah ini

export function MobileNav({ categories }: { categories: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Ambil URL aktif

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-b shadow-lg p-4 flex flex-col gap-4 z-50">
          {/* Link Home */}
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={cn(
              "block py-2",
              pathname === "/" ? "font-bold text-red-600" : "font-medium"
            )}
          >
            Beranda
          </Link>

          {/* Loop Kategori */}
          {categories.map((cat) => {
            const linkHref = `/category/${cat.slug}`;
            const isActive = pathname === linkHref;

            return (
              <Link
                key={cat.id}
                href={linkHref}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block py-2 capitalize",
                  isActive
                    ? "font-bold text-red-600"
                    : "text-gray-600 hover:text-red-600"
                )}
              >
                {cat.name}
              </Link>
            );
          })}

          <hr />
          {/* <Link href="/admin/posts" className="text-red-600 font-medium pt-2">
            Login Admin
          </Link> */}
        </div>
      )}
    </div>
  );
}
