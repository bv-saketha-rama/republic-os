interface HashProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export function Hash({ children, onClick }: HashProps) {
  return (
    <a onClick={onClick} className="font-mono text-xs text-gh-accent cursor-pointer no-underline">
      {children}
    </a>
  );
}
