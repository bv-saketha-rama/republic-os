export const C = {
  bg: '#0d1117',
  surface: '#161b22',
  surface2: '#1c2128',
  border: '#30363d',
  border2: '#21262d',
  text: '#e6edf3',
  muted: '#7d8590',
  accent: '#f78166',
  green: '#3fb950',
  red: '#f85149',
  yellow: '#d29922',
  blue: '#388bfd',
  purple: '#a371f7',
} as const;

export const STATUS: Record<
  string,
  { color: string; icon: string; label: string; mergedColor?: string }
> = {
  open: { color: C.blue, icon: '●', label: 'Open' },
  draft: { color: C.muted, icon: '◐', label: 'Draft' },
  'in-review': { color: C.yellow, icon: '⟳', label: 'In Review' },
  'changes-requested': { color: C.red, icon: '↩', label: 'Changes Requested' },
  merged: { color: C.purple, icon: '✓', label: 'Merged', mergedColor: C.green },
  closed: { color: C.red, icon: '✗', label: 'Closed' },
  lapsed: { color: C.muted, icon: '⊘', label: 'Lapsed' },
  ordinance: { color: C.purple, icon: '⚡', label: 'Ordinance' },
};

export const PARTY_COLORS: Record<string, string> = {
  'BJP': '#f97316',
  'INC': '#3b82f6',
  'AITC': '#22c55e',
  'DMK': '#ef4444',
  'AAP': '#06b6d4',
  'CPI(M)': '#dc2626',
  'JDU': '#84cc16',
  'JMM': '#10b981',
  'TDP': '#eab308',
  'JKNC': '#8b5cf6',
  'NPP': '#14b8a6',
  'NDPP': '#6366f1',
  'ZPM': '#f59e0b',
  'SKM': '#ec4899',
  'NCP(SP)': '#06b6d4',
};
