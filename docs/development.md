# Development Guide — walky-admin

> How to run, add screens, regenerate types, test, and pass the required checks.
> Stack: React 19 · TypeScript 5.8 · Vite 7 · CoreUI 5 · React Router 7 · React Query 5 · Vitest 4.

## Table of Contents

- [1. Prerequisites](#1-prerequisites)
- [2. Running locally](#2-rodar-localmente)
- [3. Environment variables](#3-environment-variables)
- [4. Adding a new page (lazy route + PermissionGuard)](#4-adding-a-new-page-lazy-route--permissionguard)
- [5. Regenerating API types (`generate:api`)](#5-regenerar-tipos-da-api-generateapi)
- [6. Testing](#6-testes)
- [7. Required checks (`check:all`)](#7-required-checks-checkall)
- [8. Available scripts](#8-available-scripts)
- [9. Common errors](#9-erros-comuns)

Cross-links: [conventions.md](./conventions.md) · [troubleshooting.md](./troubleshooting.md) · [ai-reference.md](./ai-reference.md) · [TESTING.md](./TESTING.md)

---

## 1. Prerequisites

- **Node ≥ 20** (`package.json` → `engines`; `.nvmrc` = `22`; Vercel uses Node 22).
- Package manager: the husky/CI scripts use **yarn**, but `npm` works too (the README uses `npm run dev`).
- Backend (`walky-backend`) running locally for real data and for `generate:api`.

## 2. Running locally

```bash
yarn install         # or npm install
yarn dev             # Vite dev server at http://localhost:5173
```

Point at the **local backend**. The Walky backend runs on `8080` or `8081` (in this environment the
mobile app uses `8080`; the backend also exposes `8081`). The client always appends/strips `/api`
depending on the route (see `src/API/index.ts`), so `VITE_API_BASE_URL` **must end in `/api`**:

```env
# .env
VITE_API_BASE_URL=http://localhost:8080/api   # or :8081/api
VITE_APP_NAME=Walky Admin
VITE_ENV=development
```

> ⚠️ Your local `.env` (git-ignored) may point to **staging** (`https://staging.walkyapp.com/api`);
> the committed `.env.example` defaults to production. For local development, switch it to `localhost`.
> Restart `yarn dev` after editing `.env` (Vite injects env at boot).

## 3. Environment variables

| Variable | Required | Usage |
|----------|-------------|-----|
| `VITE_API_BASE_URL` | yes | Axios base URL. Prod `https://api.walkyapp.com/api`, staging `https://staging.walkyapp.com/api`, local `http://localhost:8080|8081/api`. Must end in `/api`. |
| `VITE_APP_NAME` | yes | Displayed name (`Walky Admin`). |
| `VITE_ENV` | yes | `development` \| `staging` \| `production`. |
| `VITE_GOOGLE_MAPS_API_KEY` | optional | Maps (campus geofences). |
| `VITE_SENTRY_DSN` | optional | Monitoring. |

Template in `.env.example`. Only variables with the `VITE_` prefix reach the bundle.

## 4. Adding a new page (lazy route + PermissionGuard)

The actual flow, following the pattern in `src/routes/v2Routes.tsx`.

**4.1** Create the page folder at `src/pages-v2/<Feature>/<Screen>/` with `Screen.tsx` + `Screen.css`.
Use `<main className="...">` (a11y) and `data-testid` on interactive elements:

```tsx
// src/pages-v2/Reports/ReportsList/ReportsList.tsx
import "./ReportsList.css";
export const ReportsList: React.FC = () => {
  return <main className="reports-list-container">{/* ... */}</main>;
};
```

**4.2** Export it from the feature barrel `src/pages-v2/Reports/index.ts`:

```ts
export { ReportsList } from "./ReportsList/ReportsList";
```

**4.3** Register the route in `src/routes/v2Routes.tsx` with `React.lazy` (named export → unwrap to
`default`) and wrap it with `PermissionGuard`:

```tsx
const ReportsList = lazy(() =>
  import("../pages-v2/Reports").then((m) => ({ default: m.ReportsList }))
);
// ...inside <Route path="/" element={<LayoutV2 />}>
<Route path="reports" element={
  <PermissionGuard resource="report_history" fallback="redirect">
    <ReportsList />
  </PermissionGuard>
} />
```

**4.4** If the route has its own RBAC, add the mapping in `src/lib/permissions.ts`:
include the `PermissionResource` in the union, define the row in each role of `permissionMatrix`, and
register the path in `routeResourceMap` (e.g., `'/reports': 'report_history'`).

**4.5** Add the navigation item in `src/layout-v2/SidebarV2/SidebarV2.tsx` (array of `label`/`path`).

**4.6** Create the test `ReportsList.test.tsx` alongside it (see section 6).

## 5. Regenerating API types (`generate:api`)

The typed HTTP client is **generated** from the backend Swagger — do not edit it by hand.

```bash
yarn generate:api
# = npx swagger-typescript-api generate -p ../walky-backend/swagger.json \
#     -o ./src/API --axios --name WalkyAPI.ts
```

- **Requires** `../walky-backend/swagger.json` to exist (backend repo cloned alongside). Generate/update
  that file in the backend first (the backend exposes Swagger at `http://localhost:8081/api-docs/`).
- Output: `src/API/WalkyAPI.ts` (+ `Api.ts`, `data-contracts.ts`, `http-client.ts`). These files are
  **exempt** from `no-explicit-any` in ESLint (`eslint.config.js`) and from coverage (`vitest.config.ts`).
- Whenever the backend contract changes, regenerate and update the consuming services/pages.
- Consume it via `apiClient` (`src/API/index.ts`), which applies the token/CSRF/401/403 interceptors.

## 6. Testing

Vitest + React Testing Library + MSW. Full guide in [`docs/TESTING.md`](./TESTING.md).

```bash
yarn test              # watch
yarn test --run        # single run (what CI uses)
yarn test:ui           # Vitest UI
yarn test:coverage     # coverage (text + html in /coverage)
```

- **One test alongside the source**: `Foo.tsx` → `Foo.test.tsx`.
- Render with `renderWithProviders` (`src/test/test-utils.tsx`) — it mounts the real provider stack
  (a fresh QueryClient per render, Theme, School, Campus, Dashboard, DeactivatedUser, MemoryRouter):

```tsx
import { renderWithProviders, screen } from "@/test/test-utils";
renderWithProviders(<EventsManager />, { route: "/events" });
expect(await screen.findByRole("table")).toBeInTheDocument();
```

- **MSW**: default handlers in `src/test/handlers.ts` (base = `API_BASE`, derived from `VITE_API_BASE_URL
  ?? http://localhost:8080/api`). Override per test with `server.use(...)`; unmocked requests **fail**
  the test on purpose. Factories in `src/test/factories.ts` (`mockUser`, `mockSchool`, `mockCampus`, …).
- **Auth in tests**: seed `localStorage` (`token` + `user`) before rendering; it's cleared after each test.
- Query by role/label/testid, never by CSS class. Coverage has a *ratchet* in `vitest.config.ts`
  (it can only go up).

## 7. Required checks (`check:all`)

```bash
yarn check:all   # = check:testids && check:a11y && test --run
```

They also run on **pre-commit** (`.husky/pre-commit`: build → testids → a11y → lint-staged) and in
**CI** (`.github/workflows/code-quality.yml` and `test.yml`, triggered on PRs to `main/develop/staging/feat/*`).

- `yarn check:testids` — a `<button>`/`<input>`/`<form>` without `data-testid` = failure. See
  [conventions.md §4](./conventions.md#4-required-data-testid-checktestids).
- `yarn check:a11y` — WCAG 2.1 AA rules. See [conventions.md §5](./conventions.md#5-acessibilidade-checka11y).
- `yarn test -- --run` — Vitest suite (hard gate in CI).
- `yarn lint` (ESLint) and `yarn type-check` (`tsc -b`) run separately; `no-console` is an **error**.

## 8. Available scripts

| Script | Does |
|--------|-----|
| `dev` | Vite dev server (5173). |
| `build` | `tsc -b && vite build` → `dist/`. |
| `preview` | Serves the build. |
| `lint` | ESLint across the whole repo. |
| `type-check` / `tsc` | Type-check via project references. |
| `test` / `test:ui` / `test:coverage` | Vitest. |
| `check:testids` / `check:a11y` / `check:all` | Quality gates. |
| `generate:api` | Regenerates the API client from the backend Swagger. |
| `generate:icons` / `generate:images` | Generate assets (`scripts/generate-*.cjs`). |
| `clean` | `clean-build.sh`. |

Deploy: **Vercel** (`vercel.json` → `framework: vite`, `outputDirectory: dist`, SPA rewrite from
`/(.*)` to `/index.html`, `NODE_VERSION: 22`).

## 9. Common errors

- **No data / 401 loop**: `VITE_API_BASE_URL` is wrong or doesn't end in `/api`; or it points to
  staging/prod without a valid token. Details in [troubleshooting.md](./troubleshooting.md).
- **Stale API types**: run `yarn generate:api` (requires the backend `swagger.json`).
- **Commit blocked**: a missing `data-testid` or an a11y violation — run `yarn check:all` first.
- **`console.*` rejected by lint**: use the `logger` from `src/lib/logger.ts`.
- **Edited `.env` and nothing changed**: restart `yarn dev` (Vite injects env at boot).
