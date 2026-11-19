interface HashProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export function Hash({ children, onClick }: HashProps) {
  const cls = 'font-mono text-xs text-gh-accent';
  if (!onClick) return <span className={cls}>{children}</span>;
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`${cls} bg-transparent border-none p-0 cursor-pointer`}
    >
      {children}
    </button>
  );
}
