# Walky Admin — Folder Structure

> What each important directory contains and **why**. Focused on `src/`, on the meaning of the
> **`-v2`** suffix, and on the boundaries between the data layer, RBAC, UI, and theme.

## Table of Contents

- [1. Repository root](#1-repository-root)
- [2. `src/` — general map](#2-src--general-map)
- [3. The `-v2` suffix — why it exists](#3-the--v2-suffix--why-it-exists)
- [4. `API/` — Swagger-generated client](#4-api--swagger-generated-client)
- [5. `services/` — service layer](#5-services--service-layer)
- [6. `lib/` — permissions, query, logger, utils](#6-lib--permissions-query-logger-utils)
- [7. `contexts/` — UI/selection state](#7-contexts--uiselection-state)
- [8. `hooks/` — auth, permissions, filters, theme](#8-hooks--auth-permissions-filters-theme)
- [9. `layout-v2/` — shell (Sidebar + Topbar)](#9-layout-v2--shell-sidebar--topbar)
- [10. `components-v2/` — component library](#10-components-v2--component-library)
- [11. `pages-v2/` — the screens](#11-pages-v2--the-screens)
- [12. `routes/` — route map](#12-routes--route-map)
- [13. `types/` — hand-written types](#13-types--hand-written-types)
- [14. `styles-v2/` and `theme.ts`](#14-styles-v2-and-themets)
- [15. `test/`, `scripts/`, `docs/`](#15-test-scripts-docs)
- [Cross-links](#cross-links)

---

## 1. Repository root

| Path | What it is |
|------|---------|
| `package.json` | The `admin-panel` package; scripts, deps (see [overview](./overview.md#6-full-stack-actual-versions-and-the-rationale)). |
| `vite.config.ts` | Vite config: react + svgr plugins; `esbuild.pure` strips console.* in prod; `manualChunks` (react-vendor/coreui/charts/query). |
| `vitest.config.ts` | Test config (jsdom, setup, V8 coverage with ratchet, `@ → src` alias). |
| `tsconfig*.json` | `tsconfig.json` (references) → `tsconfig.app.json` (app, `strict`, `noUnusedLocals`) + `tsconfig.node.json` (config files). |
| `eslint.config.js` | ESLint flat config (typescript-eslint + react-hooks/react-refresh). |
| `.env` / `.env.example` / `.env.template` | `VITE_*` env vars (see overview). |
| `.nvmrc` | Node **22**. |
| `vercel.json` | Vercel deploy: vite framework, SPA rewrite, `NODE_VERSION 22`. |
| `index.html` | Root HTML of the SPA (mounts `#root`). |
| `clean-build.sh` | Used in the pre-commit hook (lint-staged) and in the `clean` script. |
| `scripts/` | `generate-icons.cjs`, `generate-images.cjs`, `check-test-ids.js`, `check-accessibility.js`. |
| `docs/` | This documentation + `docs/admin/*` (backend controller docs) and `docs/TESTING.md`. |
| `public/`, `dist/`, `coverage/` | Static assets, build output, and coverage report. |

## 2. `src/` — general map

```
src/
├── main.tsx            # entry: providers (QueryClient→Theme→School→BrowserRouter→App)
├── App.tsx             # public routes vs. AuthGuard→V2Routes; Toaster
├── theme.ts            # getTheme(isDark) → app color object
├── index.css / App.css # base CSS
├── API/                # Swagger-GENERATED HTTP client + interceptors (index.ts)
├── services/           # service layer over apiClient (12 services)
├── lib/                # permissions, queryClient, logger, utils
├── contexts/           # Theme, School, Campus, Dashboard, DeactivatedUser
├── hooks/              # useAuth, usePermissions, useCampusFilter, useTheme, ...
├── types/              # hand-written TS types (extensions of the generated ones)
├── routes/             # v2Routes.tsx (lazy routes + PermissionGuard)
├── layout-v2/          # shell: LayoutV2 + SidebarV2 + TopbarV2
├── components-v2/      # 52 reusable components (guards, modals, tables, filters)
├── pages-v2/           # screens (Dashboard, Campus, Events, Spaces, Ideas, Moderation, Admin, ...)
├── styles-v2/          # design tokens (CSS vars + .ts), global.css
├── assets-v2/          # V2 design images/svg
├── assets/             # legacy assets (coexist)
└── test/               # setup + test helpers (Vitest/MSW)
```

## 3. The `-v2` suffix — why it exists

The `-v2` marks a **complete redesign of the UI layer**, done **without** rewriting the data
architecture. The split is clean:

| With `-v2` (redesigned UI layer) | Without `-v2` (preserved / generic foundation) |
|---|---|
| `components-v2/`, `pages-v2/`, `layout-v2/`, `styles-v2/`, `assets-v2/` | `API/`, `services/`, `lib/`, `contexts/`, `hooks/`, `types/`, `routes/`, `test/`, `assets/` |

In other words: the **presentation** (components, screens, layout, styles, Figma assets) was rebuilt
as a new V2 generation, while the **HTTP client, services, contexts, hooks, permissions, and types**
remain shared/stable. Signals in the code that confirm the migration:

- `App.tsx` redirects legacy `/v2/*` paths to the root (`V2RedirectHandler`) — the new paths became
  the standard and the old `/v2` prefix is rewritten.
- `assets/` (legacy) **coexists** with `assets-v2/` (new, with `README.md`, `images/`, `svg/`).
- `routes/v2Routes.tsx` (the only active routes file) mounts everything inside `layout-v2`.

> Practical rule when contributing: **new UI goes in `*-v2`**; data/state logic goes in the
> unsuffixed directories.

## 4. `API/` — Swagger-generated client

`src/API/` — the HTTP boundary with the backend. See details in
[architecture §4](./architecture.md#4-data-layer-generated-axios--services--react-query).

| File | Contents |
|---------|----------|
| `WalkyAPI.ts` | **Generated** (`swagger-typescript-api`, ~15k lines): the `Api` class (typed endpoints) + `HttpClient`. `// @ts-nocheck`. |
| `Api.ts`, `Admin.ts`, `Users.ts`, `Auth.ts`, `Analytics.ts`, `Ambassadors.ts`, `Audit.ts`, `Age.ts` | Generated modules (endpoint groupings by domain). |
| `data-contracts.ts` | **Generated**: data interfaces (Chat, Message, Idea, ...). |
| `http-client.ts` | **Generated**: base Axios wrapper (default `baseURL` `http://localhost:8081`). |
| `index.ts` | **Hand-written**: instantiates `apiClient`, strips `/api` from the baseURL, applies interceptors (Bearer, CSRF, 401→login, 403 deactivation). Exports `apiClient` (and a raw `API` axios). |

**Do not edit the generated files** — run `npm run generate:api` (reads `../walky-backend/swagger.json`).

## 5. `services/` — service layer

`src/services/` — 12 modules between the generated `apiClient` and the screens. Each one: imports
`apiClient` from `../API`, calls endpoints, normalizes the response, logs via `logger`.

| Service | Responsibility | Example endpoint |
|---------|------------------|------------------|
| `userService.ts` | Lists/manages users (pagination, school/campus/role filters); `UserWithRoles` type. | `adminUsersList` |
| `campusService.ts` | Lists/creates/updates campuses; maps `_id→id`. | `campusesList` |
| `schoolService.ts` | Schools; defines/re-exports the `School` type. | school list |
| `ambassadorService.ts` | Ambassadors (partial CRUD). | `ambassadors.ambassadorsList` (legacy namespace) |
| `analyticsService.ts` | Social health, wellbeing, KPIs, dashboard alerts. | `adminCampusMetricsSocialHealthList` |
| `reportService.ts` | Reports (filter by status/type) and banned users. | `adminReportsList` |
| `rolesService.ts` | Roles, permissions, role assignment. | `adminRolesList` |
| `interestService.ts` | Interests. | — |
| `placeService.ts` | Places/Spaces. | — |
| `placeTypeService.ts` | Place types. | — |
| `lockedUsersService.ts` | Locked users. | — |
| `campusSyncService.ts` | Campus data synchronization. | — |

## 6. `lib/` — permissions, query, logger, utils

`src/lib/` — the cross-cutting (non-UI) foundation.

| File | Role |
|---------|-------|
| `permissions.ts` | **RBAC**: `RoleName`/`PermissionResource`/`PermissionAction` types, `permissionMatrix` (5 roles × ~24 resources × 6 actions), helpers (`hasPermission`, `canAccessRoute`, `getAssignableRoles`), display-name maps. Source of truth for client-side access control. See [architecture §5.3](./architecture.md#53-permission-matrix). |
| `queryClient.ts` | React Query `QueryClient` (staleTime 5min, gcTime 10min, no retry on 4xx except 408) + `queryKeys` factory. |
| `logger.ts` | Console wrapper: `debug`/`info` only in dev; `warn`/`error` always. Avoids leaking PII in prod. |
| `utils/` | `dateUtils.ts`, `errors.ts`, `nameUtils.ts` (+ tests). Pure utilities. |
| `permissions.test.ts`, `queryClient.test.ts` | Tests for the critical pieces. |

## 7. `contexts/` — UI/selection state

`src/contexts/` — React Context for state that is **not** remote data (that lives in React Query).

| File | State / function |
|---------|-----------------|
| `SchoolContext.tsx` | Selected school (persisted to `localStorage`), available list. Multi-tenant. |
| `CampusContext.tsx` | Selected campus (persisted), available list. `Campus` type. |
| `DashboardContext.tsx` | The dashboards' `timePeriod` (default `"month"`). |
| `DeactivatedUserContext.tsx` | Deactivated-account flag + `handleLogout`; exposes `triggerDeactivatedModal()` (a global setter used by the interceptors, outside React). |
| `ThemeContext.ts` + `ThemeProvider.tsx` | Theme (dark/light) — see [§14](#14-styles-v2-and-themets). |
| `index.ts` | Barrel of exports. |

## 8. `hooks/` — auth, permissions, filters, theme

`src/hooks/`

| Hook | Role |
|------|-------|
| `useAuth.ts` | Reads `token`/`user` from `localStorage`; cross-tab sync (`storage` + `auth:user-updated` events); `isAuthenticated`, `hasRole`, `updateUser`. |
| `usePermissions.ts` | Wraps `lib/permissions`: `can/canRead/canUpdate/canExport/...` + `isSuperAdmin/...` flags. |
| `useCampusFilter.ts` | **Defined but not wired up.** Intended as an interceptor that would inject `campus_id` into the selected campus's requests (GET params / body). It is never invoked; in practice `campus_id` is passed explicitly per query. See [architecture §6](./architecture.md#6-multi-tenant-school-and-campus). |
| `useSchoolFilter.ts` | Analogous to `useCampusFilter` (for school) — also defined but not wired up. |
| `useTheme.ts` | Accesses `ThemeContext`. |
| `useDashboardPrefetch.ts` | Dashboard data prefetch — defined but not currently wired up. |
| `useDebounce.ts` / `useMediaQuery.ts` / `useToolTip.ts` | UI utilities (+ tests). |
| `index.ts` | Barrel. |

## 9. `layout-v2/` — shell (Sidebar + Topbar)

`src/layout-v2/` — the "shell" of the authenticated screens (rendered by `v2Routes` around the
`<Outlet/>`).

| File | Role |
|---------|-------|
| `LayoutV2.tsx` | Composes `SidebarV2` + `TopbarV2` + `<Outlet/>`; controls the sidebar's responsive visibility (auto-closes ≤992px, closes on route change on mobile); mounts the `DeactivatedUserModal`. |
| `SidebarV2/SidebarV2.tsx` | Navigation. **Filters items by permission** via `usePermissions().canRead(resource)`: an item without permission disappears; an empty submenu removes its parent. |
| `TopbarV2/TopbarV2.tsx` | **School/campus** selectors (`useSchool`/`useCampus`, fetching via `apiClient`), theme toggle, logout. |

## 10. `components-v2/` — component library

`src/components-v2/` — 52 reusable components (exported from `index.ts`). Categories:

- **Guards:** `AuthGuard`, `PermissionGuard` (+ `withPermission` HOC) — see
  [architecture §5.2](./architecture.md#52-guards).
- **Filters/search:** `FilterBar`, `FilterDropdown`, `MultiSelectFilterDropdown`, `SearchInput`,
  `StatusDropdown`, `ActionDropdown`.
- **Table/list:** `Pagination`, `NoData`, `SkeletonLoader`, `LastUpdated`, `CopyableId`, `Chip`,
  `Divider`, `Drawer`, `BoundaryAvatar`.
- **Export/charts:** `ExportButton` (CSV/PDF), `StackedBarChart`.
- **Modals (many):** user (`BanUserModal`, `UnbanUserModal`, `ActivateUserModal`,
  `DeactivateUserModal`, `DeleteAccountModal`, `StudentProfileModal`, `SendPasswordResetModal`,
  `LogoutAllDevicesModal`, `WriteNoteModal`), moderation (`FlagModal`, `FlagUserModal`,
  `UnflagModal`, `ReportDetailModal`, `ReportDetailsModal`), content (`EventDetailsModal`,
  `SpaceDetailsModal`, `IdeaDetailsModal`, `ScheduledEventsModal`, `ChangeCategoryModal`,
  `SeeAllInterestsModal`), admin/roles (`CreateMemberModal`, `RemoveMemberModal`,
  `ChangeRoleModal`, `RolePermissionsModal`, `AddAmbassadorModal`, `DeleteAmbassadorModal`),
  generic (`DeleteModal`, `UnsavedChangesModal`, `DeactivatedUserModal`).
- **Assets/toast:** `AssetIcon`, `AssetImage`, `CustomToast`, `utils`.

## 11. `pages-v2/` — the screens

`src/pages-v2/` — each route in [v2Routes](../src/routes/v2Routes.tsx) has its screen here. Subfolders
often have local `components/` + an `index.ts` barrel.

```
pages-v2/
├── Dashboard/            # 6 dashboards + components/
│   ├── Engagement/  PopularFeatures/  UserInteractions/
│   ├── Community/  StudentSafety/  StudentBehavior/
├── Campus/               # ActiveStudents, BannedStudents,
│                         #   DeactivatedStudents, DisengagedStudents
├── CampusBoundary/       # campus geofence/boundary component
├── Events/               # EventsManager, EventsInsights, CheckInAnalytics
├── Spaces/               # SpacesManager, SpacesInsights
├── Ideas/                # IdeasManager, IdeasInsights
├── Moderation/           # ReportSafety, ReportHistory
├── Admin/                # AdministratorSettings, Ambassadors,
│                         #   Campuses, RoleManagement (+ index.ts)
├── Playground/           # 14 experimental visualizations (Interest* + ActiveUsers*, Three.js)
├── LoginV2/              # login (2FA/OTP, force-password-change) + LoginV2.css
├── RecoverPasswordV2/    # RecoverPasswordV2 + VerifyCodeStep + ResetPasswordStep
└── ForcePasswordChange/  # forced password change on first login
```

> Note: `Dashboard` exposes the 6 panels via default export; `Campus`, `Events`, `Spaces`, `Ideas`,
> `Moderation`, `Admin` use named barrel exports (unwrapped in `v2Routes` with
> `.then(m => ({ default: m.Name }))`).

## 12. `routes/` — route map

`src/routes/v2Routes.tsx` — the only active routes file. Mounts `<LayoutV2/>` with the
**lazy-loaded** screens, each wrapped in `<PermissionGuard resource="..." fallback="redirect">`.
It also provides `CampusProvider` + `DashboardProvider` and handles legacy-path redirects
(`/campuses → /admin/campuses`, etc.). See [architecture §3](./architecture.md#3-routing-react-router-v7--lazy).

## 13. `types/` — hand-written types

`src/types/` — **hand-written** TS types that extend/combine the generated ones: `ambassador.ts`,
`analytics.ts`, `api.ts`, `campus.ts`, `place.ts`, `placeType.ts`, `report.ts`, `role.ts`. The
services (`services/*`) merge these types with those from `API/data-contracts.ts`/`WalkyAPI.ts` to
deliver to the screens the shape they expect.

## 14. `styles-v2/` and `theme.ts`

`src/styles-v2/` — a dual style system (CoreUI + V2 tokens):

| File | Contents |
|---------|----------|
| `design-tokens.css` / `design-tokens.ts` | Tokens (spacing, cornerRadius, colors, ...) auto-generated from Figma — CSS vars and TS version. |
| `theme-variables.css` | Theme variables (light/dark). |
| `ThemeComponents.css` | Themed component styles. |
| `global.css` | Global styles. |

`src/theme.ts` — `getTheme(isDark)` returns the color object consumed by
[`ThemeProvider`](../src/contexts/ThemeProvider.tsx), which applies `data-coreui-theme` + `data-theme`
+ `--app-*` CSS vars on `<html>`/`<body>`. See [architecture §7](./architecture.md#7-theme-and-design-tokens).

## 15. `test/`, `scripts/`, `docs/`

- `src/test/` — `setup.ts` (Vitest/Testing Library setup) and helpers; MSW for network mocking. Tests
  live next to the code (`*.test.ts[x]`).
- `scripts/` — `check-test-ids.js` (requires `data-testid`), `check-accessibility.js` (a11y),
  `generate-icons.cjs`, `generate-images.cjs`.
- `docs/` — this documentation (`overview`, `architecture`, `folder-structure`), plus `docs/admin/`
  (backend controller reference) and `docs/TESTING.md`.

---

## Cross-links

- [Overview](./overview.md) — purpose, audience, stack.
- [Architecture](./architecture.md) — data flow, RBAC, decisions.
