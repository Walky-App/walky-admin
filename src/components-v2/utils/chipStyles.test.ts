import { describe, it, expect } from "vitest";
import {
  formatChipLabel,
  getReasonChipStyle,
  getUserReasonChipStyle,
  getEventReasonChipStyle,
  getIdeaReasonChipStyle,
  getSpaceReasonChipStyle,
  getStatusChipStyle,
  getSpaceCategoryChipStyle,
  getAdminRoleChipStyle,
} from "./chipStyles";

describe("formatChipLabel", () => {
  it("title-cases and normalizes underscores/whitespace", () => {
    expect(formatChipLabel("under_review")).toBe("Under Review");
    expect(formatChipLabel("  hello   world ")).toBe("Hello World");
    expect(formatChipLabel("active")).toBe("Active");
  });

  it("returns empty string for empty/undefined input", () => {
    expect(formatChipLabel("")).toBe("");
    expect(formatChipLabel(undefined)).toBe("");
  });
});

describe("getStatusChipStyle", () => {
  it("maps known statuses to their colors", () => {
    expect(getStatusChipStyle("active")).toMatchObject({
      bg: "#edffed",
      text: "#18682c",
    });
    expect(getStatusChipStyle("banned")).toMatchObject({
      bg: "#d53425",
      text: "#ffffff",
    });
    expect(getStatusChipStyle("deactivated")).toMatchObject({
      bg: "#1d1b20",
      text: "#ffffff",
    });
  });

  it("is case-insensitive", () => {
    expect(getStatusChipStyle("ACTIVE")).toMatchObject({ bg: "#edffed" });
  });

  it("disambiguates substrings via matcher order (inactive ≠ active)", () => {
    // 'inactive' is matched before 'active', so it keeps its own grey style.
    expect(getStatusChipStyle("inactive")).toMatchObject({
      bg: "#e7ecef",
      text: "#4f565d",
      label: "Inactive",
    });
    // 'deactivated' is matched before 'active' too.
    expect(getStatusChipStyle("deactivated")).toMatchObject({ bg: "#1d1b20" });
    // 'not reported' is matched before 'reported'.
    expect(getStatusChipStyle("not reported")).toMatchObject({ bg: "#eef0f1" });
    expect(getStatusChipStyle("reported")).toMatchObject({
      bg: "#ffe5e4",
      text: "#a4181a",
    });
  });

  it("uses a fallback label for unmatched statuses", () => {
    expect(getStatusChipStyle("frozen")).toMatchObject({
      bg: "#e7ecef",
      label: "Frozen",
    });
    expect(getStatusChipStyle(undefined)).toMatchObject({ label: "Status" });
  });
});

describe("reason chip styles", () => {
  it("getUserReasonChipStyle matches harassment/spam", () => {
    expect(getUserReasonChipStyle("harassment")).toMatchObject({
      bg: "#fff4e4",
      text: "#8f5400",
      label: "Harassment\n/ Threats",
    });
    expect(getUserReasonChipStyle("spam")).toMatchObject({ bg: "#fcffe5" });
  });

  it("getEventReasonChipStyle matches duplicate events", () => {
    expect(getEventReasonChipStyle("duplicate")).toMatchObject({
      label: "Duplicate Event",
    });
  });

  it("getIdeaReasonChipStyle matches intellectual property", () => {
    expect(getIdeaReasonChipStyle("intellectual")).toMatchObject({
      label: "Intellectual\nproperty",
    });
  });

  it("getSpaceReasonChipStyle matches solicitation", () => {
    expect(getSpaceReasonChipStyle("solicitation")).toMatchObject({
      bg: "#e5f2ff",
      text: "#0a4e8c",
    });
  });

  it("getReasonChipStyle searches across all reason categories", () => {
    expect(getReasonChipStyle("harassment")).toMatchObject({ bg: "#fff4e4" });
    expect(getReasonChipStyle("totally unknown reason")).toMatchObject({
      bg: "#f7f7f7",
      text: "#6a6a6a",
    });
  });

  it("falls back to 'Other' for an unmatched reason", () => {
    expect(getUserReasonChipStyle(undefined).label).toBe("Other");
  });
});

describe("getSpaceCategoryChipStyle", () => {
  it("maps categories, including stem matches", () => {
    expect(getSpaceCategoryChipStyle("clubs")).toMatchObject({
      bg: "#e2e0f2",
      label: "Clubs",
    });
    // 'fraternit' stem matches 'Fraternities'/'Fraternity'.
    expect(getSpaceCategoryChipStyle("Fraternity")).toMatchObject({
      label: "Fraternities",
    });
  });

  it("falls back for unknown categories", () => {
    expect(getSpaceCategoryChipStyle("knitting circle")).toMatchObject({
      bg: "#eef0f1",
      label: "Knitting Circle",
    });
  });
});

describe("getAdminRoleChipStyle", () => {
  it("maps admin role display names (case-insensitive)", () => {
    expect(getAdminRoleChipStyle("School Admin")).toMatchObject({
      bg: "#cacaee",
      text: "#1c1cd3",
      label: "School Admin",
    });
    expect(getAdminRoleChipStyle("moderator")).toMatchObject({ bg: "#f0e3c4" });
  });

  it("falls back for unknown roles", () => {
    expect(getAdminRoleChipStyle("Owner")).toMatchObject({
      bg: "#eef0f1",
      label: "Owner",
    });
  });
});
