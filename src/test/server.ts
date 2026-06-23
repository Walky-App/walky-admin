import { setupServer } from "msw/node";
import { handlers } from "./handlers";

/**
 * The shared MSW server instance used across the whole test suite.
 *
 * Default (happy-path) handlers live in `./handlers`. Individual tests layer
 * scenario-specific responses on top with `server.use(...)`, e.g.:
 *
 *   import { server } from "@/test/server";
 *   import { http, HttpResponse } from "msw";
 *
 *   server.use(
 *     http.get(`${API_BASE}/admin/users`, () =>
 *       HttpResponse.json({ users: [], pagination: {} }, { status: 500 })
 *     )
 *   );
 *
 * `server.resetHandlers()` runs after every test (see setup.ts), so overrides
 * never leak between tests.
 */
export const server = setupServer(...handlers);
