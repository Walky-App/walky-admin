# Integrations — walky-admin

> Administrative dashboard for the Walky platform (React 19 + CoreUI 5 + Vite 7). This document
> describes **all external and contract integrations** the dashboard uses, with real paths,
> configuration files, and environment variables. It reflects the repository code exactly.

Related documents: [deployment.md](./deployment.md) · Ecosystem context: [`../AI_CONTEXT.md`](../AI_CONTEXT.md)

---

## Table of Contents

- [1. Overview](#1-overview)
- [2. Backend REST (Axios)](#2-backend-rest-axios)
  - [2.1. Base URL and client creation](#21-base-url-and-client-creation)
  - [2.2. Bearer token](#22-bearer-token)
  - [2.3. CSRF protection](#23-csrf-protection)
  - [2.4. Request/response interceptors](#24-requestresponse-interceptors)
  - [2.5. Services layer + React Query](#25-services-layer--react-query)
- [3. Swagger TypeScript API (type generation)](#3-swagger-typescript-api-type-generation)
- [4. Google Maps](#4-google-maps)
- [5. Sentry](#5-sentry)
- [6. Other data/visualization libraries](#6-other-datavisualization-libraries)
- [7. Environment variables summary](#7-environment-variables-summary)

---

## 1. Overview

walky-admin is a **client of walky-backend** (REST API). There is no WebSocket/real-time in the
dashboard. The integrations actually present in the code are:

| Integration | Purpose | Config file(s) | Env vars |
|---|---|---|---|
| **Backend REST (Axios)** | All HTTP communication with the API | `src/API/index.ts`, `src/API/http-client.ts` | `VITE_API_BASE_URL` |
| **Swagger TypeScript API** | Generates types/clients from the backend OpenAPI | `package.json` (`generate:api` script), output in `src/API/` | — (reads `../walky-backend/swagger.json`) |
| **Google Maps** | Drawing the campus geofence/boundary | `src/pages-v2/CampusBoundary/CampusBoundary.tsx` (`@react-google-maps/api`) | ⚠️ key is **hardcoded**, no env var |
| **React Query** | Server-state cache over Axios | `src/lib/queryClient.ts` | — |

> **Sentry:** `.env.example` suggests `VITE_SENTRY_DSN`, but **there is no Sentry integration in the
> code** (no package, import, or init). See [section 5](#5-sentry).

```mermaid
flowchart LR
  subgraph admin["walky-admin (browser)"]
    RQ["React Query<br/>src/lib/queryClient.ts"]
    SVC["services/*<br/>userService, campusService…"]
    AX["Axios client + interceptors<br/>src/API/index.ts"]
    GEN["Generated client (Swagger)<br/>src/API/WalkyAPI.ts, Api.ts…"]
    GM["Google Maps<br/>CampusBoundary.tsx"]
  end
  BE["walky-backend<br/>REST /api"]
  SW["../walky-backend/swagger.json"]
  GAPI["Google Maps JS API"]

  RQ --> SVC --> AX
  AX -.uses types.-> GEN
  AX -->|Bearer + CSRF| BE
  SW -->|generate:api| GEN
  GM --> GAPI
```

---

## 2. Backend REST (Axios)

Files: [`src/API/index.ts`](../src/API/index.ts) and [`src/API/http-client.ts`](../src/API/http-client.ts) (generated).

There are **two Axios instances** in `src/API/index.ts`:

1. `API` (default export) — the "manual" `axios.create(...)` instance, used by legacy code.
2. `apiClient` — the **generated client** instance (`new Api(new HttpClient(...))`), also exported
   as `httpClient` for compatibility. This is the one used by the `services/` layer.

Both receive **the same interceptors** (Bearer + CSRF + error handling), defined twice in the same
file.

### 2.1. Base URL and client creation

The base comes from `import.meta.env.VITE_API_BASE_URL`, with a `http://localhost:8080/api` fallback:

```ts
// src/API/index.ts
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api",
  withCredentials: true, // habilita cookies para CSRF
});
```

For the **generated client**, the `/api` suffix is **removed** from the base:

```ts
// src/API/index.ts
const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";
const httpClientInstance = new HttpClient({
  baseURL: baseURL.replace(/\/api\/?$/, ""),
});
export const apiClient = new Api(httpClientInstance);
```

Reason (noted in the code): the Swagger paths are mixed — admin routes already include the
`/api/admin/...` prefix, while legacy routes (`/ambassadors`, etc.) hit the legacy router at the
root. That's why the generated client's base is the **root** (without `/api`).

The generated `HttpClient` has its own `http://localhost:8081` fallback if no base is passed (see
`src/API/http-client.ts`), but in practice the base is always injected by `index.ts`.

Typical `VITE_API_BASE_URL` environments (see [`.env.example`](../.env.example)):

| Environment | Value |
|---|---|
| Production | `https://api.walkyapp.com/api` |
| Staging | `https://staging.walkyapp.com/api` |
| Local | `http://localhost:8081/api` (or `8080`) |

### 2.2. Bearer token

The JWT token is read from `localStorage` (key `token`) in the request interceptor and injected into
the `Authorization` header:

```ts
// src/API/index.ts (in both instances)
const token = localStorage.getItem("token");
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
} else {
  logger.warn("⚠️ No token found for request:", config.url);
}
```

### 2.3. CSRF protection

Both instances use `withCredentials: true` (cookies are sent). On **non-GET** requests (excluding
`get`/`head`/`options`), the CSRF token is read from a cookie and sent in two headers:

```ts
// src/API/index.ts — getCsrfToken()
const cookieNames = ["csrf_cookie_rr", "XSRF-TOKEN", "csrf_token", "_csrf"];
// ...
config.headers["X-CSRF-Token"] = csrfToken;
config.headers["X-XSRF-Token"] = csrfToken;
```

The `getCsrfToken()` helper tries several common cookie names and runs `decodeURIComponent`.

### 2.4. Request/response interceptors

Response interceptor (identical in both instances):

- **Logs** on success (`logger.debug`) and error (`logger.error`) with method/URL/status.
- **401 Unauthorized:** removes `token` from `localStorage` and redirects to `/login` (if not
  already there) via `window.location.href`.
- **403 Forbidden:** if the error body has `code === "ACCOUNT_DEACTIVATED"` or
  `"USER_DEACTIVATED"`, it opens the modal via `triggerDeactivatedModal()`
  (`src/contexts/DeactivatedUserContext`). Ordinary permission 403 errors do **not** open the modal.

> Note: the **retry** logic and the no-retry policy on 4xx (except 408) are **not** in Axios but in
> React Query — see [2.5](#25-services-layer--react-query).

### 2.5. Services layer + React Query

The services in [`src/services/`](../src/services/) wrap `apiClient` calls and expose typed
functions. Existing ones:

`ambassadorService.ts`, `analyticsService.ts`, `campusService.ts`, `campusSyncService.ts`,
`interestService.ts`, `lockedUsersService.ts`, `placeService.ts`, `placeTypeService.ts`,
`reportService.ts`, `rolesService.ts`, `schoolService.ts`, `userService.ts`.

Each service imports `apiClient` from `../API`, `logger` from `../lib/logger`, and types from
`../API/WalkyAPI` (e.g., `src/services/userService.ts`).

**React Query** ([`src/lib/queryClient.ts`](../src/lib/queryClient.ts)) sets the defaults:

```ts
queries: {
  staleTime: 1000 * 60 * 5,  // 5 min
  gcTime:    1000 * 60 * 10,  // 10 min
  retry: (failureCount, error) => {
    // no retry on 4xx, except 408 (timeout); otherwise up to 3 attempts
    // ...
    return failureCount < 3;
  },
  refetchOnWindowFocus: false,
},
mutations: { retry: 1 },
```

There is also a `queryKeys` factory (campuses, campus, students, geofences, ambassadors…).

---

## 3. Swagger TypeScript API (type generation)

**Purpose:** generate the TypeScript client + data types from the backend's OpenAPI contract,
keeping the dashboard's types in sync with the API.

**Command** (in [`package.json`](../package.json)):

```jsonc
"generate:api": "npx swagger-typescript-api generate -p ../walky-backend/swagger.json -o ./src/API --axios --name WalkyAPI.ts"
```

- Tool: [`swagger-typescript-api`](https://github.com/acacode/swagger-typescript-api) (author
  acacode) — invoked via `npx` (not a declared dependency).
- Input (`-p`): **`../walky-backend/swagger.json`** — the `walky-backend` repository must be cloned
  alongside, with `swagger.json` generated/exported. There is no remote download of the spec.
- Output (`-o`): **`./src/API`**.
- Flags: `--axios` (Axios-based client) and `--name WalkyAPI.ts` (main file name).

**Files generated in [`src/API/`](../src/API/):** all begin with the header
`## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API` — **do not edit by hand**:

- `WalkyAPI.ts` — main file (name via `--name`); exports `Api` and `HttpClient` (~378 KB).
- `Api.ts` — variant of the full client (~374 KB).
- `http-client.ts` — the `HttpClient` class (generic Axios wrapper: `mergeRequestParams`,
  `createFormData`, `request`, etc.).
- `data-contracts.ts` — data type interfaces.
- Per-domain clients: `Admin.ts`, `Age.ts`, `Ambassadors.ts`, `Analytics.ts`, `Audit.ts`,
  `Auth.ts`, `Users.ts`.

> `src/API/index.ts` is **not** generated — it's the manual wrapper that configures the base,
> interceptors, and exports `apiClient`/`httpClient`/`API`.

**Contract flow (common to app/admin/hq):** backend change → regenerate `swagger.json` in the
backend → run `generate:api` in admin → rebuild. See [`../AI_CONTEXT.md`](../AI_CONTEXT.md) §0.

```mermaid
flowchart LR
  BE["walky-backend"] -->|exports| SW["swagger.json"]
  SW -->|generate:api<br/>swagger-typescript-api| OUT["src/API/*.ts<br/>(WalkyAPI, Api, http-client,<br/>data-contracts, Admin…)"]
  OUT -->|Api + HttpClient| IDX["src/API/index.ts<br/>(wrapper: base + interceptors)"]
  IDX -->|apiClient| SVC["src/services/*"]
```

---

## 4. Google Maps

**Purpose:** draw and edit the **campus boundary/geofence** (GeoJSON polygon) on the campus
configuration screen.

**File:** [`src/pages-v2/CampusBoundary/CampusBoundary.tsx`](../src/pages-v2/CampusBoundary/CampusBoundary.tsx)

**Library:** [`@react-google-maps/api`](https://www.npmjs.com/package/@react-google-maps/api)
(`^2.20.7`) — uses `useJsApiLoader`, `GoogleMap`, `StandaloneSearchBox`, `Libraries`.

```ts
// src/pages-v2/CampusBoundary/CampusBoundary.tsx
const libraries: Libraries = ["places"]; // DrawingManager foi removido na Maps JS v3.65
const { isLoaded, loadError } = useJsApiLoader({
  id: "google-map-script",
  googleMapsApiKey: "AIzaSyAumxyJ5Z1j-_X1EHUSy8GCRr21zDPzSHs",
  libraries,
});
```

> ⚠️ **Warning — hardcoded key:** the `googleMapsApiKey` is **baked into the source code**; it does
> not come from an environment variable. Although `.env.example` suggests `VITE_GOOGLE_MAPS_API_KEY`,
> that env var is **not read anywhere** in `src/`. The only env var used in the code is
> `VITE_API_BASE_URL` (and `import.meta.env.DEV`). We recommend moving the key to
> `VITE_GOOGLE_MAPS_API_KEY` and restricting it.

The polygon is drawn manually with map click listeners (the `drawing library` is no longer used
because `DrawingManager` was removed in Maps JS API v3.65). Types come from `@types/google.maps`
(`^3.58.1`).

---

## 5. Sentry

**There is no Sentry integration in the code.** There is no `@sentry/*` package in
[`package.json`](../package.json), nor any Sentry `import`/`init` in `src/`.

[`.env.example`](../.env.example) mentions `VITE_SENTRY_DSN` only as a comment ("Other potential
environment variables"), but that variable is **not consumed** anywhere. Treat it as a
placeholder/future intent, not an active integration.

What exists instead is a **custom logger** ([`src/lib/logger.ts`](../src/lib/logger.ts)):
`debug`/`info` only in dev (`import.meta.env.DEV`), `warn`/`error` always — to avoid leaking PII in
the console in production. It's the logger used by the Axios interceptors and the services.

---

## 6. Other data/visualization libraries

These are not "external integrations" (they don't call third-party services), but they are part of
the dashboard's data/visualization layer:

- **Recharts** (`^3.4.1`) — dashboard charts. Used in
  `src/pages-v2/Dashboard/components/LineChart/LineChart.tsx` and
  `src/pages-v2/Dashboard/components/DonutChart/DonutChart.tsx` (and mocked in `src/test/setup.ts`).
- **Three.js** + `@react-three/fiber` + `@react-three/drei` — experimental 3D visualizations in the
  **Playground** (`src/pages-v2/Playground/*` — e.g., `InterestCloud`, `InterestConstellation`,
  `ActiveUsersSpiral`, `ActiveUsersOrbs`…). All ~13 3D screens use Three.js; the Playground does
  **not** use Recharts.
- **html2canvas** / **html2pdf.js** — report export (PDF/image).
- **date-fns**, **react-hot-toast**, **simplebar-react**, **lucide-react** — UI utilities.

---

## 7. Environment variables summary

See config/deploy details in [deployment.md](./deployment.md#2-environment-variables).

| Variable | Where it's read | Required | Note |
|---|---|---|---|
| `VITE_API_BASE_URL` | `src/API/index.ts`, `src/test/handlers.ts` | Effectively yes | Fallback `http://localhost:8080/api`. The generated client strips the `/api` suffix. |
| `VITE_APP_NAME` | `.env.example` | No (not read in `src/`) | E.g., `Walky Admin`. |
| `VITE_ENV` | `.env.example` | No (not read in `src/`) | `development` / `staging` / `production`. |
| `VITE_GOOGLE_MAPS_API_KEY` | — | No | Suggested in `.env.example`, but **not used** — the key is hardcoded in `CampusBoundary.tsx`. |
| `VITE_SENTRY_DSN` | — | No | Suggested in `.env.example`, but **no Sentry integration**. |
| `import.meta.env.DEV` | `src/lib/logger.ts` | (Vite built-in) | Enables dev logs. |

> The only real application env var used in `src/` = **`VITE_API_BASE_URL`**. The rest are just
> suggestions from `.env.example`.
