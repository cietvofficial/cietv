'use client';

import { createCategoryAction } from "@/server/category-actions";
import CategoryForm from "@/components/admin/category-form";

export default function CreateCategoryPage() {
  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Tambah Kategori Baru</h1>
      
      <CategoryForm 
        actionHandler={createCategoryAction} 
        buttonLabel="Simpan Kategori" 
      />
    </div>
  );
}