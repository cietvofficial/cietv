import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminMobileSidebar } from "@/components/admin/mobile-sidebar"; 

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full relative bg-gray-50">
      
      {/* === TOP BAR KHUSUS MOBILE === */}
      {/* Hanya muncul di md:hidden (Layar kecil) */}
      <div className="md:hidden h-[60px] fixed top-0 w-full z-50 bg-white border-b border-gray-200 flex items-center px-4 shadow-sm">
        <AdminMobileSidebar />
        <span className="font-bold text-gray-700 ml-2">Admin Panel</span>
      </div>

      {/* === SIDEBAR TETAP (DESKTOP) === */}
      {/* Hidden di mobile, muncul di md:flex */}
      <div className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-50">
        <AdminSidebar />
      </div>

      {/* === KONTEN UTAMA === */}
      <main className="md:pl-64 pt-[60px] md:pt-0 h-full">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {children}
        </div>
      </main>
      
    </div>
  );
}