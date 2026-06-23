import { describe, it, expect } from "vitest";
import { queryClient, queryKeys } from "./queryClient";

type RetryFn = (failureCount: number, error: unknown) => boolean;

const httpError = (status: number) =>
  Object.assign(new Error(`HTTP ${status}`), { response: { status } });

describe("queryClient default options", () => {
  const defaults = queryClient.getDefaultOptions();

  it("uses the configured stale/gc times and disables focus refetch", () => {
    expect(defaults.queries?.staleTime).toBe(1000 * 60 * 5);
    expect(defaults.queries?.gcTime).toBe(1000 * 60 * 10);
    expect(defaults.queries?.refetchOnWindowFocus).toBe(false);
  });

  it("retries mutations once", () => {
    expect(defaults.mutations?.retry).toBe(1);
  });

  describe("query retry policy", () => {
    const retry = defaults.queries?.retry as RetryFn;

    it("never retries 4xx errors except 408", () => {
      expect(retry(0, httpError(400))).toBe(false);
      expect(retry(0, httpError(403))).toBe(false);
      expect(retry(0, httpError(404))).toBe(false);
      expect(retry(0, httpError(408))).toBe(true); // timeout is retryable
    });

    it("retries 5xx errors up to 3 attempts", () => {
      expect(retry(0, httpError(500))).toBe(true);
      expect(retry(2, httpError(503))).toBe(true);
      expect(retry(3, httpError(500))).toBe(false);
    });

    it("retries network errors with no response (until the cap)", () => {
      const networkError = new Error("Network Error");
      expect(retry(0, networkError)).toBe(true);
      expect(retry(3, networkError)).toBe(false);
    });
  });
});

describe("queryKeys factory", () => {
  it("builds stable, structured keys", () => {
    expect(queryKeys.campuses).toEqual(["campuses"]);
    expect(queryKeys.campus("abc")).toEqual(["campus", "abc"]);
    expect(queryKeys.students).toEqual(["students"]);
    expect(queryKeys.geofences("c1")).toEqual(["geofences", "c1"]);
    expect(queryKeys.ambassadors).toEqual(["ambassadors"]);
    expect(queryKeys.ambassador("a1")).toEqual(["ambassador", "a1"]);
    expect(queryKeys.ambassadorsByCampus("c1")).toEqual([
      "ambassadors",
      "campus",
      "c1",
    ]);
  });
});
