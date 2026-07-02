# AI Reference — walky-admin

> Dense reference for LLMs. Directory map, key files (absolute paths), conventions,
> main flows, rules, and pitfalls. The source of truth is the code; see also
> [conventions.md](./conventions.md) · [development.md](./development.md) · [troubleshooting.md](./troubleshooting.md).

## Table of Contents

- [Identity](#identidade)
- [Stack](#stack)
- [Directory map](#directory-map)
- [Key files](#arquivos-chave)
- [Auth flow (login → route guard)](#fluxo-de-auth-login--guarda-de-rota)
- [RBAC flow (permissions)](#rbac-flow-permissions)
- [Data flow (React Query + services + generated API)](#fluxo-de-dados-react-query--services--api-gerada)
- [Required conventions](#required-conventions)
- [Commands](#comandos)
- [Key rules](#regras-chave)
- [Limitations / pitfalls](#limitations--pitfalls)

---

## Identity

Admin panel for the **Walky** ecosystem (campus social network). Audience: `super_admin`,
`school_admin`, `campus_admin`, `moderator`, `walky_internal`. Client of `walky-backend` (derives its
types from Swagger). Deployed on Vercel. Repo at `/Volumes/SSDDEV/DEV_PROJETOS/walky-admin`.
Ecosystem context: `/Volumes/SSDDEV/DEV_PROJETOS/walky-admin/AI_CONTEXT.md`.

## Stack

React 19.1 · TypeScript 5.8 (strict, project references) · Vite 7 · React Router 7.6 · CoreUI 5.7 +
React Bootstrap 2.10 · React Query 5.82 · Axios 1.10 · Recharts 3.4 + Three.js (Playground) · Vitest 4
+ RTL + MSW 2 · Sass. Node ≥ 20 (Vercel/`.nvmrc`: 22). Effective package manager: **yarn** (husky/CI).

## Directory map

```
/Volumes/SSDDEV/DEV_PROJETOS/walky-admin/
├── src/
│   ├── API/                 # HTTP client GENERATED from Swagger (WalkyAPI.ts) + index.ts (Axios, interceptors)
│   ├── components-v2/        # 52 reusable components (folder = .tsx + .css + index.ts)
│   │   └── index.ts          # barrel aggregator
│   ├── pages-v2/             # feature screens (Admin, Campus, Dashboard, Events, Ideas, Spaces,
│   │                         #  Moderation, Playground, LoginV2, RecoverPasswordV2, ForcePasswordChange)
│   ├── layout-v2/            # LayoutV2 + SidebarV2 + TopbarV2
│   ├── routes/v2Routes.tsx   # lazy routes + PermissionGuard
│   ├── contexts/             # School, Campus, Dashboard, DeactivatedUser, Theme
│   ├── hooks/                # useAuth, usePermissions, useDebounce, useMediaQuery, useTheme, filters
│   ├── lib/                  # permissions.ts, queryClient.ts, logger.ts, utils/
│   ├── services/             # userService, campusService, reportService, rolesService, ... (12)
│   ├── styles-v2/            # design-tokens.css/.ts, theme-variables.css, global.css, ThemeComponents.css
│   ├── theme.ts              # getTheme(isDark) → color object
│   ├── test/                 # setup.ts, test-utils.tsx, server.ts, handlers.ts, factories.ts
│   ├── App.tsx / main.tsx    # shell + provider mounting
│   ├── assets-v2/ types/     # new assets, types
│   └── (legacy) components/ pages/ assets/  # being deprecated
├── scripts/                  # check-test-ids.js, check-accessibility.js, generate-icons/images.cjs
├── docs/                     # conventions/development/troubleshooting/ai-reference + TESTING.md
├── .husky/pre-commit         # build → testids → a11y → lint-staged
├── .github/workflows/        # code-quality.yml, test.yml
├── eslint.config.js vite.config.ts vitest.config.ts vercel.json tsconfig*.json
└── .env / .env.example
```

## Key files

| Path | Role |
|------|------|
| `src/main.tsx` | Mounts providers: `QueryClientProvider` → `ThemeProvider` → `SchoolProvider` → `BrowserRouter` → `App`. Imports CoreUI CSS + V2 tokens. |
| `src/App.tsx` | Public routes (`/login`, `/recover-password`, `/force-password-change`) + `AuthGuard` wrapping `V2Routes`. Toaster (`react-hot-toast`). Toggles `body.dark-mode`. |
| `src/routes/v2Routes.tsx` | All authenticated routes, lazy, under `LayoutV2`, each with a `PermissionGuard`. `CampusProvider`/`DashboardProvider` providers. |
| `src/API/index.ts` | Creates `apiClient` (from `WalkyAPI.ts`), strips `/api` from the baseURL, interceptors: Bearer token, CSRF on non-GET, 401→logout, 403(`ACCOUNT_DEACTIVATED`)→modal. Exports `apiClient`, `httpClient`, `API`. |
| `src/API/WalkyAPI.ts` | Typed Axios client, GENERATED (do not edit). |
| `src/lib/permissions.ts` | `permissionMatrix`, `hasPermission`, `routeResourceMap`, `roleHierarchy`, display-name maps. |
| `src/hooks/useAuth.ts` | Reads `localStorage` (`token`,`user`), syncs across tabs (`storage`/`auth:user-updated`), `updateUser`. |
| `src/hooks/usePermissions.ts` | `can/canRead/canUpdate/...`, flags `isSuperAdmin/isModerator/...`. |
| `src/components-v2/AuthGuard/AuthGuard.tsx` | Redirects unauthenticated users to `/login`; `null` while `isLoading`. |
| `src/components-v2/PermissionGuard/PermissionGuard.tsx` | Guards by `resource`+`action`; `fallback` `hidden`/`redirect`/node. `withPermission` HOC. |
| `src/lib/queryClient.ts` | QueryClient (stale 5min, gc 10min, retry skips 4xx≠408) + `queryKeys` factory. |
| `src/lib/logger.ts` | Console wrapper (the only authorized one); DEV-gated for debug/info. |
| `src/styles-v2/design-tokens.css` | `--v2-*` tokens + dark overrides under `[data-coreui-theme="dark"]`/`[data-theme="dark"]`. |
| `src/contexts/ThemeProvider.tsx` | Theme state, sets attributes on `<html>`, injects `--app-*`. |
| `src/contexts/SchoolContext.tsx` / `CampusContext.tsx` | Multi-tenant selection (school/campus), persisted in `localStorage`. |
| `src/test/test-utils.tsx` | `renderWithProviders` with the real provider stack + MemoryRouter. |
| `src/test/handlers.ts` / `server.ts` / `factories.ts` | MSW defaults + server + builders. |
| `scripts/check-test-ids.js` / `check-accessibility.js` | Quality gates (pre-commit + CI). |

## Auth flow (login → route guard)

- Login (`src/pages-v2/LoginV2/`) writes `token` and `user` to `localStorage`; 2FA optional; forced
  password change at `/force-password-change`.
- `useAuth` derives `isAuthenticated` from `localStorage`; listens for `storage` (multi-tab) and the custom
  `auth:user-updated` event. `updateUser(null)` performs a local logout.
- `AuthGuard` (in `App.tsx`, route `/*`) blocks unauthenticated users; renders `null` during `isLoading`
  (avoids a redirect flash on refresh).
- Interceptors (`src/API/index.ts`): inject `Authorization: Bearer <token>`; on **401** they remove the token
  and navigate to `/login`. **There is no automatic token refresh in this repo.**
- CSRF: on non-GET requests, reads a cookie (`csrf_cookie_rr`/`XSRF-TOKEN`/…) and sends `X-CSRF-Token`/
  `X-XSRF-Token`; Axios with `withCredentials: true`.
- 403 with `code` `ACCOUNT_DEACTIVATED`/`USER_DEACTIVATED` → `triggerDeactivatedModal()`.

## RBAC flow (permissions)

- Roles: `super_admin`, `school_admin`, `campus_admin`, `moderator`, `walky_internal`.
- Actions: `read`, `create`, `update`, `delete`, `export`, `manage`.
- `permissionMatrix[role][resource] → ResourcePermission` (`src/lib/permissions.ts`).
  E.g., `super_admin.events_manager = readUpdateDeleteExport`; `moderator.active_students = noPermissions`,
  but `moderator.report_safety = readUpdateExport`; `walky_internal` is read-only (no reports).
- Routes: `PermissionGuard resource=... fallback="redirect"` in `v2Routes.tsx`. `routeResourceMap`
  maps path→resource (`canAccessRoute`); an unmapped path is allowed by default.
- Inline UI: `PermissionGuard fallback="hidden"` or `withPermission`; or `usePermissions().can(...)`.
- Role-assignment hierarchy: `roleHierarchy` (super→school/campus/moderator; school→campus/
  moderator; campus→moderator). Helpers `getAssignableRoles`, `canAssignRole(ByDisplayName)`.

## Data flow (React Query + services + generated API)

```
Component (pages-v2)
  └─ useQuery({ queryKey: [feature, ...filters, school?._id, campus?._id], queryFn })
       └─ service (src/services/*)  ── or ──  apiClient.api.<method>() directly
            └─ apiClient (src/API/index.ts)  # Axios + interceptors
                 └─ WalkyAPI.ts (GENERATED from the backend's swagger.json)
                      └─ walky-backend
```

- The `queryKey` includes **all** filters + `selectedSchool?._id`/`selectedCampus?._id` (multi-tenant).
- The multi-tenant filter passes `campus_id`/`schoolId` **explicitly per query**; the hooks
  `useCampusFilter`/`useSchoolFilter`/`useDashboardPrefetch` are defined but not invoked.
- Text searches go through `useDebounce` (500 ms) before the key.
- Pagination: `placeholderData: keepPreviousData`.
- Services normalize the response (optional fields with `??`/`||`), log via `logger`, and `throw` on error.
- The `School`/`Campus` contexts select the tenant; persisted in `localStorage` (`selectedSchool`, etc.).

## Required conventions

- New code goes in **`-v2`** folders (components-v2/pages-v2/layout-v2/styles-v2/assets-v2). Legacy is EOL.
- A component = a `Name/` folder with `Name.tsx` + `Name.css` (classes prefixed `name-*`, no CSS Modules) + `index.ts`.
- `data-testid` on every `<button>`/`<input>`/`<form>` in pages-v2/components-v2.
- a11y WCAG 2.1 AA (alt, aria-label, labels, aria-checked/selected, focus styles).
- Import via the root barrel (`../../../components-v2`), not the internal file.
- Server state via React Query; never `console.*` (use `logger`).
- Colors/spacing via `--v2-*` tokens so dark mode is inherited.
- Tests alongside (`Foo.test.tsx`), render with `renderWithProviders`, MSW for the network.

## Commands

`yarn dev` (5173) · `yarn build` (`tsc -b && vite build`) · `yarn test [--run]` · `yarn test:coverage`
· `yarn check:testids` · `yarn check:a11y` · `yarn check:all` · `yarn lint` · `yarn type-check`
· `yarn generate:api` (requires `../walky-backend/swagger.json`) · `generate:icons`/`generate:images`.
Env: `VITE_API_BASE_URL` (must end in `/api`), `VITE_APP_NAME`, `VITE_ENV`, optional `VITE_GOOGLE_MAPS_API_KEY`,
`VITE_SENTRY_DSN`.

## Key rules

- ESLint: `no-console: error`; `@typescript-eslint/no-explicit-any: warn` (exempt in `src/API/WalkyAPI.ts`,
  `Api.ts`); `no-unused-vars` ignores the `_` prefix.
- `WalkyAPI.ts` and friends are **generated** — never hand-edit; regenerate via `generate:api`.
- `VITE_API_BASE_URL` must end in `/api` (the client strips `/api` for the OpenAPI client).
- Pre-commit and CI block on testids, a11y, tests.
- `PermissionGuard`/`AuthGuard` return `null` during `isLoading` (not a bug, avoids flash).
- Vercel: SPA rewrite in `vercel.json`; `BrowserRouter` in `main.tsx`.

## Limitations / pitfalls

- **No token refresh**: a 401 always logs you out (troubleshooting.md).
- **Env target**: your local `.env` (git-ignored) may point to staging; the committed `.env.example`
  defaults to production — switch to local in dev.
- Two theme systems coexist (CoreUI `data-coreui-theme` + V2 `--v2-*` tokens); hardcoded colors don't
  inherit dark mode.
- `generate:api` depends on the backend cloned alongside (`../walky-backend/swagger.json`) and kept current.
- `handlers.ts`/`test-utils.tsx` must keep up with new endpoints/providers, or tests break
  (an unmocked request **fails** on purpose).
- Legacy folders (`components/`, `pages/`) still exist; don't write new code in them.
- The repo's README.md is a generic CoreUI tutorial — the real context is in `AI_CONTEXT.md` and these docs.
- Coverage has a *ratchet* in `vitest.config.ts` (thresholds only go up); lowering coverage breaks the build.
