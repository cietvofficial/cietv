"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deletePost } from "@/server/post-actions"; 
import { toast } from "sonner";

interface DeletePostButtonProps {
  id: number;
  title: string;
}

export function DeletePostButton({ id, title }: DeletePostButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        // Panggil Server Action
        const result = await deletePost(id);

        if (result?.success) {
          // SUCCESS: Munculkan Toast LANGSUNG disini (Client Side)
          toast.success("Berita berhasil dihapus!");
          setOpen(false);
        } else {
          // 3. ERROR
          toast.error("Gagal menghapus berita.");
        }
      } catch (error) {
        toast.error("Terjadi kesalahan sistem.");
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Berita{" "}
            <strong>"{title}"</strong> akan dihapus permanen dari database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault(); // Mencegah dialog tertutup otomatis sebelum proses selesai
              handleDelete();
            }}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            disabled={isPending}
          >
            {isPending ? "Menghapus..." : "Ya, Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
