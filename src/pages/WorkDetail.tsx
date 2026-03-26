import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { projects } from '@/data/projects';
import { cn } from '@/lib/utils';
import type { Project, ProjectCaseStudyGalleryItem } from '@/types/project';

function ProjectMetaLinks({ project }: { project: Project }) {
  const isExternalLink = (href: string) => /^https?:\/\//i.test(href);

  return (
    <div className="rounded-[1.25rem] border border-line/8 bg-line/[0.03] p-6">
      <p className="text-xs uppercase tracking-[0.35em] text-foreground/45">Links</p>
      <div className="mt-5 flex flex-col gap-3">
        {project.links.map((item) =>
          isExternalLink(item.href) ? (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-line/10 px-4 py-3 text-sm uppercase tracking-[0.18em] text-foreground/80 hover:border-accent/50 hover:text-foreground"
            >
              {item.label}
            </a>
          ) : (
            <Link
              key={item.label}
              to={item.href}
              className="rounded-full border border-line/10 px-4 py-3 text-sm uppercase tracking-[0.18em] text-foreground/80 hover:border-accent/50 hover:text-foreground"
            >
              {item.label}
            </Link>
          ),
        )}
      </div>
    </div>
  );
}

function DefaultWorkDetail({
  project,
  nextProject,
}: {
  project: Project;
  nextProject?: Project;
}) {
  return (
    <section className="section-shell section-space">
      <div
        className="mb-12 h-[40vh] min-h-[320px] overflow-hidden rounded-[1rem]"
        style={{ background: project.cover }}
      />
      <SectionHeading
        eyebrow={`${project.category} / ${project.year}`}
        title={project.title}
        description={project.description}
      />
      <div className="grid gap-8 lg:grid-cols-[1.3fr,0.7fr]">
        <div className="space-y-6 text-base leading-8 text-foreground/70">
          {project.longDescription.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <aside className="space-y-6">
          <div className="rounded-[1.25rem] border border-line/8 bg-line/[0.03] p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-foreground/45">Project Metrics</p>
            <div className="mt-5 space-y-4">
              {project.metrics.map((item) => (
                <div key={item.label} className="border-b border-line/10 pb-4 last:border-none">
                  <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">{item.label}</p>
                  <p className="mt-2 text-lg text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          <ProjectMetaLinks project={project} />
        </aside>
      </div>
      {nextProject ? (
        <div className="mt-12">
          <Link
            to={`/works/${nextProject.slug}`}
            className="inline-flex rounded-full border border-line/10 px-5 py-3 text-sm uppercase tracking-[0.22em] text-foreground/80 hover:border-line/20 hover:text-foreground"
          >
            Next Project: {nextProject.title}
          </Link>
        </div>
      ) : null}
    </section>
  );
}

function GalleryCard({ item, index }: { item: ProjectCaseStudyGalleryItem; index: number }) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(item.image ? 'loading' : 'error');

  const frameClassName =
    item.theme === 'teal'
      ? 'from-teal-300/24 via-teal-300/8 to-background'
      : item.theme === 'amber'
        ? 'from-amber-300/24 via-amber-200/8 to-background'
        : 'from-slate-200/18 via-white/8 to-background';

  const chromeClassName =
    item.theme === 'teal'
      ? 'border-teal-300/30 bg-teal-300/10 text-teal-100'
      : item.theme === 'amber'
        ? 'border-amber-300/30 bg-amber-300/10 text-amber-100'
        : 'border-white/15 bg-white/10 text-white/80';

  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: index * 0.08 }}
      className="group"
    >
      <GlassCard className="h-full p-0">
        {item.image ? (
          <img
            src={item.image}
            alt=""
            aria-hidden="true"
            className="hidden"
            onLoad={() => setStatus('ready')}
            onError={() => setStatus('error')}
          />
        ) : null}
        <div
          className={cn(
            'relative overflow-hidden border-b border-line/10',
            item.ratio === 'portrait'
              ? 'aspect-[4/5]'
              : item.ratio === 'square'
                ? 'aspect-square'
                : 'aspect-[16/10]',
          )}
        >
          <div className={cn('absolute inset-0 bg-gradient-to-br', frameClassName)} />
          {status === 'ready' && item.image ? (
            <>
              <div
                className="absolute inset-[7%] rounded-[1.5rem] border border-white/10 bg-cover bg-center shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_35%)] opacity-70" />
            </>
          ) : (
            <div className="absolute inset-[8%] rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <span className={cn('h-2.5 w-2.5 rounded-full border', chromeClassName)} />
                <span className={cn('h-2.5 w-2.5 rounded-full border', chromeClassName)} />
                <span className={cn('h-2.5 w-2.5 rounded-full border', chromeClassName)} />
                <div className="ml-3 h-8 flex-1 rounded-full border border-white/10 bg-white/5" />
              </div>
              <div className="grid h-[calc(100%-3.5rem)] gap-3 p-4 sm:grid-cols-[1.1fr,0.9fr]">
                <div className="rounded-[1rem] border border-white/10 bg-white/[0.04] p-4">
                  <div className="h-2.5 w-24 rounded-full bg-white/15" />
                  <div className="mt-4 space-y-2">
                    <div className="h-12 rounded-[0.85rem] bg-white/8" />
                    <div className="h-12 rounded-[0.85rem] bg-white/8" />
                    <div className="h-24 rounded-[1rem] bg-[linear-gradient(135deg,rgba(45,212,191,0.16),rgba(245,158,11,0.1))]" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-24 rounded-[1rem] border border-white/10 bg-white/[0.05]" />
                  <div className="h-20 rounded-[1rem] border border-dashed border-white/15 bg-transparent" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-20 rounded-[1rem] bg-white/[0.05]" />
                    <div className="h-20 rounded-[1rem] bg-white/[0.05]" />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/65">
                Screenshot placeholder
              </div>
            </div>
          )}
        </div>
        <div className="p-6 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm uppercase tracking-[0.24em] text-foreground/45">Gallery {index + 1}</p>
            <span className="rounded-full border border-line/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-foreground/55">
              {item.ratio}
            </span>
          </div>
          <h3 className="mt-4 font-display text-3xl leading-tight text-foreground">{item.title}</h3>
          <p className="mt-4 text-sm leading-7 text-foreground/68">{item.caption}</p>
        </div>
      </GlassCard>
    </motion.article>
  );
}

function CaseStudyWorkDetail({
  project,
  nextProject,
}: {
  project: Project;
  nextProject?: Project;
}) {
  const caseStudy = project.caseStudy;

  if (!caseStudy) {
    return null;
  }

  return (
    <section className="section-shell section-space">
      <div
        className="case-study-hero relative overflow-hidden rounded-[1.75rem] min-h-[34rem] lg:aspect-[16/9] lg:min-h-0"
        style={{ background: project.cover }}
      >
        <div className="case-study-hero-mask absolute inset-0" />
        <div className="case-study-hero-ambient absolute inset-0" />
        <div className="relative grid h-full gap-10 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.15fr,0.85fr] lg:px-12 lg:py-14">
          <div className="flex min-h-[440px] flex-col justify-between lg:min-h-0">
            <div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-foreground/55">
                <span>{project.category}</span>
                <span className="h-1 w-1 rounded-full bg-foreground/35" />
                <span>{project.year}</span>
              </div>
              <p className="case-study-hero-context mt-6 max-w-2xl text-sm uppercase tracking-[0.22em]">
                {caseStudy.contextLine}
              </p>
              <h1 className="mt-8 max-w-3xl font-display text-5xl leading-[0.95] text-foreground sm:text-6xl lg:text-7xl">
                {project.title}
              </h1>
              <p className="case-study-hero-description mt-6 max-w-2xl text-base leading-8 sm:text-lg">
                {project.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="case-study-hero-chip rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.2em]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {caseStudy.summaryMetrics.map((item) => (
                <div
                  key={item.label}
                  className="case-study-hero-stat rounded-[1.25rem] p-5"
                >
                  <p className="case-study-hero-label text-[11px] uppercase tracking-[0.24em]">{item.label}</p>
                  <p className="mt-3 text-lg leading-7 text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          <GlassCard className="case-study-hero-panel h-full min-h-[440px] p-0 lg:min-h-0">
            <div className="flex h-full flex-col">
              <div className="case-study-hero-panel-divider border-b px-6 py-5">
                <p className="case-study-hero-label text-xs uppercase tracking-[0.34em]">Project Lens</p>
                <p className="case-study-hero-panel-copy mt-4 max-w-md text-sm leading-7">
                  从业务可演示性到工程可持续性，TMO 更像一套持续交付系统，而不是一次性前后端拼装。
                </p>
              </div>
              <div className="grid flex-1 gap-4 p-6">
                {project.metrics.map((item) => (
                  <div
                    key={item.label}
                    className="case-study-hero-metric-card rounded-[1.15rem] p-5"
                  >
                    <p className="case-study-hero-label text-[11px] uppercase tracking-[0.24em]">{item.label}</p>
                    <p className="mt-3 text-xl text-foreground">{item.value}</p>
                  </div>
                ))}
                <div className="case-study-hero-delivery rounded-[1.15rem] p-5">
                  <p className="case-study-hero-label text-[11px] uppercase tracking-[0.24em]">Delivery Shape</p>
                  <p className="case-study-hero-panel-copy mt-3 text-sm leading-7">
                    商品目录、意向订单、业务员归属、售后回路和自动化验证都被纳入同一条交付链路。
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-6 text-base leading-8 text-foreground/70">
          {project.longDescription.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <aside className="space-y-6">
          <div className="rounded-[1.25rem] border border-line/8 bg-line/[0.03] p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-foreground/45">Case Study Scope</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {caseStudy.chapters.map((chapter) => (
                <span
                  key={chapter.title}
                  className="rounded-full border border-line/10 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-foreground/75"
                >
                  {chapter.eyebrow}
                </span>
              ))}
            </div>
          </div>
          <ProjectMetaLinks project={project} />
        </aside>
      </div>

      <div className="mt-24 grid gap-10 lg:grid-cols-[0.72fr,1.28fr]">
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <p className="text-xs uppercase tracking-[0.35em] text-accent/75">Story Rail</p>
          <h2 className="mt-5 max-w-md font-display text-4xl leading-tight text-foreground sm:text-5xl">
            Three engineering decisions that shaped the project more than the UI itself.
          </h2>
          <p className="mt-6 max-w-md text-base leading-8 text-foreground/70">
            左侧是章节索引，右侧用堆叠卡片展开实际做法，让页面阅读更像一次工程 case study，而不是简历条目的展开版。
          </p>
          <div className="mt-8 space-y-4">
            {caseStudy.chapters.map((chapter, index) => (
              <div key={chapter.title} className="rounded-[1rem] border border-line/10 bg-line/[0.03] px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-foreground/45">0{index + 1}</p>
                <p className="mt-2 font-medium text-foreground/88">{chapter.title}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-20 lg:space-y-24">
          {caseStudy.chapters.map((chapter, index) => (
            <motion.article
              key={chapter.title}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, delay: 0.08 }}
            >
              <GlassCard className="overflow-hidden p-0">
                <div className="grid gap-6 border-b border-line/10 px-6 py-6 sm:px-8 sm:py-7 lg:grid-cols-[0.75fr,1.25fr]">
                  <div className="rounded-[1.15rem] border border-line/10 bg-[linear-gradient(160deg,rgba(45,212,191,0.08),rgba(255,255,255,0.03),rgba(245,158,11,0.08))] p-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-foreground/48">{chapter.eyebrow}</p>
                    <h3 className="mt-4 font-display text-3xl leading-tight text-foreground">
                      {chapter.title}
                    </h3>
                  </div>
                  <div>
                    <p className="text-base leading-8 text-foreground/72">{chapter.body}</p>
                    <div className="mt-6 space-y-3">
                      {chapter.focusPoints.map((point) => (
                        <div
                          key={point}
                          className="rounded-[1rem] border border-line/10 bg-black/10 px-4 py-4 text-sm leading-7 text-foreground/76"
                        >
                          {point}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="rounded-[1.25rem] border border-dashed border-line/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-5">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-foreground/45">
                      Spotlight Card 0{index + 1}
                    </p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-[1fr,auto] sm:items-end">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-accent/75">
                          {caseStudy.spotlightCards[index]?.eyebrow}
                        </p>
                        <h4 className="mt-3 font-display text-2xl leading-tight text-foreground">
                          {caseStudy.spotlightCards[index]?.title}
                        </h4>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/68">
                          {caseStudy.spotlightCards[index]?.description}
                        </p>
                      </div>
                      <div className="rounded-full border border-line/10 px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-foreground/58">
                        {caseStudy.spotlightCards[index]?.meta}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.article>
          ))}
        </div>
      </div>

      <div className="mt-24">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-accent/75">Screenshot Gallery</p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-foreground sm:text-5xl">
              Screens prepared as structured slots, even before the final captures arrive.
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-7 text-foreground/66">
            图片现在先按命名约定占位，真实截图补进 `public/images/tmo/` 后会自动接管这些卡片，不需要再改版式。
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
          <GalleryCard item={caseStudy.gallery[0]} index={0} />
          <div className="grid gap-6">
            {caseStudy.gallery.slice(1).map((item, index) => (
              <GalleryCard key={item.title} item={item} index={index + 1} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-24 grid gap-8 lg:grid-cols-[1.05fr,0.95fr]">
        <GlassCard className="p-0">
          <div className="border-b border-line/10 px-6 py-6 sm:px-8">
            <p className="text-xs uppercase tracking-[0.35em] text-foreground/45">Delivery Wrap-Up</p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight text-foreground">
              The project was delivered as an engineering workbench, not only as a feature list.
            </h2>
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
            <div className="rounded-[1rem] border border-line/10 bg-line/[0.03] p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-foreground/45">Coordination</p>
              <p className="mt-3 text-sm leading-7 text-foreground/70">
                从 contract、代码生成、热更新到 pipeline 输出策略，协作对象不是单一工程师，而是人和 Agent 混合的交付流程。
              </p>
            </div>
            <div className="rounded-[1rem] border border-line/10 bg-line/[0.03] p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-foreground/45">Platform Reach</p>
              <p className="mt-3 text-sm leading-7 text-foreground/70">
                微信、支付宝和 H5 并行推进，但业务能力仍被维护在一份可持续演进的统一代码库里。
              </p>
            </div>
            <div className="rounded-[1rem] border border-line/10 bg-line/[0.03] p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-foreground/45">Verification</p>
              <p className="mt-3 text-sm leading-7 text-foreground/70">
                自动化验证不仅负责发现问题，也负责带回 Console / Network 证据，降低回归与定位成本。
              </p>
            </div>
          </div>
        </GlassCard>

        <aside className="space-y-6">
          <ProjectMetaLinks project={project} />
          {nextProject ? (
            <div className="rounded-[1.25rem] border border-line/8 bg-line/[0.03] p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-foreground/45">Continue</p>
              <Link
                to={`/works/${nextProject.slug}`}
                className="mt-5 flex rounded-[1rem] border border-line/10 bg-black/10 px-5 py-5 text-left hover:border-line/20"
              >
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-foreground/45">Next Project</p>
                  <p className="mt-3 font-display text-3xl text-foreground">{nextProject.title}</p>
                  <p className="mt-3 text-sm leading-7 text-foreground/68">{nextProject.description}</p>
                </div>
              </Link>
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}

export function WorkDetail() {
  const { slug } = useParams();
  const projectIndex = projects.findIndex((item) => item.slug === slug);

  if (projectIndex === -1) {
    return <Navigate to="/works" replace />;
  }

  const project = projects[projectIndex];
  const nextProject =
    projects.length > 1 ? projects[(projectIndex + 1) % projects.length] : undefined;

  if (project.caseStudy) {
    return <CaseStudyWorkDetail project={project} nextProject={nextProject} />;
  }

  return <DefaultWorkDetail project={project} nextProject={nextProject} />;
}
