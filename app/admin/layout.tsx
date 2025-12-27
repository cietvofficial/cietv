import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full relative">
      
      {/* SIDEBAR (Desktop) */}
      <div className="hidden h-full md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-[80] bg-white">
        <AdminSidebar />
      </div>

      {/* MAIN CONTENT */}
      <main className="md:pl-64 h-full bg-gray-50">
        {/* Tips: bg-gray-50 di sini memberikan efek kontras 
            antara konten utama (abu muda) dengan sidebar (putih) 
        */}
        <div className="h-full p-8">
            {children}
        </div>
      </main>
      
    </div>
  );
}