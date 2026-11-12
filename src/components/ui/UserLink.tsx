interface UserLinkProps {
  handle: string;
  onClick?: (handle: string) => void;
}

export function UserLink({ handle, onClick }: UserLinkProps) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick?.(handle); }}
      className="bg-transparent border-none p-0 font-mono text-xs text-gh-accent cursor-pointer"
    >
      @{handle}
    </button>
  );
}
