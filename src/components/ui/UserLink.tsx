interface UserLinkProps {
  handle: string;
  onClick?: (handle: string) => void;
}

export function UserLink({ handle, onClick }: UserLinkProps) {
  return (
    <a
      onClick={() => onClick?.(handle)}
      className="font-mono text-xs text-gh-accent cursor-pointer no-underline"
    >
      @{handle}
    </a>
  );
}
