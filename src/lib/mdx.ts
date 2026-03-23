import type { ComponentType } from 'react';
import type { BlogPostEntry } from '@/types/blog';

type MdxModule = {
  default: ComponentType;
  frontmatter: {
    title: string;
    date: string;
    description: string;
    tags: string[];
    coverImage: string;
  };
};

const modules = import.meta.glob('../../content/blog/*.mdx', {
  eager: true,
}) as Record<string, MdxModule>;

const posts = Object.entries(modules)
  .map(([path, module]) => {
    const slug = path.split('/').pop()?.replace(/\.mdx$/, '');

    if (!slug) {
      return null;
    }

    return {
      slug,
      ...module.frontmatter,
      Content: module.default,
    } satisfies BlogPostEntry;
  })
  .filter((entry): entry is BlogPostEntry => entry !== null)
  .sort((a, b) => +new Date(b.date) - +new Date(a.date)) as BlogPostEntry[];

export function getAllPosts() {
  return posts;
}

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}
