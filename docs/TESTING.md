# Testing Guide

This project uses **Vitest** + **React Testing Library** + **MSW** for unit and
integration tests. The goal is a regression safety net: every screen, service,
hook and shared component gets covered so refactors don't silently break things.

## Running tests

```bash
yarn test            # watch mode
yarn test --run      # single run (what CI uses)
yarn test:ui         # Vitest UI
yarn test:coverage   # coverage report (text + html in /coverage)
yarn check:all       # test ids + a11y + tests (full pre-merge check)
```

CI (`.github/workflows/test.yml`) runs `yarn test --run` as a **hard gate** on
every PR. Type-check, lint and the a11y/test-id scripts run as informational
(soft) gates for now — flip off `continue-on-error` once the repo is clean.

## The test harness (`src/test/`)

| File | Purpose |
|------|---------|
| `setup.ts` | Global setup: starts MSW, polyfills `matchMedia`/observers/clipboard, resets DOM + storage + mocks between tests. |
| `test-utils.tsx` | `renderWithProviders` / `renderHookWithProviders` — mount inside the real provider stack (React Query, Theme, School, Campus, Dashboard, DeactivatedUser, Router). |
| `server.ts` + `handlers.ts` | The shared MSW server and default request handlers. |
| `factories.ts` | Test-data builders (`mockUser`, `mockSchool`, `mockCampus`, `mockEvent`, `mockReport`, `mockPagination`). |

### Rendering a component

```tsx
import { renderWithProviders, screen } from "@/test/test-utils";

it("renders the events list", async () => {
  renderWithProviders(<EventsManager />, { route: "/events" });
  expect(await screen.findByRole("table")).toBeInTheDocument();
});
```

A fresh `QueryClient` (retries disabled) is created per render, so cache never
leaks between tests. It's returned if you need to seed/inspect it:

```tsx
const { queryClient } = renderWithProviders(<Foo />);
queryClient.setQueryData(["x"], 1);
```

### Mocking API responses

Default handlers live in `handlers.ts`. Override per-test with `server.use(...)`;
overrides are reset automatically after each test. Unhandled requests **fail
the test** (by design — a missing mock should be loud).

```tsx
import { server } from "@/test/server";
import { API_BASE } from "@/test/handlers";
import { http, HttpResponse } from "msw";

server.use(
  http.get(`${API_BASE}/admin/users`, () =>
    HttpResponse.json({ users: [], pagination: { page: 1, total: 0 } })
  )
);
```

### Authenticated tests

Auth is read from `localStorage`. Seed it before rendering:

```tsx
import { mockUser } from "@/test/factories";

localStorage.setItem("token", "test-token");
localStorage.setItem("user", JSON.stringify(mockUser({ role: "moderator" })));
```

`localStorage` is cleared after every test by `setup.ts`.

## Conventions

- **One test file next to its source**: `Foo.tsx` → `Foo.test.tsx`.
- **Query by role / label / test-id**, not by CSS classes. Interactive elements
  already carry `data-testid` (enforced by `scripts/check-test-ids.js`).
- **Pin behavior, document quirks.** When you lock in current-but-surprising
  behavior, leave a comment so a future change is a conscious decision.
- **Pure logic first.** Functions in `lib/` and `utils/` are the cheapest, most
  valuable tests — no DOM, no mocking.
- **Integration over snapshots.** Prefer asserting visible behavior (loading →
  data → empty → error) over brittle DOM snapshots.

## Rollout phases

This suite is being built in phases (see the testing plan):

- **Phase 0 — Foundation** ✅ harness, MSW, factories, CI gate.
- **Phase 1 — Pure logic** ✅ permissions matrix, chip/icon/date/name utils,
  queryClient, simple hooks.
- **Phase 2 — Services** — one spec per `src/services/*` + API interceptors.
- **Phase 3 — Hooks/contexts/guards** — `useAuth`, `usePermissions`, filters,
  `AuthGuard`, `PermissionGuard`.
- **Phase 4 — Components & modals** — primitives, action modals, detail modals.
- **Phase 5 — Screens** — archetype-based integration tests (Manager, Insights,
  Auth, complex workflows).
- **Phase 6 — Routing** — guarded routes, redirects, 404.

As each phase lands, raise the coverage floor in `vitest.config.ts`
(`coverage.thresholds`) so coverage can only go up.
