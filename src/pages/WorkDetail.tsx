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

  return (
    <section className="section-shell section-space">
      <div
        className="mb-12 h-[40vh] min-h-[320px] overflow-hidden rounded-[2.5rem] border border-white/10"
        style={{ background: project.cover }}
      />
      <SectionHeading
        eyebrow={`${project.category} / ${project.year}`}
        title={project.title}
        description={project.description}
      />
      <div className="grid gap-8 lg:grid-cols-[1.3fr,0.7fr]">
        <div className="glass-panel rounded-[2rem] p-8 sm:p-10">
          <div className="space-y-6 text-base leading-8 text-zinc-300">
            {project.longDescription.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <aside className="space-y-6">
          <div className="glass-panel rounded-[2rem] p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Project Metrics</p>
            <div className="mt-5 space-y-4">
              {project.metrics.map((item) => (
                <div key={item.label} className="border-b border-white/10 pb-4 last:border-none">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{item.label}</p>
                  <p className="mt-2 text-lg text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-panel rounded-[2rem] p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Links</p>
            <div className="mt-5 flex flex-col gap-3">
              {project.links.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-full border border-white/10 px-4 py-3 text-sm uppercase tracking-[0.18em] text-zinc-200 hover:border-amber-300/50 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
      <div className="mt-12">
        <Link
          to={`/works/${nextProject.slug}`}
          className="inline-flex rounded-full border border-white/10 px-5 py-3 text-sm uppercase tracking-[0.22em] text-zinc-200 hover:border-white/20 hover:text-white"
        >
          Next Project: {nextProject.title}
        </Link>
      </div>
    </section>
  );
}
