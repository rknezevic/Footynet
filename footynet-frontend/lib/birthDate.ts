// Dates of birth travel as "YYYY-MM-DD" (C# DateOnly), the same format a date <input> uses

// Same limits as the backend (PlayerAge): players are 16 to 50 years old
export const MIN_AGE = 16;
export const MAX_AGE = 50;

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// min / max for the date input: born at most 50 and at least 16 years ago
export function birthDateLimits(today = new Date()) {
  const latest = new Date(today.getFullYear() - MIN_AGE, today.getMonth(), today.getDate());
  const earliest = new Date(today.getFullYear() - MAX_AGE, today.getMonth(), today.getDate());
  return { min: iso(earliest), max: iso(latest) };
}

// A local-time Date for "YYYY-MM-DD"; new Date("YYYY-MM-DD") would be UTC midnight,
// which is the previous day in time zones west of Greenwich
export function parseDateOnly(value: string) {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}
