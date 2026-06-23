import { describe, it, expect } from "vitest";
import { getReportTypeIcon } from "./reportTypeIcon";

describe("getReportTypeIcon", () => {
  it("maps each known report type to its icon", () => {
    expect(getReportTypeIcon("user")).toBe("double-users-icon");
    expect(getReportTypeIcon("student")).toBe("double-users-icon");
    expect(getReportTypeIcon("idea")).toBe("ideas-icons");
    expect(getReportTypeIcon("space")).toBe("space-icon");
    expect(getReportTypeIcon("message")).toBe("chat-icon");
    expect(getReportTypeIcon("event")).toBe("public-event-icon");
  });

  it("is case-insensitive and matches substrings", () => {
    expect(getReportTypeIcon("USER")).toBe("double-users-icon");
    expect(getReportTypeIcon("Reported Idea")).toBe("ideas-icons");
    expect(getReportTypeIcon("public_event_report")).toBe("public-event-icon");
  });

  it("prefers user/student over later matches when both are present", () => {
    // 'student' is checked before 'message'.
    expect(getReportTypeIcon("student message")).toBe("double-users-icon");
  });

  it("falls back to the default icon for unknown/empty input", () => {
    expect(getReportTypeIcon("something else")).toBe("nd-report-icon");
    expect(getReportTypeIcon("")).toBe("nd-report-icon");
    expect(getReportTypeIcon(undefined)).toBe("nd-report-icon");
  });
});
