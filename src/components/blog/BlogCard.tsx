import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { BlogPostEntry } from '@/types/blog';
import { formatDate } from '@/lib/utils';

interface BlogCardProps {
  post: BlogPostEntry;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <motion.article layout className="group h-full">
      <Link
        to={`/blog/${post.slug}`}
        className="glass-panel flex h-full flex-col overflow-hidden rounded-[2rem]"
      >
        <div
          className="h-56 border-b border-line/10 transition-transform duration-500 group-hover:scale-[1.03]"
          style={{
            backgroundImage: post.coverImage,
          }}
        />
        <div className="flex flex-1 flex-col p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-foreground/45">
            {formatDate(post.date)}
          </p>
          <h3 className="mt-4 font-display text-3xl text-foreground">{post.title}</h3>
          <p className="mt-4 flex-1 text-sm leading-7 text-foreground/70">{post.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line/10 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-foreground/80"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
