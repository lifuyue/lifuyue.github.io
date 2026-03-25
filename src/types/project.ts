export type ProjectCategory = 'All' | 'Experience' | 'Creative Coding' | 'Frontend' | 'Writing';

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectCaseStudyChapter {
  eyebrow: string;
  title: string;
  body: string;
  focusPoints: string[];
}

export interface ProjectCaseStudyGalleryItem {
  title: string;
  caption: string;
  image?: string;
  ratio: 'landscape' | 'portrait' | 'square';
  theme: 'teal' | 'amber' | 'slate';
}

export interface ProjectCaseStudySpotlightCard {
  eyebrow: string;
  title: string;
  description: string;
  meta: string;
}

export interface ProjectCaseStudy {
  contextLine: string;
  summaryMetrics: ProjectMetric[];
  chapters: ProjectCaseStudyChapter[];
  gallery: ProjectCaseStudyGalleryItem[];
  spotlightCards: ProjectCaseStudySpotlightCard[];
}

export interface Project {
  slug: string;
  title: string;
  category: Exclude<ProjectCategory, 'All'>;
  year: string;
  description: string;
  longDescription: string[];
  tags: string[];
  cover: string;
  accent: string;
  metrics: ProjectMetric[];
  links: ProjectLink[];
  caseStudy?: ProjectCaseStudy;
}
