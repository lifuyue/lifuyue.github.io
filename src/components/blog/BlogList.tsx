import type { BlogPostEntry } from '@/types/blog';
import { BlogCard } from '@/components/blog/BlogCard';

export function BlogList({ posts }: { posts: BlogPostEntry[] }) {
  return <div className="journal-entry-list">{posts.map((post) => <BlogCard key={post.slug} post={post} />)}</div>;
}
