import { useMemo } from 'react';
import { IndiaPaths, IndiaViewBox } from '@/lib/indiaPaths';
import { C } from '@/lib/constants';
import type { State } from '@/types';

interface ChoroplethMapProps {
  data: State[];
  onSelect: (id: string) => void;
  selected: string | null;
  hovered: string | null;
  setHovered: (hovered: { id: string; x: number; y: number } | null) => void;
}

export function ChoroplethMap({ data, onSelect, selected, hovered, setHovered }: ChoroplethMapProps) {
  const stateById = useMemo(() => Object.fromEntries(data.map((s) => [s.id, s])), [data]);

  const fillFor = (id: string) => {
    const s = stateById[id];
    if (!s) return '#1c2128';
    if (selected === id) return C.accent;
    if (s.health === 'healthy') return '#1f6f3a';
    if (s.health === 'amber') return '#9e6a00';
    if (s.health === 'critical') return '#7d2424';
    return '#30363d';
  };

  return (
    <svg viewBox={IndiaViewBox} className="block" style={{ width: 'auto', height: '100%', maxWidth: '100%', maxHeight: '100%' }}>
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#161b22" strokeWidth="1" />
        </pattern>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      {Object.entries(IndiaPaths).map(([id, p]) => {
        const s = stateById[id];
        const isHovered = hovered === id;
        const isSelected = selected === id;
        const fill = s ? fillFor(id) : '#1c2128';
        return (
          <path
            key={id}
            d={p.d}
            fill={fill}
            stroke={isSelected ? C.accent : isHovered ? C.text : '#30363d'}
            strokeWidth={isSelected ? 1.6 : isHovered ? 1.2 : 0.6}
            opacity={s ? (isHovered || isSelected ? 1 : 0.92) : 0.4}
            className="transition-colors duration-150"
            style={{ cursor: s ? 'pointer' : 'default' }}
            onMouseEnter={(e) => s && setHovered({ id, x: e.clientX, y: e.clientY })}
            onMouseMove={(e) => s && setHovered({ id, x: e.clientX, y: e.clientY })}
            onMouseLeave={() => setHovered(null)}
            onClick={() => s && onSelect(id)}
          />
        );
      })}
    </svg>
  );
}
