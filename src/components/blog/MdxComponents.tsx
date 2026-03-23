import type { MDXComponents } from 'mdx/types';

export const mdxComponents: MDXComponents = {
  h2: (props) => <h2 className="font-display text-3xl text-white" {...props} />,
  h3: (props) => <h3 className="font-display text-2xl text-white" {...props} />,
  a: (props) => (
    <a
      className="text-amber-300 underline decoration-amber-500/40 underline-offset-4"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[0.9em] text-amber-200"
      {...props}
    />
  ),
  pre: (props) => (
    <pre className="overflow-x-auto rounded-[1.5rem] border border-white/10 p-5" {...props} />
  ),
  blockquote: (props) => (
    <blockquote className="border-l-2 border-amber-400 pl-6 italic text-zinc-200" {...props} />
  ),
};
