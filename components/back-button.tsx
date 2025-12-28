"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function BackButton() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ambil parameter "from" dari URL
  const from = searchParams.get("from");

  // KONDISI 1: Jika datang dari Admin
  if (from === "admin") {
    return (
      <Link href="/admin/posts">
        <Button
          variant="ghost"
          className="gap-2 pl-0 hover:pl-2 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Admin
        </Button>
      </Link>
    );
  }

  // KONDISI 2: Jika user biasa (datang dari Home/Google/Kategori)
  // Kita gunakan router.back() agar dia kembali ke halaman persis sebelumnya
  return (
    <Button
      variant="ghost"
      className="gap-2 pl-0 hover:pl-2 transition-all"
      onClick={() => router.back()}
    >
      <ArrowLeft className="h-4 w-4" />
      Kembali
    </Button>
  );
}
