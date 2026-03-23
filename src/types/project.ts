export type ProjectCategory = 'All' | 'Experience' | 'Creative Coding' | 'Frontend' | 'Writing';

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
  metrics: { label: string; value: string }[];
  links: { label: string; href: string }[];
}
