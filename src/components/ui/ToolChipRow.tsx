import { cn } from '@/lib/utils';

interface ToolChipRowProps {
  items: string[];
  className?: string;
  chipClassName?: string;
}

export function ToolChipRow({ items, className, chipClassName }: ToolChipRowProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {items.map((item) => (
        <span
          key={item}
          className={cn(
            'rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] backdrop-blur-sm sm:text-[11px]',
            chipClassName,
          )}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
