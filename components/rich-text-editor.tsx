"use client";

import React, { useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { uploadEditorImage } from "@/server/upload-actions"; 


const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    return ({ forwardedRef, ...props }: any) => (
      <RQ ref={forwardedRef} {...props} />
    );
  },
  { ssr: false }
);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  // Kita butuh ref untuk mengakses instance Quill editor
  const quillRef = useRef<any>(null);

  // HANDLER KHUSUS IMAGE
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    // Ketika user memilih file
    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (!file) return;

      // Upload ke server (via Server Action)
      const formData = new FormData();
      formData.append("file", file);

      try {
        // Panggil server action yang kita buat di langkah 1
        const url = await uploadEditorImage(formData);

        // Masukkan URL gambar ke dalam Editor
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection();
        // Insert embed image di posisi kursor
        editor.insertEmbed(range.index, "image", url);
        // Pindahkan kursor ke sebelah kanan gambar
        editor.setSelection(range.index + 1);
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Gagal mengupload gambar. Silakan coba lagi.");
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "link",
    "image",
  ];

  return (
    <div className="bg-white">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        className="h-96 mb-12" 
      />
    </div>
  );
}
