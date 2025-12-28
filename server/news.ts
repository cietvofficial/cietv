'use server'
import { db } from '@/db/drizzle';
import { posts } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  // Ambil data dari form
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const imageUrl = formData.get('imageUrl') as string; 
  
  //Simpan ke Database Neon via Drizzle`
  await db.insert(posts).values({
    title,
    slug: title.toLowerCase().replace(/\s+/g, '-'), 
    content,
    imageUrl,
    published: true,
  });

  revalidatePath('/');
  redirect('/');
}