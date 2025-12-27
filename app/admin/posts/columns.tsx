"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { deletePost } from "@/server/post-actions";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

// Definisi Tipe Data untuk Tabel
// Kita perlu update tipe ini agar sesuai dengan hasil query yang baru (ada category)
export type Post = {
  id: number;
  title: string;
  slug: string;
  imageUrl: string | null;
  author: string | null;
  published: boolean | null;
  createdAt: Date | null;
  // Kategori adalah object karena hasil relasi, bisa null jika tidak dipilih
  category: {
    name: string;
  } | null;
};

export const columns: ColumnDef<Post>[] = [
  // --- KOLOM 1: GAMBAR ---
  {
    accessorKey: "imageUrl",
    header: "Gambar",
    cell: ({ row }) => {
      const url = row.getValue("imageUrl") as string;

      if (url) {
        return (
          <div className="relative h-10 w-16 overflow-hidden rounded-md border">
            <Image src={url} alt="Thumbnail" fill className="object-cover" />
          </div>
        );
      }
      return (
        <div className="flex h-10 w-16 items-center justify-center rounded-md border bg-gray-100 text-gray-400">
          <ImageIcon className="h-4 w-4" />
        </div>
      );
    },
  },

  // --- KOLOM 2: JUDUL ---
  {
    accessorKey: "title",
    header: "Judul Berita",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate font-medium">
        {row.getValue("title")}
      </div>
    ),
  },

  // --- KOLOM 3: KATEGORI ---
  {
    id: "category", // Kita pakai ID custom karena datanya nested
    header: "Kategori",
    cell: ({ row }) => {
      const category = row.original.category;

      if (!category) return <span className="text-gray-400 text-xs">-</span>;

      return (
        <Badge variant="secondary" className="font-normal">
          {category.name}
        </Badge>
      );
    },
  },

  // --- KOLOM 4: PENULIS ---
  {
    accessorKey: "author",
    header: "Penulis",
    cell: ({ row }) => (
      <div className="text-gray-600">{row.getValue("author") || "Admin"}</div>
    ),
  },

  // --- KOLOM 5: STATUS ---
  {
    accessorKey: "published",
    header: "Status",
    cell: ({ row }) => {
      const isPublished = row.getValue("published");
      return (
        <Badge
          variant={isPublished ? "default" : "outline"}
          className={isPublished ? "bg-green-600 hover:bg-green-700" : ""}
        >
          {isPublished ? "Terbit" : "Draft"}
        </Badge>
      );
    },
  },

  // --- KOLOM 6: AKSI (Edit/Delete) ---
  {
    id: "actions",
    cell: ({ row }) => {
      const post = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>

            <DropdownMenuItem asChild>
              <Link
                href={`/admin/posts/${post.id}/edit`}
                className="cursor-pointer flex items-center"
              >
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Link>
            </DropdownMenuItem>

            <form action={deletePost}>
              <input type="hidden" name="id" value={post.id} />
              <button type="submit" className="w-full">
                <DropdownMenuItem className="text-red-600 cursor-pointer">
                  <Trash className="mr-2 h-4 w-4" /> Hapus
                </DropdownMenuItem>
              </button>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
