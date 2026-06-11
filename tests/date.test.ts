import { describe, expect, it } from "vitest";
import { formatDate } from "../src/utils/date";

describe("formatDate", () => {
  it("UTC の日時を YYYY-MM-DD HH:mm 形式で整形する", () => {
    expect(formatDate(new Date("2026-01-15T09:30:00Z"))).toBe("2026-01-15 09:30");
  });

  it("月日と時分をゼロ埋めする", () => {
    expect(formatDate(new Date("2026-03-05T04:05:00Z"))).toBe("2026-03-05 04:05");
  });
});
