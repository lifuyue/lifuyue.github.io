import { BlogList } from '@/components/blog/BlogList';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getAllPosts } from '@/lib/mdx';

export function Blog() {
  const posts = getAllPosts();

  return (
    <section className="section-shell section-space">
      <SectionHeading
        eyebrow="Blog"
        title="项目复盘与技术博客"
        description="记录每个项目踩过的坑和做对的决定。更多碎片想法在 Twitter 上。"
      />
      <BlogList posts={posts} />
    </section>
  );
}
