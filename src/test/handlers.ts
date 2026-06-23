import { http, HttpResponse } from "msw";

/**
 * Base URL the API client points at during tests.
 *
 * Mirrors src/API/index.ts: the configured base is
 * `VITE_API_BASE_URL ?? "http://localhost:8080/api"`, and the generated
 * HttpClient strips a trailing `/api`, so actual requests are issued against
 * `http://localhost:8080`. We expose the stripped root here so handlers can be
 * written as `${API_BASE}/admin/...`.
 *
 * Keep this in sync if the API base URL convention changes.
 */
export const API_BASE = (
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:8080/api"
).replace(/\/api\/?$/, "");

/**
 * Default happy-path handlers. Intentionally small — most endpoint behaviour is
 * asserted per-test via `server.use(...)` overrides. Add a handler here only
 * when a response is needed by *many* tests (e.g. a baseline list endpoint),
 * so the default surface stays predictable.
 *
 * `onUnhandledRequest: "error"` (configured in setup.ts) means any request not
 * matched here or by a per-test override fails the test with a clear message —
 * that is by design, so missing mocks surface immediately.
 */
export const handlers = [
  // Health/ping style endpoints that some bootstrapping code may hit can be
  // declared here as they are discovered. Left empty by default.
  http.get(`${API_BASE}/health`, () =>
    HttpResponse.json({ status: "ok" })
  ),
];
