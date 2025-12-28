"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  className?: string;
}

export function SearchInput({ className }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mengambil query yang ada di URL (jika user refresh halaman search)
  const currentQuery = searchParams.get("q");

  const [value, setValue] = useState(currentQuery || "");

  // Update state jika URL berubah (opsional, untuk sinkronisasi)
  useEffect(() => {
    setValue(currentQuery || "");
  }, [currentQuery]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Jika input kosong, jangan lakukan apa-apa
    if (!value.trim()) return;

    router.push(`/search?q=${encodeURIComponent(value)}`);
  };

  return (
    <form onSubmit={onSearch} className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Cari tokoh, topik atau peristiwa..."
        className={cn(
          "pl-10 w-full focus-visible:ring-blue-600 focus-visible:ring-offset-0",
          className
        )}
      />
    </form>
  );
}
