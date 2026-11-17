import { detectCsvDelimiter, parseCsvLine, parseNameCountCsv } from "./csv";

describe("parseCsvLine", () => {
  it("splits simple comma-separated values", () => {
    expect(parseCsvLine("Alice,5")).toEqual(["Alice", "5"]);
  });

  it("keeps commas inside quoted fields", () => {
    expect(parseCsvLine('"Doe, Jane",3')).toEqual(["Doe, Jane", "3"]);
  });
});

describe("detectCsvDelimiter", () => {
  it("detects tabs and semicolons", () => {
    expect(detectCsvDelimiter("name\tcount")).toBe("\t");
    expect(detectCsvDelimiter("name;count")).toBe(";");
    expect(detectCsvDelimiter("name,count")).toBe(",");
  });
});

describe("parseNameCountCsv", () => {
  it("parses a headered name/count CSV", () => {
    const result = parseNameCountCsv("name,count\nAlice,5\nBob,3\n");

    expect(result).toEqual({
      entries: [
        { name: "Alice", count: 5 },
        { name: "Bob", count: 3 },
      ],
    });
  });

  it("defaults missing counts to 1 and clamps high values", () => {
    const result = parseNameCountCsv("Alice\nBob,99\n");

    expect(result).toEqual({
      entries: [
        { name: "Alice", count: 1 },
        { name: "Bob", count: 20 },
      ],
    });
  });

  it("skips a header row and empty lines", () => {
    const result = parseNameCountCsv("Name,Count\n\nCarla,2\n");

    expect(result).toEqual({
      entries: [{ name: "Carla", count: 2 }],
    });
  });

  it("returns an error for empty files", () => {
    expect(parseNameCountCsv("   ")).toEqual({
      entries: [],
      error: "The CSV file is empty.",
    });
  });
});
