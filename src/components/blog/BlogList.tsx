import type { BlogPostEntry } from '@/types/blog';
import { BlogCard } from '@/components/blog/BlogCard';

interface BlogListProps {
  posts: BlogPostEntry[];
}

export function BlogList({ posts }: BlogListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
