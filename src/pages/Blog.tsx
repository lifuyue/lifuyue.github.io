import { SymbolIcon } from '@/components/ui/SymbolIcon';
import { BlogList } from '@/components/blog/BlogList';
import { FeaturedSeriesCard } from '@/components/blog/FeaturedSeriesCard';
import { getAllPosts } from '@/lib/mdx';

export function Blog() {
  const posts = getAllPosts();
  const series = posts.filter((post) => post.kind === 'series');
  const featured = series.find((post) => post.featured) ?? series[0];
  const otherSeries = series.filter((post) => post.slug !== featured?.slug);
  const notes = posts.filter((post) => post.kind !== 'series');
  return <section className="interior-shell index-page">
    <header className="interior-heading"><div className="interior-kicker"><span>Journal / In progress</span><span>{String(posts.length).padStart(2, '0')} entries</span></div><div className="index-title"><h1>思考没有终稿，<br /><span>只有下一期。</span></h1><span className="index-direction" aria-hidden="true"><SymbolIcon name="arrow-down-right" /></span></div><p>一份不定期更新的个人刊物。追问那些值得反复拆解的问题，项目复盘则保留每次实践留下的判断。</p></header>
    {featured && <section className="journal-section" aria-labelledby="ongoing-series-title"><div className="journal-section-heading"><h2 id="ongoing-series-title">主线长文<span>01 / Longform</span></h2><p>不固定周期，沿着同一个问题持续写下去。<br />每一期都是我个人的阶段答案。</p></div><FeaturedSeriesCard post={featured} />{otherSeries.length > 0 && <BlogList posts={otherSeries} />}</section>}
    <section className="journal-section" aria-labelledby="project-notes-title"><div className="journal-section-heading"><h2 id="project-notes-title">项目复盘<span>02 / Project notes</span></h2><p>整理项目交付后的得失、取舍与仍未解决的问题。</p></div><BlogList posts={notes} /></section>
  </section>;
}
