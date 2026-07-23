import { MDXProvider } from '@mdx-js/react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { headingToId, mdxComponents } from '@/components/blog/MdxComponents';
import { formatDate } from '@/lib/utils';
import type { BlogPostEntry } from '@/types/blog';

interface LongformArticleProps {
  post: BlogPostEntry;
}

function ChapterIndex({ chapters }: { chapters: string[] }) {
  return (
    <nav aria-label="文章章节" className="longform-chapter-index">
      <p className="text-[10px] uppercase tracking-[0.34em] text-foreground/40">Contents</p>
      <ol className="mt-6 space-y-3">
        {chapters.map((chapter, index) => {
          const title = chapter.replace(/^[一二三四五六七八九十]+、/, '');

          return (
            <li key={chapter}>
              <a
                href={`#${headingToId(chapter)}`}
                className="group grid grid-cols-[1.75rem_1fr] gap-2 text-xs leading-5 text-foreground/45 hover:text-foreground focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
              >
                <span className="font-display text-sm text-accent/55 group-hover:text-accent">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{title}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function LongformArticle({ post }: LongformArticleProps) {
  const articleRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ['start start', 'end end'],
  });
  const readingProgress = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 28,
    mass: 0.25,
  });
  const chapters = post.chapters ?? [];

  return (
    <article ref={articleRef} className="longform-article relative -mt-24">
      <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[70] h-[2px] bg-line/[0.06]">
        <motion.div
          style={{
            scaleX: readingProgress,
            transformOrigin: '0% 50%',
            transition: prefersReducedMotion ? 'none' : undefined,
          }}
          className="h-full w-full bg-gradient-to-r from-accent via-accentSoft to-teal"
        />
      </div>

      <header className="longform-hero relative flex min-h-[100svh] overflow-hidden border-b border-line/[0.08]">
        <div aria-hidden="true" className="longform-hero-field absolute inset-0" />
        <div aria-hidden="true" className="cinematic-grid absolute inset-0 opacity-45" />
        <div aria-hidden="true" className="longform-hero-folio">
          {post.issue ?? '01'}
        </div>
        <div aria-hidden="true" className="longform-hero-orbit" />
        <div aria-hidden="true" className="longform-hero-rule" />

        <div className="section-shell relative z-10 flex flex-1 flex-col pb-10 pt-32 sm:pb-14 sm:pt-40 lg:pb-16">
          <div className="flex items-center justify-between gap-5 border-b border-line/10 pb-5 text-[10px] uppercase tracking-[0.34em] text-foreground/50">
            <Link
              to="/blog"
              className="hover:text-foreground focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
            >
              ← Journal
            </Link>
            <span className="text-right">
              不定期更新 · ISSUE {post.issue ?? '01'}
            </span>
          </div>

          <div className="grid flex-1 items-center py-14 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">
            <div className="max-w-5xl">
              <p className="text-[11px] uppercase tracking-[0.46em] text-accent">
                An ongoing field note
              </p>
              <h1 className="mt-7 max-w-5xl font-display text-[clamp(3.9rem,10vw,9.5rem)] leading-[0.82] tracking-[-0.055em] text-foreground">
                {post.title}
              </h1>
              {post.subtitle ? (
                <p className="mt-7 font-display text-[clamp(1.45rem,2.8vw,2.5rem)] leading-tight text-foreground/62">
                  {post.subtitle}
                </p>
              ) : null}
            </div>

            <div className="mt-12 border-l border-line/15 pl-6 lg:mt-0">
              <p className="text-sm leading-7 text-foreground/66">{post.description}</p>
              <dl className="mt-8 grid grid-cols-2 gap-5 border-t border-line/10 pt-6 lg:grid-cols-1">
                <div>
                  <dt className="text-[9px] uppercase tracking-[0.28em] text-foreground/35">Published</dt>
                  <dd className="mt-2 text-xs text-foreground/70">{formatDate(post.date)}</dd>
                </div>
                <div>
                  <dt className="text-[9px] uppercase tracking-[0.28em] text-foreground/35">Reading time</dt>
                  <dd className="mt-2 text-xs text-foreground/70">{post.readTime ?? '长文'}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="flex items-end justify-between gap-6 border-t border-line/10 pt-5">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[9px] uppercase tracking-[0.24em] text-foreground/40">
              {post.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <span className="shrink-0 text-[9px] uppercase tracking-[0.3em] text-foreground/35">
              Scroll to read ↓
            </span>
          </div>
        </div>
      </header>

      {chapters.length > 0 ? (
        <div className="hide-scrollbar border-b border-line/[0.08] px-5 py-5 xl:hidden">
          <nav
            aria-label="移动端文章章节"
            className="mx-auto flex max-w-4xl snap-x gap-3 overflow-x-auto"
          >
            {chapters.map((chapter, index) => (
              <a
                key={chapter}
                href={`#${headingToId(chapter)}`}
                className="shrink-0 snap-start rounded-full border border-line/10 px-4 py-2 text-[10px] tracking-[0.12em] text-foreground/55 hover:border-accent/35 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
              >
                {String(index + 1).padStart(2, '0')} ·{' '}
                {chapter.replace(/^[一二三四五六七八九十]+、/, '')}
              </a>
            ))}
          </nav>
        </div>
      ) : null}

      <div className="longform-reading-shell section-shell">
        <aside className="hidden xl:block">
          <div className="sticky top-32 py-24">
            <ChapterIndex chapters={chapters} />
          </div>
        </aside>

        <div className="longform-prose prose max-w-none py-20 sm:py-28 lg:py-36">
          <MDXProvider components={mdxComponents}>
            <post.Content />
          </MDXProvider>
        </div>

        <aside aria-hidden="true" className="hidden lg:block">
          <div className="sticky top-32 py-24">
            <div className="border-l border-line/10 pl-5">
              <p className="font-display text-5xl text-foreground/[0.1]">{post.issue ?? '01'}</p>
              <p className="mt-4 text-[9px] uppercase leading-5 tracking-[0.3em] text-foreground/30">
                LONGFORM
              </p>
              <div className="mt-8 h-24 w-px bg-gradient-to-b from-accent/65 to-transparent" />
            </div>
          </div>
        </aside>
      </div>

      <footer className="section-shell pb-24 sm:pb-32">
        <div className="longform-end-panel relative overflow-hidden rounded-[2rem] border border-line/10 px-7 py-10 sm:px-10 sm:py-12">
          <div aria-hidden="true" className="absolute -right-4 -top-12 font-display text-[10rem] leading-none text-foreground/[0.035]">
            完
          </div>
          <p className="text-[10px] uppercase tracking-[0.36em] text-accent/80">End note</p>
          <h2 className="mt-5 max-w-2xl font-display text-4xl leading-tight text-foreground sm:text-5xl">
            代码会越来越便宜，判断不会。
          </h2>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/blog"
              className="rounded-full border border-line/15 bg-line/[0.04] px-5 py-3 text-xs uppercase tracking-[0.22em] text-foreground/78 hover:border-accent/45 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
            >
              返回 Blog
            </Link>
            <span className="text-xs text-foreground/38">下一篇，会在有新判断时出现。</span>
          </div>
        </div>
      </footer>
    </article>
  );
}
