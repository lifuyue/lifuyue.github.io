import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

type LogoClaudeProps = ComponentPropsWithoutRef<'svg'>;

const petals = [0, 45, 90, 135, 180, 225, 270, 315];

export function LogoClaude({ className, ...props }: LogoClaudeProps) {
  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      aria-hidden="true"
      className={cn('h-16 w-16', className)}
      {...props}
    >
      <g fill="currentColor">
        {petals.map((angle) => (
          <rect
            key={angle}
            x="57"
            y="10"
            width="14"
            height="42"
            rx="7"
            transform={`rotate(${angle} 64 64)`}
          />
        ))}
        <circle cx="64" cy="64" r="20" />
      </g>
    </svg>
  );
}
