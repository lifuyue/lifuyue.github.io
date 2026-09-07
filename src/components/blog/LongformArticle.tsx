import { MDXProvider } from '@mdx-js/react';
import { motion, useReducedMotion, useScroll } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { mdxComponents } from '@/components/blog/MdxComponents';
import { formatDate } from '@/lib/utils';
import type { BlogPostEntry } from '@/types/blog';

type Chapter = { id: string; title: string };

export function LongformArticle({ post }: { post: BlogPostEntry }) {
  const articleRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const mobileContents = useRef<HTMLDetailsElement>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [active, setActive] = useState('');
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: articleRef, offset: ['start start', 'end end'] });

  useEffect(() => {
    const headings = Array.from(bodyRef.current?.querySelectorAll<HTMLHeadingElement>('h2[id]') ?? []);
    setChapters(headings.map((heading) => ({ id: heading.id, title: (heading.textContent ?? '').replace(/^[一二三四五六七八九十]+、/, '') })));
    let frame = 0;
    const update = () => {
      frame = 0;
      const current = headings.filter((heading) => heading.getBoundingClientRect().top <= 180).slice(-1)[0];
      setActive(current?.id ?? '');
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, [post.slug]);

  const contents = <ol>{chapters.map((chapter, index) => <li key={chapter.id}>
    <a href={`#${chapter.id}`} aria-current={active === chapter.id ? 'location' : undefined} onClick={() => {
      if (mobileContents.current) mobileContents.current.open = false;
    }}><span>{String(index + 1).padStart(2, '0')}</span><span>{chapter.title}</span></a>
  </li>)}</ol>;

  return <article ref={articleRef} className="article-reader">
    <motion.div className="reader-progress" aria-hidden="true" style={{ scaleX: scrollYProgress, transition: reduced ? 'none' : undefined }} />
    <header className="interior-shell reader-header">
      <div className="interior-kicker"><Link to="/blog">← Journal</Link><span>{post.kind === 'series' ? `Longform / ${post.issue ?? '01'}` : 'Project notes'}</span></div>
      <div className="reader-title-row"><h1>{post.title}</h1><span aria-hidden="true">↘</span></div>
      {post.subtitle && <p className="reader-subtitle">{post.subtitle}</p>}
      <div className="reader-summary"><p>{post.description}</p><dl><div><dt>Published</dt><dd>{formatDate(post.date)}</dd></div>{post.readTime && <div><dt>Reading time</dt><dd>{post.readTime}</dd></div>}</dl></div>
      <div className="reader-byline"><span>By Lifuyue</span><div>{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><a href="#article-body">开始阅读 ↓</a></div>
    </header>
    {chapters.length > 0 && <details className="reader-mobile-contents interior-shell" ref={mobileContents}><summary>文章目录 <span>{String(chapters.length).padStart(2, '0')} chapters ＋</span></summary><nav aria-label="移动端文章章节">{contents}</nav></details>}
    <div className="interior-shell reader-layout">
      <aside className="reader-sidebar"><div><p className="index-label">On this page</p><nav aria-label="文章章节">{contents}</nav><Link to="/blog" className="reader-back">← 返回全部文章</Link></div></aside>
      <div ref={bodyRef} id="article-body" className="reader-prose prose max-w-none"><MDXProvider components={mdxComponents}><post.Content /></MDXProvider></div>
    </div>
    <footer className="interior-shell reader-ending"><span className="index-label">End note / Thanks for reading</span><Link to="/blog"><span>感谢阅读。<small>回到 Journal，继续探索。</small></span><span aria-hidden="true">↗</span></Link></footer>
  </article>;
}
