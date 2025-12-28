"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import RichTextEditor from "../rich-text-editor";
import { Save, Send } from "lucide-react";

interface PostFormProps {
  actionHandler: (prevState: any, formData: FormData) => Promise<any>;
  categories: { id: number; name: string }[];
  initialData?: any;
  buttonLabel: string;
}

export default function PostForm({
  actionHandler,
  categories,
  initialData,
  buttonLabel,
}: PostFormProps) {
  const router = useRouter();
  const [state, action, isPending] = useActionState(actionHandler, null);
  const [content, setContent] = useState(initialData?.content || "");

  // State untuk preview gambar
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.imageUrl || null
  );

  // Handler file tetap sama sesuai kodemu
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <form
      action={action}
      className="max-w-4xl mx-auto bg-white border rounded-xl shadow-sm overflow-hidden"
    >
      <div className="p-6 md:p-8 space-y-8">
        {/* --- JUDUL BERITA --- */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-base font-semibold">
            Judul Berita
          </Label>
          <Input
            id="title"
            name="title"
            required
            defaultValue={initialData?.title || ""}
            placeholder="Masukkan judul berita utama..."
            className="text-lg py-5"
          />
        </div>

        {/* --- GRID: KATEGORI & AUTHOR (2 Kolom) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kategori */}
          <div className="space-y-2">
            <Label>Kategori</Label>
            <Select
              name="categoryId"
              defaultValue={initialData?.categoryId?.toString()}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Author */}
          <div className="space-y-2">
            <Label htmlFor="author">Penulis</Label>
            <Input
              id="author"
              name="author"
              defaultValue={initialData?.author || "CIETV Team"}
              placeholder="Nama penulis..."
            />
          </div>
        </div>

        {/* --- IMAGE UPLOAD --- */}
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Label htmlFor="image" className="font-semibold">
            Gambar Thumbnail
          </Label>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Input Wrapper */}
            <div className="w-full md:w-1/2 space-y-2">
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer bg-white"
              />
              <p className="text-xs text-muted-foreground">
                Format: JPG, PNG, WEBP. Maksimal ukuran 2MB.
              </p>
            </div>

            {/* Preview Wrapper */}
            {previewUrl ? (
              <div className="relative w-full md:w-1/2 h-48 rounded-md overflow-hidden border shadow-sm">
                <Image
                  src={previewUrl}
                  alt="Preview Thumbnail"
                  fill
                  className="object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>
            ) : (
              <div className="hidden md:flex items-center justify-center w-1/2 h-20 bg-gray-100 rounded text-gray-400 text-sm border">
                Belum ada gambar
              </div>
            )}
          </div>
        </div>

        {/* --- RICH TEXT EDITOR --- */}
        <div className="space-y-3">
          <Label className="font-semibold">Konten Berita</Label>
          <div className="border rounded-md min-h-[300px]">
            {/* Component Editor Visual */}
            <RichTextEditor value={content} onChange={setContent} />
          </div>

          {/* Input Hidden Wajib untuk Server Action */}
          <input type="hidden" name="content" value={content} />
        </div>

        {/* Error Message */}
        {state?.error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
            ⚠️ {state.error}
          </div>
        )}
      </div>

      {/* --- TOMBOL AKSI (FOOTER) --- */}
      <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse md:flex-row md:justify-between gap-4 pt-6 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          Status saat ini:{" "}
          <span
            className={`font-semibold ${
              initialData?.published ? "text-green-600" : "text-orange-500"
            }`}
          >
            {initialData
              ? initialData.published
                ? "Terbit"
                : "Draft"
              : "Baru"}
          </span>
        </div>

        <div className="flex gap-3">
          {/* TOMBOL SAVE DRAFT */}
          <Button
            type="submit"
            name="submitAction"
            value="draft"
            variant="outline"
            disabled={isPending}
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            <Save className="w-4 h-4 mr-2" />
            Simpan Draft
          </Button>

          {/* TOMBOL PUBLISH */}
          <Button
            type="submit"
            name="submitAction"
            value="publish"
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isPending ? (
              "Memproses..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {initialData?.published
                  ? "Update"
                  : "Publish"}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
