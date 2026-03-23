import type { ComponentType } from 'react';

export interface BlogFrontmatter {
  title: string;
  date: string;
  description: string;
  tags: string[];
  coverImage: string;
}

export interface BlogPostEntry extends BlogFrontmatter {
  slug: string;
  Content: ComponentType;
}
