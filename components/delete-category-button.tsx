"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import { deleteCategoryAction } from "@/server/category-actions";

export function DeleteCategoryButton({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  const [open, setOpen] = useState(false);

  const handleDelete = async (formData: FormData) => {
    await deleteCategoryAction(formData);
    setOpen(false);
    toast.success(`Kategori "${name}" berhasil dihapus.`);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus kategori <strong>"{name}"</strong>
            ? Tindakan ini tidak bisa dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form action={handleDelete}>
          <input type="hidden" name="id" value={id} />

          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              Hapus
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
