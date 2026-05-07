interface AvatarProps {
  handle: string;
  size?: number;
}

export function Avatar({ handle, size = 20 }: AvatarProps) {
  const colors = ['#f78166', '#3fb950', '#388bfd', '#a371f7', '#d29922', '#f85149', '#56d364'];
  const seed = (handle || '?').split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  const bg = colors[seed % colors.length];
  const initials = (handle || '?')
    .split('-')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-mono font-bold shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: bg,
        color: '#0d1117',
        fontSize: size * 0.42,
      }}
    >
      {initials}
    </span>
  );
}
