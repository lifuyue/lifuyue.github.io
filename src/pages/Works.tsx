import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { projectCategories, projects } from '@/data/projects';
import { useState } from 'react';
import type { ProjectCategory } from '@/types/project';

export function Works() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('All');
  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <section className="section-shell section-space">
      <SectionHeading
        eyebrow="Selected Works"
        title="Projects shaped as experiences, not just screens."
        description="这里既有完整项目，也有推动本站视觉语言形成的实验性工作。"
      />
      <div className="mb-10 flex flex-wrap gap-3">
        {projectCategories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.22em] ${
              activeCategory === category
                ? 'border-accent/60 bg-accent/10 text-foreground'
                : 'border-line/10 text-foreground/70 hover:border-line/20 hover:text-foreground'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {filteredProjects.map((project, index) => (
          <motion.div
            layout
            key={project.slug}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: index * 0.08 }}
          >
            <Link to={`/works/${project.slug}`} className="group block h-full">
              <GlassCard className="h-full min-h-[380px] p-0">
                <div
                  className="h-64 w-full border-b border-line/10 transition-transform duration-500 group-hover:scale-[1.02]"
                  style={{ background: project.cover }}
                />
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs uppercase tracking-[0.28em] text-foreground/45">
                      {project.category}
                    </span>
                    <span className="text-sm text-foreground/55">{project.year}</span>
                  </div>
                  <h2 className="mt-4 font-display text-4xl text-foreground">{project.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-foreground/70">{project.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-line/10 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-foreground/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
