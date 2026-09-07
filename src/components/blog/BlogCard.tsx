import { SymbolIcon } from '@/components/ui/SymbolIcon';
import { Link } from 'react-router-dom';
import type { BlogPostEntry } from '@/types/blog';
import { formatDate } from '@/lib/utils';

export function BlogCard({ post }: { post: BlogPostEntry }) {
  return <article className="journal-entry"><Link to={`/blog/${post.slug}`}>
    <div className="entry-meta"><span>{post.kind === 'series' ? 'Longform' : 'Project notes'}</span><time dateTime={post.date}>{formatDate(post.date)}</time></div>
    <h3>{post.title}</h3><p>{post.description}</p><div className="entry-bottom"><div className="entry-tags">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><span className="entry-arrow" aria-hidden="true"><SymbolIcon name="arrow-up-right" /></span></div>
  </Link></article>;
}
