"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function FlashMessage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const success = searchParams.get("success");

    if (success) {
      // 1. Tampilkan pesan sesuai value
      if (success === "created") toast.success("Berita berhasil diterbitkan!");
      if (success === "updated") toast.success("Berita berhasil diperbarui!");
      if (success === "deleted") toast.success("Berita berhasil dihapus!");

      // 2. Bersihkan URL agar toast tidak muncul lagi saat refresh
      const params = new URLSearchParams(searchParams.toString());
      params.delete("success");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, router, pathname]);

  return null; 
}
