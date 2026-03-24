import { cn } from '@/lib/utils';

interface InlineSvgProps {
  svg: string;
  className?: string;
}

export function InlineSvg({ svg, className }: InlineSvgProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('block shrink-0 [&_svg]:block [&_svg]:h-full [&_svg]:w-full', className)}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
