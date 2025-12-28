"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner"; 

export function PostToastListener() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const hasShownToast = useRef(false);

  useEffect(() => {
    const success = searchParams.get("success");

    if (success && !hasShownToast.current) {
      if (success === "created") {
        toast.success("Berita berhasil dibuat!");
      } else if (success === "updated") {
        toast.success("Berita berhasil diperbarui!");
      } else if (success === "deleted") {
        toast.success("Berita berhasil dihapus!");
      }

      hasShownToast.current = true;

      const params = new URLSearchParams(searchParams.toString());
      params.delete("success");
      
      // Ganti URL saat ini dengan URL yang sudah bersih
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, router]);

  return null; 
}