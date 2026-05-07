import { C, STATUS } from '@/lib/constants';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const s = STATUS[status] || STATUS.open;
  const color = status === 'merged' ? C.purple : s.color;
  return (
    <span
      className="inline-flex items-center gap-[5px] rounded-full px-[9px] py-[3px] text-white font-mono text-[11px] font-semibold"
      style={{ backgroundColor: color }}
    >
      <span>{s.icon}</span>
      {s.label}
    </span>
  );
}
