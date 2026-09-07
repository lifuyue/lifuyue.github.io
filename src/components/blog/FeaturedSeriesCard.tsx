import { Link } from 'react-router-dom';
import { WorkArtwork } from '@/components/sections/CinematicRail';
import { formatDate } from '@/lib/utils';
import type { BlogPostEntry } from '@/types/blog';

export function FeaturedSeriesCard({ post }: { post: BlogPostEntry }) {
  return <article className="journal-feature">
    <Link to={`/blog/${post.slug}`} aria-label={`阅读主线文章：${post.title}`}>
      <div className="journal-feature-art"><WorkArtwork kind="journal" /></div>
      <div className="journal-feature-text"><div className="entry-meta"><span>Featured / {post.issue ?? '01'}</span><span>{formatDate(post.date)}</span></div><h2>{post.title}</h2><p className="feature-subtitle">{post.subtitle}</p><p>{post.description}</p><div className="entry-tags">{post.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div><div className="feature-open"><span>{post.readTime ?? '阅读全文'}</span><span aria-hidden="true">↗</span></div></div>
    </Link>
  </article>;
}
