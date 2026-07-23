import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { BlogPostEntry } from '@/types/blog';
import { formatDate } from '@/lib/utils';

interface FeaturedSeriesCardProps {
  post: BlogPostEntry;
}

export function FeaturedSeriesCard({ post }: FeaturedSeriesCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const seriesName = 'LONGFORM';
  const issueLabel = post.issue ?? 'ISSUE 01';
  const summary = post.subtitle ?? post.description;

  return (
    <motion.article
      initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="journal-feature-card group relative overflow-hidden rounded-[1.75rem] border border-line/10 bg-surface"
    >
      <Link
        to={`/blog/${post.slug}`}
        className="relative grid min-h-[34rem] min-w-0 overflow-hidden p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent sm:min-h-[38rem] sm:p-10 lg:min-h-[42rem] lg:grid-cols-12 lg:p-14"
        aria-label={`阅读主线文章：${post.title}`}
      >
        <div
          aria-hidden="true"
          className="journal-feature-cover absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
          style={{ backgroundImage: post.coverImage }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgb(var(--background)/0.08)_0%,rgb(var(--background)/0.32)_42%,rgb(var(--background)/0.94)_100%)] lg:bg-[linear-gradient(90deg,rgb(var(--background)/0.92)_0%,rgb(var(--background)/0.72)_54%,rgb(var(--background)/0.22)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-3 rounded-[1.2rem] border border-line/10 sm:inset-5 sm:rounded-[1.35rem]"
        />

        <div className="relative z-10 flex min-w-0 flex-col justify-between lg:col-span-9">
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-foreground/65 sm:text-xs sm:tracking-[0.34em]">
            <span className="text-accent">{seriesName}</span>
            <span aria-hidden="true" className="h-px w-8 bg-line/25" />
            <span>{issueLabel}</span>
            <span>{formatDate(post.date)}</span>
          </div>

          <div className="mt-20 min-w-0 sm:mt-24">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.38em] text-foreground/55 sm:text-xs">
              Featured long read
            </p>
            <h2 className="max-w-5xl break-words font-display text-[clamp(2.9rem,12vw,5.5rem)] leading-[0.92] tracking-[-0.045em] text-foreground [overflow-wrap:anywhere] lg:text-[clamp(4.75rem,7vw,7.25rem)]">
              {post.title}
            </h2>
            <p className="mt-7 max-w-2xl text-sm leading-7 text-foreground/70 sm:text-base sm:leading-8">
              {summary}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 text-[11px] uppercase tracking-[0.24em] text-foreground/65">
              {post.readTime ? <span>{post.readTime}</span> : null}
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-full border border-line/15 px-3 py-2">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-10 flex items-end justify-between lg:col-span-3 lg:mt-0 lg:justify-end">
          <span className="text-[10px] uppercase tracking-[0.32em] text-foreground/45 lg:hidden">
            Open journal
          </span>
          <span className="grid size-14 place-items-center rounded-full border border-line/25 text-2xl text-foreground transition-colors duration-300 group-hover:border-accent/60 group-hover:bg-accent group-hover:text-background sm:size-16">
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
