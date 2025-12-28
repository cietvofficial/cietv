"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavLinks({ categories }: { categories: any[] }) {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 overflow-x-auto no-scrollbar">
      {/* Link Home */}
      <Link
        href="/"
        className={cn(
          "transition whitespace-nowrap",
          pathname === "/"
            ? "text-red-600 font-bold"
            : "text-black hover:text-red-600"
        )}
      >
        Home
      </Link>

      {/* Link Kategori Dinamis */}
      {categories.map((cat) => {
        const linkHref = `/category/${cat.slug}`;
        const isActive = pathname === linkHref;

        return (
          <Link
            key={cat.id}
            href={linkHref}
            className={cn(
              "transition whitespace-nowrap capitalize",
              isActive ? "text-red-600 font-bold" : "hover:text-red-600"
            )}
          >
            {cat.name}
          </Link>
        );
      })}
    </nav>
  );
}
