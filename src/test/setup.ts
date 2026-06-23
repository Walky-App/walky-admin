import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "./server";

/**
 * Global test setup. Runs once before the whole suite (provider config in
 * vitest.config.ts points `setupFiles` here).
 *
 * Responsibilities:
 *  - Stand up the MSW request-mocking server so no test ever touches a real
 *    backend. Unhandled requests fail loudly so a missing handler is obvious.
 *  - Polyfill browser APIs that jsdom does not implement but our components
 *    rely on (matchMedia, ResizeObserver, IntersectionObserver, scrollTo,
 *    clipboard). Without these, ThemeProvider / charts / dropdowns throw on
 *    mount.
 *  - Reset all shared state between tests (DOM, MSW handlers, localStorage,
 *    sessionStorage, mocks) so tests are deterministic and order-independent.
 */

// ---------------------------------------------------------------------------
// MSW lifecycle
// ---------------------------------------------------------------------------
beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  localStorage.clear();
  sessionStorage.clear();
  vi.clearAllMocks();
});

afterAll(() => {
  server.close();
});

// ---------------------------------------------------------------------------
// jsdom polyfills
// ---------------------------------------------------------------------------

// window.matchMedia — used by ThemeProvider (prefers-color-scheme) and the
// useMediaQuery hook. Default to "not matching" (light theme / desktop). Tests
// that care about a specific query override this with their own mock.
vi.stubGlobal(
  "matchMedia",
  vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated, kept for safety
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
);

// ResizeObserver / IntersectionObserver — recharts, simplebar and some CoreUI
// widgets instantiate these on mount.
class MockObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}
vi.stubGlobal("ResizeObserver", MockObserver);
vi.stubGlobal("IntersectionObserver", MockObserver);

// scrollTo — jsdom does not implement it.
vi.stubGlobal("scrollTo", vi.fn());
if (typeof Element !== "undefined" && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}

// navigator.clipboard — used by CopyableId. Defined as configurable so tests
// can spy on writeText.
Object.defineProperty(navigator, "clipboard", {
  configurable: true,
  value: { writeText: vi.fn().mockResolvedValue(undefined) },
});
