"use client";

import { useState, useEffect, useActionState } from "react"; 
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { createCategoryAction } from "@/server/category-actions";
import { toast } from "sonner";

const initialState = {
  success: false,
  error: "",
};

export function CreateCategoryModal() {
  const [open, setOpen] = useState(false);

  const [state, formAction, isPending] = useActionState(
    createCategoryAction,
    initialState
  );

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
      toast.success("Kategori berhasil dibuat!"); 
    }
    if (state?.error) {
      toast.error(state.error); 
    }
  }, [state?.success, state?.error]); 

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
    }
  }, [state?.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto bg-red-600 hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" /> Tambah Kategori
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Tambah Kategori Baru</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Kategori</Label>
              <Input
                id="name"
                name="name"
                placeholder="Misal: Politik..."
                required
              />
            </div>
            {state?.error && (
              <p className="text-sm text-red-500">{state.error}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
