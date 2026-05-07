import { cn } from '@/lib/utils';

interface TagProps {
  children: React.ReactNode;
  color?: string;
  onClick?: () => void;
  variant?: 'default' | 'solid';
  className?: string;
}

export function Tag({ children, color, onClick, variant = 'default', className }: TagProps) {
  return (
    <span
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-[7px] py-px font-mono text-[11px] font-medium whitespace-nowrap',
        onClick && 'cursor-pointer',
        className
      )}
      style={{
        border: `1px solid ${color || '#30363d'}`,
        color: color || '#7d8590',
        backgroundColor: variant === 'solid' ? `${color}22` : 'transparent',
      }}
    >
      {children}
    </span>
  );
}
