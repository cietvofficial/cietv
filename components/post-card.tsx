import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge"; 

interface PostCardProps {
  post: {
    title: string;
    slug: string;
    imageUrl: string | null;
    createdAt: Date | null;
    category: { name: string } | null; // Relasi kategori
    author: string | null;
  };
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/berita/${post.slug}`} className="group flex flex-col gap-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-gray-500">
            {post.category && (
                <Badge variant="secondary" className="text-xs font-normal">
                    {post.category.name}
                </Badge>
            )}
            <span>• {formatDate(post.createdAt)}</span>
        </div>
        
        <h3 className="line-clamp-2 text-xl font-bold leading-tight text-gray-900 group-hover:text-blue-600 group-hover:underline decoration-blue-600/30 underline-offset-4 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-sm text-gray-500">
            Oleh <span className="font-medium text-gray-700">{post.author || "Redaksi"}</span>
        </p>
      </div>
    </Link>
  );
}