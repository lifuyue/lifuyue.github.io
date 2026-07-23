import type { ComponentType } from 'react';

export type BlogPostKind = 'series' | 'retrospective';

export interface BlogFrontmatter {
  title: string;
  date: string;
  description: string;
  tags: string[];
  coverImage: string;
  kind?: BlogPostKind;
  subtitle?: string;
  issue?: string;
  readTime?: string;
  featured?: boolean;
  chapters?: string[];
}

export interface BlogPostEntry extends BlogFrontmatter {
  slug: string;
  Content: ComponentType;
}
