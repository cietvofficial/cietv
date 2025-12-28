'use client';

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LayoutDashboard, FileText, List, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/server/auth-actions";
import { useState } from "react";

const menuItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Berita / Posts", href: "/admin/posts", icon: FileText },
  { title: "Kategori", href: "/admin/categories", icon: List },
];

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-16 items-center border-b bg-gray-900 px-4 md:hidden text-white justify-between">
      <div className="font-bold tracking-wider">ADMIN CIETV</div>
      
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        
        {/* Menu yang muncul dari samping */}
        <SheetContent side="left" className="w-72 bg-gray-900 border-r-gray-800 p-0 text-white">
            <SheetTitle className="sr-only">Menu Admin</SheetTitle>
          <div className="flex h-16 items-center justify-center border-b border-gray-800">
            <h1 className="text-xl font-bold tracking-wider">MENU</h1>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)} // Tutup menu saat link diklik
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-gray-800 p-4">
            <form action={logoutAction}>
                <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-400 hover:bg-gray-800 hover:text-red-300">
                    <LogOut className="h-5 w-5" />
                    Keluar
                </button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}