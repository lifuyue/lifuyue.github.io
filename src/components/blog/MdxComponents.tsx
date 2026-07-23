import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { MDXComponents } from 'mdx/types';

const chapterNumbers: Record<string, string> = {
  一: '1',
  二: '2',
  三: '3',
  四: '4',
  五: '5',
  六: '6',
  七: '7',
  八: '8',
  九: '9',
  十: '10',
  十一: '11',
  十二: '12',
  十三: '13',
  十四: '14',
};

function nodeText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(nodeText).join('');
  }

  if (node && typeof node === 'object' && 'props' in node) {
    return nodeText((node as { props?: { children?: ReactNode } }).props?.children);
  }

  return '';
}

export function headingToId(value: ReactNode) {
  const text = nodeText(value).trim();
  const chapter = text.match(/^([一二三四五六七八九十]+)、/)?.[1];

  if (chapter && chapterNumbers[chapter]) {
    return `chapter-${chapterNumbers[chapter]}`;
  }

  const normalized = text
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || 'section';
}

export const mdxComponents: MDXComponents = {
  h2: ({ children, id, ...props }) => (
    <h2
      id={id ?? headingToId(children)}
      className="scroll-mt-32 font-display text-3xl text-foreground"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: (props) => <h3 className="scroll-mt-32 font-display text-2xl text-foreground" {...props} />,
  a: ({ href = '', children, ...props }) =>
    href.startsWith('/') ? (
      <Link
        to={href}
        className="text-accent underline decoration-accent/40 underline-offset-4"
        {...props}
      >
        {children}
      </Link>
    ) : (
      <a
        href={href}
        className="text-accent underline decoration-accent/40 underline-offset-4"
        {...props}
      >
        {children}
      </a>
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
  hr: (props) => <hr className="border-line/10" {...props} />,
  figure: (props) => <figure className="my-12" {...props} />,
  figcaption: (props) => (
    <figcaption
      className="mt-3 text-center text-xs leading-6 text-foreground/45"
      {...props}
    />
  ),
  img: ({ alt = '', ...props }) => (
    <img
      alt={alt}
      loading="lazy"
      className="w-full rounded-[1.5rem] border border-line/10"
      {...props}
    />
  ),
};
