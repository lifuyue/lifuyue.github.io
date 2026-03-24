import type { MDXComponents } from 'mdx/types';

export const mdxComponents: MDXComponents = {
  h2: (props) => <h2 className="font-display text-3xl text-foreground" {...props} />,
  h3: (props) => <h3 className="font-display text-2xl text-foreground" {...props} />,
  a: (props) => (
    <a
      className="text-accent underline decoration-accent/40 underline-offset-4"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded bg-line/5 px-1.5 py-0.5 font-mono text-[0.9em] text-accent"
      {...props}
    />
  ),
  pre: (props) => (
    <pre className="overflow-x-auto rounded-[1.5rem] border border-line/10 p-5" {...props} />
  ),
  blockquote: (props) => (
    <blockquote className="border-l-2 border-accent pl-6 italic text-foreground/80" {...props} />
  ),
};
