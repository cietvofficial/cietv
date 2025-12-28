import { db } from "@/db/drizzle";
import { categories } from "@/db/schema";
import { createPostAction } from "@/server/post-actions"; 
import PostForm from "@/components/admin/post-form"; 

export default async function CreatePostPage() {
  const categoryList = await db.select().from(categories);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PostForm
        actionHandler={createPostAction}
        categories={categoryList}
        buttonLabel="Publish Berita"
      />
    </div>
  );
}
