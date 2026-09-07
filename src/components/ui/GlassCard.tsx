import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return <div className={cn('content-panel relative overflow-hidden rounded p-6', className)}><div className="relative h-full">{children}</div></div>;
}
