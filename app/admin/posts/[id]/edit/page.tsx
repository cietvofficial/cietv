import { updatePostAction } from "@/server/post-actions";
import PostForm from "@/components/admin/post-form"; 
import { db } from "@/db/drizzle";
import { posts, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (isNaN(id)) return notFound();

  // Ambil Data Postingan
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, id),
  });

  // Ambil Kategori
  const categoryList = await db.select().from(categories);

  if (!post) return notFound();

  // Bind ID ke Action
  const updateActionWithId = updatePostAction.bind(null, post.id);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Edit Berita</h1>
      
      <PostForm
        actionHandler={updateActionWithId}
        categories={categoryList}
        initialData={post}
        buttonLabel="Update Berita"
      />
    </div>
  );
}