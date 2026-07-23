import { Link } from 'react-router-dom';
import { BlogList } from '@/components/blog/BlogList';
import { FeaturedSeriesCard } from '@/components/blog/FeaturedSeriesCard';
import { getAllPosts } from '@/lib/mdx';
import { formatDate } from '@/lib/utils';

export function Blog() {
  const posts = getAllPosts();
  const seriesPosts = posts.filter((post) => post.kind === 'series');
  const retrospectivePosts = posts.filter((post) => post.kind !== 'series');
  const featuredPost = seriesPosts.find((post) => post.featured) ?? seriesPosts[0];
  const moreSeriesPosts = featuredPost
    ? seriesPosts.filter((post) => post.slug !== featuredPost.slug)
    : [];

  return (
    <section className="section-shell section-space overflow-hidden">
      <header className="relative border-b border-line/10 pb-12 sm:pb-16 lg:pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-5 top-0 font-display text-[clamp(5.5rem,18vw,14rem)] leading-[0.72] tracking-[-0.08em] text-foreground/[0.025]"
        >
          BLOG
        </div>

        <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="min-w-0 lg:col-span-9">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-accent/85">
              Journal · In progress
            </p>
            <h1 className="mt-6 max-w-5xl break-words font-display text-[clamp(3.4rem,13vw,6rem)] leading-[0.91] tracking-[-0.045em] text-foreground [overflow-wrap:anywhere] lg:text-[clamp(5.5rem,8vw,8.5rem)]">
              思考没有终稿，
              <br />
              只有下一期。
            </h1>
          </div>

          <div className="lg:col-span-3 lg:pb-2">
            <div className="mb-5 h-px w-14 bg-accent/70" />
            <p className="max-w-sm text-sm leading-7 text-foreground/65">
              一份不定期更新的个人刊物。追问那些值得反复拆解的问题，项目复盘则保留每次实践留下的判断。
            </p>
          </div>
        </div>
      </header>

      {featuredPost ? (
        <section aria-labelledby="ongoing-series-title" className="pt-14 sm:pt-20 lg:pt-24">
          <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.36em] text-accent/85">
                Longform
              </p>
              <h2
                id="ongoing-series-title"
                className="mt-3 font-display text-4xl leading-none text-foreground sm:text-5xl"
              >
                主线长文
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-7 text-foreground/60 sm:text-right">
              不固定周期，沿着同一个问题持续写下去。
              <br className="hidden sm:block" />
              每一期都是我个人的阶段答案。
            </p>
          </div>

          <FeaturedSeriesCard post={featuredPost} />

          {moreSeriesPosts.length > 0 ? (
            <nav className="mt-8 border-y border-line/10" aria-label="主线长文往期">
              <div className="py-5 text-[10px] font-semibold uppercase tracking-[0.34em] text-foreground/45">
                More from the series
              </div>
              {moreSeriesPosts.map((post, index) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="group grid min-w-0 gap-4 border-t border-line/10 py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent sm:grid-cols-[5rem_minmax(0,1fr)_auto] sm:items-center"
                >
                  <span className="text-xs uppercase tracking-[0.25em] text-accent/80">
                    {post.issue ?? String(index + 2).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 break-words font-display text-2xl leading-tight text-foreground transition-colors group-hover:text-accent [overflow-wrap:anywhere] sm:text-3xl">
                    {post.title}
                  </span>
                  <span className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-foreground/45">
                    {post.readTime ?? formatDate(post.date)}
                    <span aria-hidden="true" className="text-lg text-foreground/75">
                      →
                    </span>
                  </span>
                </Link>
              ))}
            </nav>
          ) : null}
        </section>
      ) : null}

      <section
        aria-labelledby="project-notes-title"
        className={`${featuredPost ? 'mt-20 border-t border-line/10 pt-14 sm:mt-28 sm:pt-20 lg:mt-36 lg:pt-24' : 'pt-14 sm:pt-20 lg:pt-24'}`}
      >
        <div className="mb-10 grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(14rem,28rem)] sm:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.36em] text-accent/85">
              Project notes
            </p>
            <h2
              id="project-notes-title"
              className="mt-3 font-display text-4xl leading-none text-foreground sm:text-5xl"
            >
              项目复盘
            </h2>
          </div>
          <p className="text-sm leading-7 text-foreground/60 sm:text-right">
            整理项目交付后的得失、取舍与仍未解决的问题。
          </p>
        </div>
        <BlogList posts={retrospectivePosts} />
      </section>
    </section>
  );
}
