import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'primary';
  size?: 'sm' | 'md';
  icon?: string;
  className?: string;
}

export function Button({ children, onClick, variant = 'default', size = 'md', icon, className }: ButtonProps) {
  const isPrimary = variant === 'primary';
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md font-sans text-xs font-medium cursor-pointer',
        size === 'sm' ? 'px-2.5 py-[3px]' : 'px-3.5 py-[5px]',
        isPrimary
          ? 'bg-[#238636] border border-[#2ea043] text-gh-text'
          : 'bg-gh-surface2 border border-gh-border text-gh-text',
        className
      )}
    >
      {icon && <span className="font-mono text-xs">{icon}</span>}
      {children}
    </button>
  );
}
