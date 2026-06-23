import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useMediaQuery } from "./useMediaQuery";

/**
 * useMediaQuery reads `window.matchMedia(query).matches` and subscribes to its
 * "change" event. We replace matchMedia with a controllable fake whose
 * `matches` is a live getter and whose listeners we can fire by hand.
 */
describe("useMediaQuery", () => {
  let listeners: Set<() => void>;
  let currentMatches: boolean;
  const original = window.matchMedia;

  beforeEach(() => {
    listeners = new Set();
    currentMatches = false;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      get matches() {
        return currentMatches;
      },
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: (_event: string, cb: () => void) => listeners.add(cb),
      removeEventListener: (_event: string, cb: () => void) =>
        listeners.delete(cb),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    window.matchMedia = original;
  });

  it("returns the initial match state", () => {
    currentMatches = true;
    const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));
    expect(result.current).toBe(true);
  });

  it("returns false when the query does not match", () => {
    currentMatches = false;
    const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));
    expect(result.current).toBe(false);
  });

  it("updates when the media query fires a change", () => {
    currentMatches = false;
    const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));
    expect(result.current).toBe(false);

    act(() => {
      currentMatches = true;
      listeners.forEach((l) => l());
    });
    expect(result.current).toBe(true);
  });

  it("removes its listener on unmount", () => {
    const { unmount } = renderHook(() => useMediaQuery("(max-width: 768px)"));
    expect(listeners.size).toBe(1);
    unmount();
    expect(listeners.size).toBe(0);
  });
});
