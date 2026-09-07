import { SymbolIcon } from '@/components/ui/SymbolIcon';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { WorkArtwork } from '@/components/sections/CinematicRail';
import { projectCategories, projects } from '@/data/projects';
import type { ProjectCategory } from '@/types/project';

export function Works() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('All');
  const filtered = activeCategory === 'All' ? projects : projects.filter((project) => project.category === activeCategory);
  return <section className="interior-shell index-page">
    <header className="interior-heading"><div className="interior-kicker"><span>Selected works</span><span>{String(projects.length).padStart(2, '0')} projects</span></div><div className="index-title"><h1>Projects shaped as<br />experiences,<br /><span>not just screens.</span></h1><span className="index-direction" aria-hidden="true"><SymbolIcon name="arrow-down-right" /></span></div><p>这里既有完整项目，也有推动本站视觉语言形成的实验性工作。</p></header>
    <div className="project-filters" aria-label="作品分类">{projectCategories.map((category) => <button key={category} type="button" aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>{category}<span>{category === 'All' ? projects.length : projects.filter((project) => project.category === category).length}</span></button>)}</div>
    <div className="project-grid">{filtered.map((project) => <Link key={project.slug} to={`/works/${project.slug}`} className="project-entry"><div className="project-entry-art"><WorkArtwork kind={project.slug} /></div><div className="entry-meta"><span>{project.category}</span><span>{project.year}</span></div><div className="project-entry-title"><h2>{project.title}</h2><span aria-hidden="true"><SymbolIcon name="arrow-up-right" /></span></div><p>{project.description}</p><div className="entry-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></Link>)}</div>
  </section>;
}
