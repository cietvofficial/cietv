"use client";

import { usePathname } from "next/navigation";

export function FooterWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Kondisi: Jika URL dimulai dengan "/admin", jangan tampilkan apa-apa (return null)
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Jika bukan halaman admin, tampilkan Footer (children)
  return <>{children}</>;
}
