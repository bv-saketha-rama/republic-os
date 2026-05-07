const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

interface YearMonthFilterProps {
  years: number[];
  year: number | undefined;
  month: number | undefined;
  onYearChange: (y: number | undefined) => void;
  onMonthChange: (m: number | undefined) => void;
}

export function YearMonthFilter({ years, year, month, onYearChange, onMonthChange }: YearMonthFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <select
        value={year ?? ''}
        onChange={(e) => onYearChange(e.target.value ? Number(e.target.value) : undefined)}
        className="text-xs bg-gh-canvas border border-gh-border rounded-md px-2 py-1 text-gh-fg-default focus:outline-none focus:border-gh-accent-emphasis"
      >
        <option value="">All years</option>
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <select
        value={month ?? ''}
        onChange={(e) => onMonthChange(e.target.value ? Number(e.target.value) : undefined)}
        className="text-xs bg-gh-canvas border border-gh-border rounded-md px-2 py-1 text-gh-fg-default focus:outline-none focus:border-gh-accent-emphasis"
        disabled={!year}
      >
        <option value="">All months</option>
        {MONTHS.map((name, i) => (
          <option key={i + 1} value={i + 1}>{name}</option>
        ))}
      </select>
      {(year || month) && (
        <button
          onClick={() => { onYearChange(undefined); onMonthChange(undefined); }}
          className="text-xs text-gh-fg-muted hover:text-gh-fg-default"
        >
          Clear
        </button>
      )}
    </div>
  );
}
