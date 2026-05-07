import { C } from '@/lib/constants';

interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

export function Sparkline({ data, color = C.green, width = 80, height = 18 }: SparklineProps) {
  const max = Math.max(...data, 1);
  const step = width / (data.length - 1);
  const path = data
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${height - (v / max) * height}`)
    .join(' ');
  return (
    <svg width={width} height={height} className="block">
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}
