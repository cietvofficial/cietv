'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect } from "react"; 
import { useRouter } from "next/navigation";

interface CategoryFormProps {
  actionHandler: (prevState: any, formData: FormData) => Promise<any>;
  initialData?: { name: string };
  buttonLabel: string;
}

export default function CategoryForm({ actionHandler, initialData, buttonLabel }: CategoryFormProps) {
  const router = useRouter();
  
  const [state, action, isPending] = useActionState(actionHandler, null);

  useEffect(() => {
    if (state?.success) {
      router.push('/admin/categories');
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={action} className="space-y-6 border p-6 rounded-lg shadow-sm bg-white">
      <div className="grid gap-2">
        <Label htmlFor="name">Nama Kategori</Label>
        <Input 
          id="name" 
          name="name" 
          required 
          defaultValue={initialData?.name || ''} 
          placeholder="Contoh: Olahraga"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Menyimpan..." : buttonLabel}
        </Button>
      </div>
    </form>
  );
}