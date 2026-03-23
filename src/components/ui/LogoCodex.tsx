import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

type LogoCodexProps = ComponentPropsWithoutRef<'svg'>;

const loops = [0, 60, 120, 180, 240, 300];

export function LogoCodex({ className, ...props }: LogoCodexProps) {
  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      aria-hidden="true"
      className={cn('h-16 w-16', className)}
      {...props}
    >
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        {loops.map((angle) => (
          <path
            key={angle}
            d="M52 10C52 5.58172 55.5817 2 60 2H68C72.4183 2 76 5.58172 76 10V46C76 50.4183 72.4183 54 68 54H60C55.5817 54 52 50.4183 52 46V10ZM60 14H68V42H60V14Z"
            transform={`rotate(${angle} 64 64)`}
          />
        ))}
        <path d="M64 44L81.3205 54V74L64 84L46.6795 74V54L64 44Z" />
      </g>
    </svg>
  );
}
