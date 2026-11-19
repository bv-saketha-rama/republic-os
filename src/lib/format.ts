const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/** Parse "Jun 2027" into a Date at end of that month; null if unparseable. */
export function parseMandate(text?: string): Date | null {
  const m = (text ?? '').trim().match(/^([A-Za-z]{3})[a-z]*\s+(\d{4})$/);
  if (!m) return null;
  const idx = MONTHS.indexOf(m[1].toLowerCase());
  if (idx < 0) return null;
  return new Date(Number(m[2]), idx + 1, 0, 23, 59, 59);
}

/** True when the stated mandate end date is already in the past. */
export function mandateExpired(text?: string, now = new Date()): boolean {
  const d = parseMandate(text);
  return d !== null && d.getTime() < now.getTime();
}
