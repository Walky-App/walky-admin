import { describe, it, expect } from "vitest";
import { formatMemberSince } from "./dateUtils";

describe("formatMemberSince", () => {
  it("formats a Date object as 'MMM d, yyyy'", () => {
    // Construct via local-time Date so the assertion is timezone-independent.
    expect(formatMemberSince(new Date(2025, 8, 28))).toBe("Sep 28, 2025");
    expect(formatMemberSince(new Date(2026, 0, 1))).toBe("Jan 1, 2026");
  });

  it("formats a parseable date string into the expected shape", () => {
    // Assert the format pattern rather than an exact day to stay tz-safe.
    expect(formatMemberSince("2025-09-28T12:00:00")).toMatch(
      /^[A-Z][a-z]{2} \d{1,2}, \d{4}$/
    );
  });

  it("returns 'N/A' for null/undefined/empty input", () => {
    expect(formatMemberSince(null)).toBe("N/A");
    expect(formatMemberSince(undefined)).toBe("N/A");
    expect(formatMemberSince("")).toBe("N/A");
  });

  it("returns the original string when it cannot be parsed", () => {
    expect(formatMemberSince("not-a-date")).toBe("not-a-date");
  });

  it("returns 'N/A' for an invalid Date object", () => {
    expect(formatMemberSince(new Date("nonsense"))).toBe("N/A");
  });
});
