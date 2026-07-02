# Conventions — walky-admin

> **Real** patterns of the Walky administrative dashboard (React 19 + CoreUI 5 + Vite 7).
> All examples below are genuine snippets from the source code. Always cite absolute
> paths when referencing files.

## Table of Contents

- [1. The `-v2` suffix](#1-the--v2-suffix)
- [2. File and symbol naming](#2-file-and-symbol-naming)
- [3. Component: folder with `.tsx` + namespaced `.css`](#3-component-folder-with-tsx--namespaced-css)
- [4. Required `data-testid` (`check:testids`)](#4-required-data-testid-checktestids)
- [5. Accessibility (`check:a11y`)](#5-accessibility-checka11y)
- [6. Barrel exports (`index.ts`)](#6-barrel-exports-indexts)
- [7. Services layer](#7-services-layer)
- [8. React Query](#8-react-query)
- [9. Design tokens (CSS variables) + dark mode](#9-design-tokens-css-variables--dark-mode)
- [10. `PermissionGuard` / `AuthGuard` on routes](#10-permissionguard--authguard-on-routes)
- [11. Logging (never `console.*` directly)](#11-logging-never-console-directly)

Cross-links: [development.md](./development.md) · [troubleshooting.md](./troubleshooting.md) · [ai-reference.md](./ai-reference.md)

---

## 1. The `-v2` suffix

The app was migrated to a new design system. **New code lives in folders with the `-v2` suffix**;
legacy code (without the suffix) is being phased out. When creating something new, always use the
`-v2` variant.

| Legacy | Current (use this) |
|--------|--------------|
| `src/components/` | `src/components-v2/` |
| `src/pages/`, `src/views/` | `src/pages-v2/` |
| `src/layout/` | `src/layout-v2/` |
| `src/assets/` | `src/assets-v2/` |
| `src/styles/` | `src/styles-v2/` |
| old routes | `src/routes/v2Routes.tsx` |

`App.tsx` mounts `V2Routes` as the default route (`/*`) and redirects old `/v2/*` paths to the root
(`src/App.tsx`). The quality checks (`scripts/check-test-ids.js`, `scripts/check-accessibility.js`)
**only scan** `src/pages-v2`, `src/components-v2`, and `src/layout-v2`.

## 2. File and symbol naming

- **Components/pages**: `PascalCase`. The folder has the same name as the component:
  `src/components-v2/Chip/Chip.tsx`, `src/pages-v2/Events/EventsManager/EventsManager.tsx`.
- **Paired CSS**: same name as the component — `Chip.tsx` → `Chip.css`.
- **Barrel**: each folder has an `index.ts` that re-exports.
- **Hooks**: `camelCase` with a `use` prefix — `src/hooks/useAuth.ts`, `useDebounce.ts`.
- **Services**: `camelCase` + `Service` suffix — `src/services/userService.ts`, `campusService.ts`.
- **Tests**: one file per source, alongside it — `Foo.tsx` → `Foo.test.tsx` (see [development.md](./development.md#testes)).
- **CSS classes**: `kebab-case` prefixed with the component name (see section 3).

## 3. Component: folder with `.tsx` + namespaced `.css`

Each component is a folder with three files: the `.tsx`, the `.css` of the same name, and the
`index.ts`. There are no CSS Modules; isolation is done by a **prefix convention** on the classes.

```
src/components-v2/Chip/
├── Chip.tsx      # componente
├── Chip.css      # estilos, classes prefixadas .chip-*
└── index.ts      # barrel
```

The `.tsx` imports the `.css` directly and every class begins with the component name:

```tsx
// src/components-v2/Chip/Chip.tsx
import "./Chip.css";

export const Chip: React.FC<ChipProps> = ({ value, type, className = "" }) => {
  return (
    <span className={`chip-badge ${sizeClass} ${className}`.trim()} style={{ ... }}>
      <span className="chip-badge__label">{displayLabel}</span>
    </span>
  );
};
```

```css
/* src/components-v2/Chip/Chip.css — todas as classes prefixadas com .chip-badge */
.chip-badge { display: inline-flex; border-radius: 999px; font-family: "Lato", sans-serif; }
.chip-badge--compact { min-height: 28px; }
.chip-badge__label { display: block; white-space: pre-line; }
```

Pages follow the same pattern: `EventsManager.tsx` imports `./EventsManager.css` and uses
`events-manager-*` classes (`src/pages-v2/Events/EventsManager/`). Sub-components of a page live in
`components/` inside the feature folder (e.g., `src/pages-v2/Events/components/EventTable/`).

## 4. Required `data-testid` (`check:testids`)

**Every `<button>`, `<input>`, and `<form>`** in `pages-v2`/`components-v2` needs a `data-testid`.
The `scripts/check-test-ids.js` script runs on pre-commit and in CI (`.github/workflows/code-quality.yml`)
and **blocks** the commit if one is missing.

```tsx
// src/pages-v2/Events/EventsManager/EventsManager.tsx
<button
  data-testid="view-list-btn"
  className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
  onClick={() => setViewMode("list")}
>
  List view
</button>
```

Shared UI components expose props to propagate the testid to the inner interactive element (e.g.,
`FilterDropdown` takes `testId="event-type-filter"`). In tests, prefer querying by
role/label/testid — never by CSS class (see `docs/TESTING.md`).

## 5. Accessibility (`check:a11y`)

`scripts/check-accessibility.js` (WCAG 2.1 AA) runs on pre-commit and in CI, scanning `pages-v2`,
`components-v2`, `layout-v2`. Rules applied (violation = commit blocked):

- `<img>` needs `alt` or `aria-hidden="true"`.
- `<button>` needs visible text **or** `aria-label`/`aria-labelledby` (icon-only buttons require
  `aria-label`).
- `<input>`/`<select>` need `aria-label`, `aria-labelledby`, or `id` (to associate a `<label>`).
- Landmark/widget roles (`region`, `group`, `navigation`, `form`, …) require an accessible label.
- `role="radio"` → `aria-checked`; `role="tab"` → `aria-selected`.

Warnings (non-blocking): pages in `pages-v2` should have a `<main>` landmark; components with
`onClick` whose `.css` has no `:focus`/`:focus-visible`. A real example of a page with `<main>`:

```tsx
// src/pages-v2/Events/EventsManager/EventsManager.tsx
return <main className="events-manager-container"> ... </main>;
```

## 6. Barrel exports (`index.ts`)

Each component/feature exports via `index.ts`, and there is a root barrel aggregating everything:

```ts
// src/components-v2/Chip/index.ts
export { Chip } from "./Chip";
export type { ChipProps, ChipType } from "./Chip";
```

```ts
// src/components-v2/index.ts (agregador — importe daqui)
export { Chip } from "./Chip";
export { FilterDropdown } from "./FilterDropdown";
export { PermissionGuard } from "./PermissionGuard";
export { AuthGuard } from "./AuthGuard";
```

Consumers import from the barrel, not the inner file:

```tsx
import { Pagination, SearchInput, FilterDropdown, NoData } from "../../../components-v2";
```

Feature barrels also re-export types used outside the feature — e.g.,
`src/pages-v2/Events/index.ts` exports `EventsManager`, `EventsInsights`, `CheckInAnalytics`, and the
`EventData`/`EventType` types.

## 7. Services layer

`src/services/*` wraps calls to the **generated Swagger client** (`apiClient` from `src/API`),
normalizes the response, and centralizes logging/errors. Don't call raw `apiClient` in business
components when a service exists. Typical structure: an object with `async` methods + `export
default`.

```ts
// src/services/userService.ts
import { logger } from "../lib/logger";
import { apiClient } from "../API";

export const userService = {
  getUsers: async (params?: UsersListParams): Promise<UsersListResponse> => {
    try {
      const response = await apiClient.api.adminUsersList({ ...params });
      return {
        users: response.data.users || [],
        pagination: { page: apiPagination?.page ?? 1, /* ... */ },
      };
    } catch (error) {
      logger.error("❌ Failed to fetch users:", error);
      throw error;
    }
  },
};
export default userService;
```

Conventions: typed parameters/returns via interfaces; normalization of optional fields with `??`/`||`;
`logger.debug` on entry/success and `logger.error` + `throw` in the catch (so React Query can handle it).

## 8. React Query

Server state always goes through `@tanstack/react-query`. The global client (`src/lib/queryClient.ts`)
defines: `staleTime` 5 min, `gcTime` 10 min, `refetchOnWindowFocus: false`, and a `retry` that does
**not** repeat 4xx (except 408), up to 3 attempts; mutations `retry: 1`.

Usage in a page, with the `queryKey` including all filters and school/campus context, and
`placeholderData: keepPreviousData` for smooth pagination:

```tsx
// src/pages-v2/Events/EventsManager/EventsManager.tsx
const { data: eventsData, isLoading } = useQuery({
  queryKey: ["events", currentPage, debouncedSearchQuery, typeFilter, statusFilter,
             sortBy, sortOrder, selectedSchool?._id, selectedCampus?._id],
  queryFn: () => apiClient.api.adminV2EventsList({ page: currentPage, limit: 10, /* ... */ }),
  placeholderData: keepPreviousData,
});
```

There is a key factory in `queryClient.ts` (`queryKeys.campuses`, `queryKeys.campus(id)`, …) for
domains with invalidation. Text-input searches pass through `useDebounce` (`src/hooks/useDebounce.ts`,
typically 500 ms) before becoming a `queryKey`.

## 9. Design tokens (CSS variables) + dark mode

**Two** theme systems coexist: CoreUI's (`data-coreui-theme`) and the custom **V2** tokens.

- V2 tokens in `src/styles-v2/design-tokens.css` as `--v2-*` CSS variables
  (`--v2-primary-purple-main: #526ac9`, `--v2-bg-card`, `--v2-text-primary`, `--v2-spacing-16`, …).
  Source: the Figma "Walky Admin Portal". Imported once in `src/main.tsx`.
- **Dark mode** overrides the same tokens under two selectors:

```css
/* src/styles-v2/design-tokens.css */
:root[data-coreui-theme="dark"],
[data-theme="dark"] { /* redefine --v2-* para o tema escuro */ }
```

The `ThemeProvider` (`src/contexts/ThemeProvider.tsx`) initializes from `localStorage("theme")` or
`prefers-color-scheme`, and on toggle sets `data-coreui-theme` + `data-theme` on `<html>`, injects
`--app-*` colors, and adds/removes `body.dark-theme`. `App.tsx` also toggles `body.dark-mode`.
In component CSS, **use the `--v2-*` variables** instead of hardcoded colors to inherit dark mode.

## 10. `PermissionGuard` / `AuthGuard` on routes

RBAC is declared per route. Roles: `super_admin`, `school_admin`, `campus_admin`, `moderator`,
`walky_internal`. The permission matrix lives in `src/lib/permissions.ts`
(`permissionMatrix[role][resource] → { read, create, update, delete, export, manage }`).

- `AuthGuard` (`src/components-v2/AuthGuard/`) protects the entire authenticated tree in `App.tsx`:
  redirects to `/login` if not authenticated, and **renders `null` while `isLoading`** (avoids a
  redirect flash on refresh).
- `PermissionGuard` (`src/components-v2/PermissionGuard/`) wraps each protected route in
  `src/routes/v2Routes.tsx`, with `resource` and `fallback="redirect"`:

```tsx
// src/routes/v2Routes.tsx
<Route path="events" element={
  <PermissionGuard resource="events_manager" fallback="redirect">
    <EventsManager />
  </PermissionGuard>
} />
```

In inline UI (action buttons), use the same guard with `fallback="hidden"` (default) or the
`withPermission` HOC. For imperative checks, `usePermissions()` exposes `can/canRead/canUpdate/
canExport/canCreate/canDelete/canManage` and `isSuperAdmin`/`isModerator`/… flags (`src/hooks/usePermissions.ts`).

## 11. Logging (never `console.*` directly)

The ESLint rule `no-console: error` **forbids** `console.*` in the code. Every log goes through
`src/lib/logger.ts` (`logger.debug/info/warn/error`). `debug`/`info` only emit in DEV
(`import.meta.env.DEV`) so as not to leak payloads/PII in production; `warn`/`error` always emit.
Vite also strips `console.log/info/debug` in the build (`vite.config.ts` → `esbuild.pure`).
The only file where `console` is allowed is `logger.ts` itself (via `eslint-disable`).
