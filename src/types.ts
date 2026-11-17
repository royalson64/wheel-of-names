export interface NameEntry {
  name: string;
  count: number;
}

export const MAX_SELECTIONS_PER_NAME = 20;
export const INITIAL_ENTRY_COUNT = 10;

export function createEmptyEntries(count: number): NameEntry[] {
  return Array.from({ length: count }, () => ({ name: "", count: 1 }));
}

export function clampSelectionCount(value: number): number {
  return Math.max(1, Math.min(MAX_SELECTIONS_PER_NAME, value));
}

export function getValidEntries(entries: readonly NameEntry[]): NameEntry[] {
  return entries.filter((entry) => entry.name.trim() !== "");
}

export function expandEntriesToNames(entries: readonly NameEntry[]): string[] {
  return getValidEntries(entries).flatMap((entry) =>
    Array.from({ length: entry.count }, () => entry.name)
  );
}
