declare module '*.mdx' {
  import type { ComponentType } from 'react';
  import type { BlogFrontmatter } from '@/types/blog';

  export const frontmatter: BlogFrontmatter;

  const MDXComponent: ComponentType;
  export default MDXComponent;
}
