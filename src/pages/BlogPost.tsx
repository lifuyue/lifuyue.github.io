import { MDXProvider } from '@mdx-js/react';
import { Navigate, useParams } from 'react-router-dom';
import { mdxComponents } from '@/components/blog/MdxComponents';
import { getPostBySlug } from '@/lib/mdx';
import { formatDate } from '@/lib/utils';

export function BlogPost() {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <article className="section-shell section-space">
      <div
        className="mb-10 h-[36vh] min-h-[280px] overflow-hidden rounded-[1rem]"
        style={{ backgroundImage: post.coverImage }}
      />
      <div className="mx-auto max-w-4xl">
        <p className="text-xs uppercase tracking-[0.35em] text-foreground/45">{formatDate(post.date)}</p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-foreground sm:text-6xl">
          {post.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/70">{post.description}</p>
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
        <div className="prose mt-12 max-w-none dark:prose-invert">
          <MDXProvider components={mdxComponents}>
            <post.Content />
          </MDXProvider>
        </div>
      </div>
    </article>
  );
}
