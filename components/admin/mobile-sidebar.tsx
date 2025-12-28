"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AdminSidebar } from "./sidebar";

export function AdminMobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu className="h-6 w-6 text-gray-700" />
      </SheetTrigger>
      {/* side="left" agar muncul dari kiri seperti dashboard pada umumnya */}
      <SheetContent side="left" className="p-0 bg-white w-72">
        {/* Class 'sr-only' menyembunyikan teks dari mata user, tapi tetap terbaca oleh kode/browser */}
        <SheetTitle className="sr-only">
            Menu Navigasi Admin
        </SheetTitle>
        <AdminSidebar />
      </SheetContent>
    </Sheet>
  );
}