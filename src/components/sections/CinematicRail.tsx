import { SymbolIcon } from '@/components/ui/SymbolIcon';
import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { projects } from '@/data/projects';
import { getFeaturedSeriesPost } from '@/lib/mdx';

const post = getFeaturedSeriesPost();
const entries = [
  ...(post ? [{ id: post.slug, title: post.title, description: post.description, type: 'Writing / Longform', to: `/blog/${post.slug}`, tags: post.tags, kind: 'journal' }] : []),
  ...projects.map((project) => ({ id: project.slug, title: project.title, description: project.description, type: 'Design & Development', to: `/works/${project.slug}`, tags: project.tags, kind: project.slug })),
];

export function WorkArtwork({ kind }: { kind: string }) {
  if (kind === 'journal') return <div className="work-art art-journal" aria-hidden="true"><img className="journal-cover-image" src="/images/journal/thought-continued-v1.webp" alt="" width={1254} height={1254} loading="lazy" decoding="async" /></div>;
  if (kind === 'tmo') return <div className="work-art art-tmo" aria-hidden="true"><div className="art-label"><span>TMO / COMMERCE</span><span>2026</span></div><img src="/images/tmo/hero-sku.png" alt="" loading="lazy" /><strong>TMO<span>®</span></strong><div className="art-label"><span>CONNECTED COMMERCE</span><span>IDEA → SYSTEM</span></div></div>;
  return <div className="work-art art-suanxian" aria-hidden="true"><div className="art-label"><span>SUANXIAN / FRESHFLOW</span><span>2026</span></div><div className="fresh-symbol"><span /><span /><span /></div><strong>Fresh ideas.<br />Full delivery.</strong><div className="art-label"><span>报价 → 下单 → 配送 → 结算</span><span><SymbolIcon name="arrow-up-right" /></span></div></div>;
}

export function CinematicRail() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const entry = entries[active];
  if (!entry) return null;
  return (
    <section id="selected-work" className="reset-section selected-section">
      <div className="section-meta"><span>02 / Selected work & writing</span><span>Ideas, then the work they shape.</span></div>
      <div className="selected-heading"><h2>Selected<span className="serif-star"><SymbolIcon name="arrow-up-right" /></span><br />perspectives<span className="work-count">({String(entries.length).padStart(2, '0')})</span></h2><p>Longform thinking.<br />Shipped systems.<br /><span>One continuous practice.</span></p></div>
      <div className="work-index">
        <Link to={entry.to} className="work-stage" aria-label={`查看：${entry.title}`}>
          <AnimatePresence initial={false} mode="wait"><motion.div key={entry.id} initial={reduced ? false : { opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}><WorkArtwork kind={entry.kind} /></motion.div></AnimatePresence>
          <span className="preview-circle">Explore<br /><SymbolIcon name="arrow-up-right" /></span>
        </Link>
        <div className="work-rows">
          {entries.map((item, index) => <Link key={item.id} to={item.to} className={`work-row ${active === index ? 'is-active' : ''}`} onPointerEnter={() => setActive(index)} onFocus={() => setActive(index)}>
            <div className="work-row-meta"><span>0{index + 1}</span><span>{item.type}</span><span className="work-row-arrow"><SymbolIcon name="arrow-up-right" /></span></div>
            <div className="mobile-work-art"><WorkArtwork kind={item.kind} /></div>
            <h3>{item.title}</h3><p>{item.description}</p><div className="work-tags">{item.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div>
          </Link>)}
        </div>
      </div>
      <div className="selected-bottom"><span>From thinking out loud to putting things out there.</span><div><Link className="text-link" to="/works">All works <SymbolIcon name="arrow-up-right" /></Link><Link className="text-link" to="/blog">The journal <SymbolIcon name="arrow-up-right" /></Link></div></div>
    </section>
  );
}
