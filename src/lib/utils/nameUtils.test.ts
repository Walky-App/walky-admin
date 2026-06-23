import { describe, it, expect } from "vitest";
import { getFirstName } from "./nameUtils";

describe("getFirstName", () => {
  it("returns the first token of a full name", () => {
    expect(getFirstName("John Doe")).toBe("John");
    expect(getFirstName("Mary Jane Watson")).toBe("Mary");
  });

  it("returns a single-word name unchanged", () => {
    expect(getFirstName("Madonna")).toBe("Madonna");
  });

  it("returns empty string for empty/falsy input", () => {
    expect(getFirstName("")).toBe("");
    expect(getFirstName(undefined as unknown as string)).toBe("");
  });

  it("documents leading-whitespace behavior (split on first space)", () => {
    // A leading space makes the first token empty — current implementation
    // behavior, pinned so a future trim() change is a conscious decision.
    expect(getFirstName("  John")).toBe("");
  });
});
