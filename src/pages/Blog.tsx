import { BlogList } from '@/components/blog/BlogList';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getAllPosts } from '@/lib/mdx';

export function Blog() {
  const posts = getAllPosts();

  return (
    <section className="section-shell section-space">
      <SectionHeading
        eyebrow="Journal"
        title="Notes on interface craft, motion, and content systems."
        description="这些文章是工作台记录：我如何拆解一个体验，以及如何把它做成能维护的代码。"
      />
      <BlogList posts={posts} />
    </section>
  );
}
