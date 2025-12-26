"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils"; // Pastikan punya utils cn, atau hapus dan pakai string biasa

interface SortableHeaderProps {
  label: string;
  value: string; // Nama kolom untuk URL (misal: "title", "date")
  className?: string;
}

export const SortableHeader = ({
  label,
  value,
  className,
}: SortableHeaderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSortCol = searchParams.get("sortCol");
  const currentSortOrder = searchParams.get("sortOrder");

  const isActive = currentSortCol === value;

  const handleSort = () => {
    const params = new URLSearchParams(searchParams.toString());

    let newOrder = "asc";
    if (isActive && currentSortOrder === "asc") {
      newOrder = "desc";
    }

    params.set("sortCol", value);
    params.set("sortOrder", newOrder);

    router.push(`?${params.toString()}`);
  };

  return (
    <div
      onClick={handleSort}
      className={cn(
        "flex items-center gap-1 cursor-pointer hover:text-gray-900 group select-none",
        className
      )}
    >
      {label}
      <span className="text-gray-400 group-hover:text-gray-600">
        {!isActive && <ArrowUpDown className="h-3 w-3" />}
        {isActive && currentSortOrder === "asc" && (
          <ArrowUp className="h-3 w-3 text-red-600" />
        )}
        {isActive && currentSortOrder === "desc" && (
          <ArrowDown className="h-3 w-3 text-red-600" />
        )}
      </span>
    </div>
  );
};
