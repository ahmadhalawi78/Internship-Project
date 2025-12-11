export function addMsToNow(ms: number): string {
  return new Date(Date.now() + ms).toISOString();
}

export function addDaysIso(days: number): string {
  return addMsToNow(days * 24 * 60 * 60 * 1000);
}
