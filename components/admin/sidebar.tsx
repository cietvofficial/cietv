"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Newspaper, 
  List, 
  Settings, 
  LogOut, 
  Globe 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/server/auth-actions";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    label: "Kelola Berita",
    icon: Newspaper,
    href: "/admin/posts",
  },
  {
    label: "Kategori",
    icon: List,
    href: "/admin/categories",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-white border-r border-gray-200 text-gray-900 shadow-sm">
      
      {/* HEADER LOGO */}
      <div className="px-6 py-2">
        <Link href="/admin" className="flex items-center gap-2">
          <Image 
            src="/logo_cietv.png" 
            alt="Logo" 
            width={100} 
            height={40} 
            className="object-contain" // Pastikan logo tidak gepeng
          />
          {/* Badge Admin */}
          <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full border border-gray-200">
            ADMIN
          </span>
        </Link>
      </div>

      {/* NAVIGATION LINKS */}
      <div className="px-3 py-2 flex-1">
        <div className="space-y-1">
          {routes.map((route) => {
            const isActive = pathname === route.href;

            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-gray-100 rounded-lg transition",
                  isActive 
                    ? "bg-blue-50 text-blue-700 font-semibold" // Style jika Aktif
                    : "text-gray-600" // Style jika Tidak Aktif
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn("h-5 w-5 mr-3", isActive ? "text-blue-700" : "text-gray-500")} />
                  {route.label}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-2">
        
        {/* Tombol Lihat Website (Preview) */}
        <Link href="/" target="_blank">
            <Button variant="outline" className="w-full justify-start text-gray-600 border-gray-200 hover:bg-gray-50">
                <Globe className="h-4 w-4 mr-2" />
                Lihat Website
            </Button>
        </Link>

        {/* Tombol Logout */}
        <form action={logoutAction} > 
            <Button 
                variant="ghost" 
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
                <LogOut className="h-4 w-4 mr-2" />
                Keluar
            </Button>
        </form>
      </div>
    </div>
  );
}