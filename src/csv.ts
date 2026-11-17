import { clampSelectionCount, NameEntry } from "./types";

export type CsvParseResult =
  | { entries: NameEntry[] }
  | { entries: []; error: string };

const HEADER_NAME_ALIASES = new Set(["name", "names", "label", "person"]);
const HEADER_COUNT_ALIASES = new Set([
  "count",
  "counts",
  "selections",
  "weight",
  "odds",
  "#",
]);

export function parseCsvLine(line: string, delimiter = ","): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const character = line[i];

    if (inQuotes) {
      if (character === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        current += character;
      }
    } else if (character === '"') {
      inQuotes = true;
    } else if (character === delimiter) {
      cells.push(current);
      current = "";
    } else {
      current += character;
    }
  }

  cells.push(current);
  return cells.map((cell) => cell.trim());
}

export function detectCsvDelimiter(line: string): string {
  const commas = (line.match(/,/g) || []).length;
  const tabs = (line.match(/\t/g) || []).length;
  const semicolons = (line.match(/;/g) || []).length;

  if (tabs > commas && tabs >= semicolons) {
    return "\t";
  }
  if (semicolons > commas) {
    return ";";
  }
  return ",";
}

function isHeaderRow(cells: string[]): boolean {
  const first = (cells[0] || "").toLowerCase();
  const second = (cells[1] || "").toLowerCase();

  return (
    HEADER_NAME_ALIASES.has(first) ||
    (first.includes("name") &&
      (HEADER_COUNT_ALIASES.has(second) || second.includes("count")))
  );
}

export function parseNameCountCsv(text: string): CsvParseResult {
  const normalized = text
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();

  if (!normalized) {
    return { entries: [], error: "The CSV file is empty." };
  }

  const lines = normalized.split("\n").filter((line) => line.trim() !== "");
  const delimiter = detectCsvDelimiter(lines[0]);
  const firstCells = parseCsvLine(lines[0], delimiter);
  const startIndex = isHeaderRow(firstCells) ? 1 : 0;
  const entries: NameEntry[] = [];

  for (let i = startIndex; i < lines.length; i += 1) {
    const cells = parseCsvLine(lines[i], delimiter);
    const name = cells[0] || "";

    if (!name) {
      continue;
    }

    const rawCount = cells[1] || "1";
    const parsedCount = Number.parseInt(rawCount, 10);
    const count = Number.isFinite(parsedCount)
      ? clampSelectionCount(parsedCount)
      : 1;

    entries.push({ name, count });
  }

  if (entries.length === 0) {
    return {
      entries: [],
      error: "No names found. Use two columns: name, count.",
    };
  }

  return { entries };
}
