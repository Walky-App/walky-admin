# Troubleshooting — walky-admin

> Symptom → cause → fix, based on real clues from the code. Items marked **(inference)**
> are not spelled out in the code but follow from the observed configuration.

## Table of Contents

- [Wrong backend / no data / CORS](#backend-errado--sem-dados--cors)
- [401 loop / redirect to /login](#401-em-loop--redirect-para-login)
- [403 opening the deactivated-account modal](#403-abrindo-modal-de-conta-desativada)
- [Stale API types / missing method](#stale-api-types--missing-method)
- [Commit blocked: missing testids](#commit-bloqueado-testids-faltando)
- [Commit blocked: accessibility](#commit-bloqueado-acessibilidade)
- [Dark mode not applying / hardcoded colors](#dark-mode-not-applying--hardcoded-colors)
- [`console.*` rejected by lint](#console-reprovado-no-lint)
- [Route disappears / PermissionGuard always redirects](#rota-some--permissionguard-redireciona-sempre)
- [Failing tests: unmocked request / missing provider](#testes-falhando-request-sem-mock--provider-ausente)
- [Vercel: 404 when refreshing a route (SPA routing)](#vercel-404-ao-dar-refresh-numa-rota-spa-routing)
- [`.env` edited and nothing changes](#env-editado-e-nada-muda)

Cross-links: [conventions.md](./conventions.md) · [development.md](./development.md) · [ai-reference.md](./ai-reference.md)

---

## Wrong backend / no data / CORS

**Symptom:** empty screens, network errors in the console, or CORS blocked.

**Cause/fix:** `VITE_API_BASE_URL` (`.env`) determines the backend. The client in `src/API/index.ts`
does `baseURL.replace(/\/api\/?$/, "")` for the OpenAPI client (admin routes already include `/api`;
legacy routes hit the root). That's why **the URL must end in `/api`**. Fallback when absent:
`http://localhost:8080/api`.

- Local: `VITE_API_BASE_URL=http://localhost:8080/api` (or `:8081/api`) with `walky-backend` running.
- Your local `.env` (git-ignored) may point to **staging** (`https://staging.walkyapp.com/api`); the
  committed `.env.example` defaults to **production** (`https://api.walkyapp.com/api`). Switch to your
  local dev backend during development.
- Restart `yarn dev` after editing `.env`.
- **CORS (inference):** Axios uses `withCredentials: true` (cookies for CSRF). If the local backend
  doesn't allow the origin `http://localhost:5173` with credentials, non-GET requests may fail —
  make sure the backend's CORS allows that origin.

## 401 loop / redirect to /login

**Symptom:** you keep getting sent back to `/login`, or an unexpected logout.

**Cause:** the response interceptors (`src/API/index.ts`) handle **401** by removing `localStorage.token`
and navigating to `/login` (`window.location.href = "/login"`). Auth is read from `localStorage`
(`token` + `user`) by `useAuth` (`src/hooks/useAuth.ts`); `AuthGuard` redirects anyone not authenticated.

**Fix:**
- Expired/invalid token → log in again. There is no automatic refresh **(inference: there is no refresh
  logic in this repo's interceptors)**; a 401 always logs you out.
- If the local backend rejects the token (JWT secret different from staging/prod), generate a token on the
  same backend that `VITE_API_BASE_URL` points to.
- State out of sync across tabs: `useAuth` listens for `storage` and `auth:user-updated`; clearing
  `localStorage` and reloading resolves corrupted state (an invalid `user` also triggers logout).

## 403 opening the deactivated-account modal

**Symptom:** an action returns 403 and the "deactivated account" modal appears.

**Cause:** the interceptor only fires `triggerDeactivatedModal()` when `error.response.data.code` is
`ACCOUNT_DEACTIVATED` or `USER_DEACTIVATED` (`src/API/index.ts` + `src/contexts/DeactivatedUserContext`).
A 403 from **lack of permission** (a different code) does **not** open the modal.

**Fix:** if you shouldn't be deactivated, check the account on the backend. If it's a permission error,
check the role/matrix (see the PermissionGuard section).

## Stale API types / missing method

**Symptom:** `apiClient.api.<method>` doesn't exist, or the types diverge from the backend's actual response.

**Cause:** `src/API/WalkyAPI.ts` is **generated** from Swagger and may be out of date.

**Fix:**
```bash
yarn generate:api   # needs an up-to-date ../walky-backend/swagger.json
```
Regenerate `swagger.json` on the backend first (Swagger at `http://localhost:8081/api-docs/`). Do not
hand-edit the generated files (`src/API/WalkyAPI.ts`, `Api.ts`, `data-contracts.ts`, `http-client.ts`).

## Commit blocked: missing testids

**Symptom:** pre-commit/CI fails with "Add data-testid to elements".

**Cause:** `scripts/check-test-ids.js` requires `data-testid` on `<button>`/`<input>`/`<form>` inside
`src/pages-v2` and `src/components-v2`.

**Fix:** add `data-testid="descriptive"` to the element (or, for components that abstract the element,
pass the testid prop — e.g., `FilterDropdown testId="..."`). Run `yarn check:testids`.

## Commit blocked: accessibility

**Symptom:** pre-commit/CI fails with WCAG violations.

**Cause:** `scripts/check-accessibility.js` scans `pages-v2`/`components-v2`/`layout-v2`.

**Fixes by rule:**
- `<img>` → `alt="..."` or `aria-hidden="true"` (decorative).
- Icon-only `<button>` → `aria-label="..."`.
- `<input>`/`<select>` → `aria-label`, `aria-labelledby`, or `id` (for `<label>`).
- `role="radio"` → `aria-checked`; `role="tab"` → `aria-selected`; landmarks/widgets → `aria-label`.
- Focus warning: add `:focus`/`:focus-visible` in the component's `.css`.

Run `yarn check:a11y` to see the exact file/line.

## Dark mode not applying / hardcoded colors

**Symptom:** a component doesn't change in dark theme.

**Cause:** dark mode overrides `--v2-*` tokens under `:root[data-coreui-theme="dark"]` and
`[data-theme="dark"]` (`src/styles-v2/design-tokens.css`). Colors hardcoded in CSS don't inherit.

**Fix:** use the `--v2-*` CSS variables (e.g., `color: var(--v2-text-primary); background: var(--v2-bg-card);`)
instead of fixed hex values. `ThemeProvider` (`src/contexts/ThemeProvider.tsx`) sets `data-coreui-theme`
and `data-theme` on `<html>` and toggles `body.dark-theme`; `App.tsx` toggles `body.dark-mode`. If the
toggle doesn't persist, check `localStorage("theme")`.

## `console.*` rejected by lint

**Symptom:** ESLint fails with `no-console`.

**Cause:** the `no-console: 'error'` rule (`eslint.config.js`) prevents leaking PII in production.

**Fix:** use `logger` from `src/lib/logger.ts` (`logger.debug/info/warn/error`). `debug`/`info` are emitted
only in DEV; the build still strips `console.log/info/debug` (`vite.config.ts`). Only `logger.ts` may use
`console` (via `eslint-disable`).

## Route disappears / PermissionGuard always redirects

**Symptom:** the user is thrown to `/dashboard/engagement` when opening a screen; or an item disappears from the sidebar.

**Cause:** `PermissionGuard` (`fallback="redirect"`) checks `permissionMatrix[role][resource].read`
(`src/lib/permissions.ts`). If the role has no `read` on the `resource`, it redirects to `redirectTo`
(default `/dashboard/engagement`). E.g., `moderator`/`walky_internal` have `noPermissions` on
`active_students`, etc.

**Fix:**
- Confirm the user's `role` (`localStorage.user`) and the corresponding row in the `permissionMatrix`.
- A new route with no entry in `routeResourceMap` is allowed by default (`canAccessRoute` returns `true`).
- When adding a protected route: include the `resource` in the union, in the matrix for **all** roles, and
  in `routeResourceMap`. See [development.md §4](./development.md#4-adding-a-new-page-lazy-route--permissionguard).
- While `useAuth().isLoading`, the guards render `null` (avoids flash) — don't confuse this with a "blank page".

## Failing tests: unmocked request / missing provider

**Symptom:** a test fails on a real network request, or a hook throws "must be used within a Provider".

**Cause:** MSW makes unhandled requests **fail** on purpose; and contexts require their providers.

**Fix:**
- Render with `renderWithProviders` (`src/test/test-utils.tsx`) — it already mounts Theme/School/Campus/
  Dashboard/DeactivatedUser/Router/QueryClient.
- Mock the route with `server.use(http.get(\`${API_BASE}/...\`, ...))` (`src/test/handlers.ts`,
  `src/test/server.ts`). The default handlers cover common cases; overrides are reset after each test.
- Auth: seed `localStorage` (`token`, `user`) before rendering.

## Vercel: 404 when refreshing a route (SPA routing)

**Symptom:** client-side navigation works, but pressing F5 on `/events` returns 404 on the deploy.

**Cause/fix:** an SPA needs a rewrite to `index.html`. Already configured in `vercel.json`
(`"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]`). If you host outside Vercel
**(inference)**, replicate that rewrite/fallback on the server (e.g., `try_files` in Nginx). The router uses
`BrowserRouter` (`src/main.tsx`), so real paths must resolve to `index.html`.

## `.env` edited and nothing changes

**Symptom:** you changed a `VITE_*` value but the app uses the old one.

**Cause:** Vite reads env at boot and only exposes variables with the `VITE_` prefix.

**Fix:** restart `yarn dev`. Confirm the `VITE_` prefix. In production/preview, rebuild
(`yarn build`) — the values are inlined into the bundle.
