'use client';

import { updatePostAction } from "@/server/post-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useActionState } from "react";
import { useRouter } from "next/navigation";

export default function EditPostForm({ post }: { post: any }) {
  const router = useRouter();

  // Kita gunakan .bind untuk mengikat ID postingan ke server action
  // Jadi server action tau postingan mana yang mau diedit
  const updateActionWithId = updatePostAction.bind(null, post.id);

  const [state, action, isPending] = useActionState(async (prev: any, formData: FormData) => {
    const res = await updateActionWithId(prev, formData);
    return res;
  }, null);

  // Redirect jika sukses
  if (state?.success) {
     router.push('/admin/posts');
  }

  return (
    <form action={action} className="space-y-6 border p-6 rounded-lg shadow-sm bg-white">
      <div className="grid gap-2">
        <Label htmlFor="title">Judul Berita</Label>
        <Input 
            id="title" 
            name="title" 
            required 
            defaultValue={post.title} 
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="imageUrl">URL Gambar</Label>
        <Input 
            id="imageUrl" 
            name="imageUrl" 
            defaultValue={post.imageUrl || ''} 
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="content">Isi Berita</Label>
        <Textarea 
            id="content" 
            name="content" 
            className="min-h-[200px]" 
            required 
            defaultValue={post.content} 
        />
      </div>

      <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
          <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan Perubahan..." : "Update Berita"}
          </Button>
      </div>
    </form>
  );
}