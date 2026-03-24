import { Link, Navigate, useParams } from 'react-router-dom';
import { projects } from '@/data/projects';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function WorkDetail() {
  const { slug } = useParams();
  const projectIndex = projects.findIndex((item) => item.slug === slug);

  if (projectIndex === -1) {
    return <Navigate to="/works" replace />;
  }

  const project = projects[projectIndex];
  const nextProject = projects[(projectIndex + 1) % projects.length];
  const isExternalLink = (href: string) => /^https?:\/\//i.test(href);

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
        </aside>
      </div>
      <div className="mt-12">
        <Link
          to={`/works/${nextProject.slug}`}
          className="inline-flex rounded-full border border-line/10 px-5 py-3 text-sm uppercase tracking-[0.22em] text-foreground/80 hover:border-line/20 hover:text-foreground"
        >
          Next Project: {nextProject.title}
        </Link>
      </div>
    </section>
  );
}
