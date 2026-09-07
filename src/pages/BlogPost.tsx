import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { LongformArticle } from '@/components/blog/LongformArticle';
import { getPostBySlug } from '@/lib/mdx';

export function BlogPost() {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : undefined;
  useEffect(() => {
    if (!post) return;
    const previousTitle = document.title;
    document.title = `${post.title} — Lifuyue`;
    return () => { document.title = previousTitle; };
  }, [post]);
  return post ? <LongformArticle post={post} /> : <Navigate to="/blog" replace />;
}
