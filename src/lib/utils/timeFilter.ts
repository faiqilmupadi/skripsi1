export function resolveTimeRange(timePreset?: string, start?: string, end?: string) {
  const now = new Date();
  if (timePreset === '24h') return { start: new Date(now.getTime() - 24 * 3600000), end: now };
  if (timePreset === '7d') return { start: new Date(now.getTime() - 7 * 24 * 3600000), end: now };
  if (timePreset === '1m') return { start: new Date(now.getTime() - 30 * 24 * 3600000), end: now };
  if (start && end) return { start: new Date(start), end: new Date(end) };
  return null;
}
