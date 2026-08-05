/** Days since Imperium Galactica commercial release (1997-03-01). */
export function daysSinceRelease(now = new Date()): number {
  const release = Date.UTC(1997, 3, 1);
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.floor((today - release) / 86_400_000));
}
