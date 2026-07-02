# Walky — Ecosystem Context (for AI)

> **Purpose of this document:** to serve as a **single source of context** for an AI to understand the four
> repositories that make up the Walky platform. From here, the AI should be able to write a
> **documentation prompt** and then generate documentation for each repository in a
> consistent way. This is not the final documentation — it's the map that gives the AI the big picture.

---

## 0. Platform overview

**Walky** is a **social networking platform for university campuses**. It helps students
discover events, find peers nearby, explore campus spaces, exchange real-time messages,
and organize spontaneous meetups ("walks"). It serves 10,000+ students across several
universities (e.g., FIU, FAU).

The platform is made up of **4 repositories**, all located under `/Volumes/SSDDEV/DEV_PROJETOS/`:

| # | Repository | Folder | Role | Audience |
|---|-------------|-------|-------|--------------|
| 1 | **Mobile app (WOC)** | `walkyApp` | iOS/Android app used by students | Students |
| 2 | **Backend** | `walky-backend` | REST API + WebSockets, database | (serves everyone) |
| 3 | **Admin** | `walky-admin` | Admin panel (CoreUI) | Campus/school admins, moderators |
| 4 | **HQ** | `walky-hq` | Super-admin/analytics panel (shadcn) | Walky super-admins (internal) |

**Dependency flow:** the **App**, the **Admin**, and the **HQ** are all clients of the **Backend**.
Their type-generation strategies differ: **walky-admin** generates its TypeScript types from the
**backend Swagger/OpenAPI** (`../walky-backend/swagger.json`) using `swagger-typescript-api`, and
the **App** uses **Orval** to generate React Query hooks from the same Swagger. **walky-hq does NOT**
generate types from Swagger — its types are **hand-written** in `src/types/`.

```
                    ┌──────────────────┐
                    │   walky-backend  │  Node/Express/TS · MongoDB · Redis · Socket.io
                    │   (API + WS)     │  GCP Cloud Run
                    └────────┬─────────┘
             ┌───────────────┼────────────────┐
             │               │                │
      ┌──────▼─────┐  ┌───────▼──────┐  ┌──────▼──────┐
      │  walkyApp  │  │ walky-admin  │  │  walky-hq   │
      │ RN/Expo    │  │ React+CoreUI │  │ React+shadcn│
      │ (WOC)      │  │ (campus mgmt)│  │ (super-admin)│
      └────────────┘  └──────────────┘  └─────────────┘
```

**Type-generation convention:** the App and Admin consume the backend's OpenAPI contract to
generate their clients/types (Orval for the App, `swagger-typescript-api` for the Admin), while HQ
keeps its types hand-written. A backend contract change → regenerate the App and Admin
types/clients (and manually update HQ's hand-written types where affected).

---

## 1. walkyApp — Mobile app (WOC)

**Purpose:** student-facing mobile app. Peer-to-peer connection, real-time
location sharing, messaging, events, and map-based discovery. Current version **3.5.2**.
Private repository.

### Stack
- **React Native** 0.81.4 · **React** 19.1 · **TypeScript** 5.9 · **Expo** 54 (dev client)
- **Package manager:** Bun 1.2.4
- **State:** Zustand 4.5 (`useGlobalStore`) + React Query 5.80 (server state)
- **API client:** Orval 7.11 (generates React Query hooks from Swagger) + Axios
- **Navigation:** Expo Router 6 (file-based) + React Navigation 7
- **UI/animation:** Reanimated 4, Gesture Handler, Gorhom Bottom Sheet, Unistyles 3, Lottie
- **Real-time:** socket.io-client 4.8 (WebSocket + polling fallback for restrictive campus WiFi)
- **Maps/location:** react-native-maps, Turf.js, Expo Location (with background tracking)
- **Monitoring/analytics:** Sentry, Firebase Analytics, Mixpanel, PostHog, Pendo
- **Storage:** AsyncStorage, MMKV, Expo FileSystem

### Structure (`src/`)
- `app/` — Expo Router file-based routes: `(public)` (auth), `(main-v3)` (authenticated tabs),
  `(global-v3)` (modals), `(bottom-sheet)`
- `features/` — feature modules: `auth`, `home`, `events-v3`, `chat-v3`, `explore`, `map`,
  `peers`, `profile`, `spaces`, `ideas-v3`, `report`, `upgrades`, `sa-onboarding`, `bottomTabBar`
- `components/common/` — 46+ reusable components
- `services/` — integration layer: `API/` (Axios), `analytics/`, `notifications/`, `location/`,
  `featureFlags/`, `deeplink/`, `prefetch/`, `logging/`
- `api/generated/` — Orval-generated client (`walky.ts`) · `api/mutator/` — custom Axios
- `hooks/` — per-feature socket hooks (`useEventSocket`, `useInviteSocket`, etc.)
- `store/global/`, `query/`, `theme/`, `styles/unistyles.ts`, `utils/`

### Core features
`auth` (login/onboarding), `home` (feed/discovery), `events-v3` (create/RSVP/event chat),
`chat-v3` (DM + real-time event chat), `explore`+`map` (map-based discovery),
`peers` (profiles/connections), `profile`, `spaces` (communities), `ideas-v3`, `report` (moderation).

### Backend integration
- **HTTP:** Axios in `src/services/API/`, base URL from env `BASE_URL`, Bearer token via `AuthService`,
  automatic refresh on 401, connectivity check (netinfo) before requesting.
- **Socket:** `SocketProvider` in `src/utils/sockets/`, token-based auth on handshake,
  WebSocket + long-polling, reconnect tuned for mobile.
- **Orval:** config in `orval.config.ts`, generates hooks in `src/api/generated/walky.ts`.
  Scripts: `api:generate`, `api:generate:watch`, `api:fetch-swagger`.

### Env vars
`APP_ID`, `DISPLAY_NAME`, `BASE_URL`, `SOCKET_URL`, `GOOGLE_MAPS_API_KEY`, `SENTRY_DSN`,
`MIXPANEL_TOKEN`, `POSTHOG_API_KEY`, `PENDO_API_KEY`, `USE_BACKGROUND_LOCATION`.
Files: `.env`, `.env.staging`, `.env.production`, `.env.e2e`.

### Build/run
- Scripts (Bun): `bun start`, `bun ios`, `bun android`, `bun type-check`, `bun lint`, `bun test`,
  `bun test:e2e`, `bun api:generate`.
- **EAS** (`eas.json`): profiles `development`, `development-device`, `preview`, `staging`,
  `production`, `e2e-test`. iOS→TestFlight, Android→Firebase App Distribution/Google Play.
- **Tests:** Jest (unit, 40+ mocks) + Maestro (E2E in YAML, `.maestro/`).

### Local convention (this environment)
- The simulator **always** points to the local backend (`walky-backend`), never staging/prod.
- The local backend runs on `PORT=8080`; Metro uses 8081. `.env`: `BASE_URL=http://localhost:8080`,
  `SOCKET_URL=ws://localhost:8080`. After changing `.env`, restart Metro with
  `npx expo start --dev-client --clear`.

---

## 2. walky-backend — REST API + WebSockets

**Purpose:** the platform's central REST API (serves the app, admin, and HQ). Node.js/Express/TypeScript
with MongoDB, Redis, and Socket.io. Deployed on **GCP Cloud Run**. Small team (2–3 devs), focused on
speed and real-time features.

### Stack
- **TypeScript** (strict) · **Node 20+** · **Express** · **MongoDB 4.12+ / Mongoose 7.2** ·
  **Redis** (location sync, real-time) · **Socket.io 4.7**
- **GCP:** Cloud Run (hosting), Cloud Build (CI/CD), Secret Manager, Cloud Storage (images),
  Cloud Logging, Cloud Vision (image moderation), Cloud Tasks
- **Integrations:** Sentry, Firebase FCM (push), Expo Server SDK (push V2), SendGrid (email),
  Twilio (SMS/OTP), Google Analytics 4, Google Places API, Replicate (upscale), Sharp, Rebrandly
- **Auth:** JWT + SAML 2.0 (university SSO, e.g., FAU)
- **Tests:** Jest 30 + ts-jest + MongoDB Memory Server

### Structure (`src/`)
- `index.ts` (entry + socket init), `config.ts`, `config/` (SAML, universities, GCS, certs)
- `routes/` (54 files) — includes `dualRouter.ts` (routes `/api/*` **and** legacy paths at the root)
- `controllers/` (70+), `services/` (61), `model/` (52 Mongoose schemas)
- `middleware/` (11 — auth, login rate limiting, bad words, permissions)
- `jobs/` (14 — event cleanup, recurring rollover, reminders, analytics aggregation,
  alerts, engagement scores)
- `sockets/` — `walk.socket`, `chat.socket`, `explore.socket` + auth middleware
- `validators/`, `repositories/`, `migrations/` (98+ scripts), `scripts/` (54, seed/utilities),
  `templates/emails/`

### Core domains
Auth/RBAC · Users/Profiles · **Events** (core) · **Walks** (spontaneous real-time meetups) ·
Chat/Messaging · Spaces/Places (campus locations + Google Places) · Ideas · Interests/Communities ·
Admin/Moderation · Notifications · Analytics/Metrics · Location/Discovery.

### Database
- **MongoDB Atlas.** Environments: **prod** (cluster `prod`), **staging**, local dev.
  > ⚠️ Team context note: the production DB is named **`prod`** (not `walky`/`staging`).
- **52 collections** (models). Core: `users`, `events`, `walks`, `chat`, `spaces`, `ideas`,
  `interests`. Relationships: `eventInvites`, `peerRequests`, `walkInvites`, `spaceMember`.
  Admin: `reports`, `roles`, `permissions`, `auditLogs`, `adminMessages`. Analytics:
  `campusMetricsCache`, `campusAlerts`, `userActivityLog`, `profileView`. Places: `place`,
  `placeType`, `popularPlace`, `campus`, `school`, `areaOfStudy`.

### Auth
- **JWT:** access 24h + refresh 7d. Payload `{ sub, email, role, tokenVersion, iat }`,
  issuer `walky-app`, audience `walky-users`. `authMiddleware.ts` validates it. Secret in `JWT_SECRET`.
  Revocation via incrementing `tokenVersion`.
- **SAML 2.0:** university SSO (`saml-config-v2.ts`, certs in `config/certificates/`).
- **RBAC:** Student/Faculty/Admin/Sales roles via IDs in env (`ADMIN_ROLE`, `STUDENT_ROLE`, etc.).

### Real-time (Socket.io)
Separate namespaces: **walk** (invites/live location), **chat** (DM + group),
**explore** (discovery feed). Rate limit 15 connections/min per IP (max 5). JWT auth on handshake.

### Local run
- Node 20+, MongoDB, Redis, `.env` (ask the team). `yarn install` → `yarn dev` → **port 8081**
  (or `PORT`). In this environment, it runs on **8080** for the app simulator.
- Scripts: `yarn dev|staging|prod|build|test|test:watch|lint|format|seed`.
- **Swagger:** local `http://localhost:8081/api-docs/`; staging/prod the same under their domains.

### Env vars (main ones)
`PORT`, `NODE_ENV`, `PROJECT_ID`, `MONGO_URI`, `REDIS_URL`, `JWT_SECRET`,
`FIREBASE_PROJECT_ID/PRIVATE_KEY/CLIENT_EMAIL`, `TWILIO_*`, `SENDGRID_API_KEY`,
`AWS_REGION/ACCESS_KEY_ID/SECRET_ACCESS_KEY/S3_BUCKET` (legacy), `EXPO_ACCESS_TOKEN`,
`ADMIN_ROLE/STUDENT_ROLE/FACULTY_ROLE/SALES_ROLE`, `REBRANDLY_API_KEY`.

### Environments
- Production: `https://api.walkyapp.com` (branch `main`)
- Staging: `https://staging.walkyapp.com` (branch `staging`)
- Dev: `http://localhost:8081`

---

## 3. walky-admin — Admin panel (CoreUI)

**Purpose:** a panel for **campus admins, school admins, moderators, and super-admins** to
manage students, events, spaces, ideas, moderation, and campus configuration.

### Stack
- **TypeScript** 5.8 · **React** 19.1 · **React Router** v7.6 · **Vite** 7 · **Node** ≥20
- **UI:** **CoreUI 5.7** + React Bootstrap 2.10 (traditional admin framework)
- **Data:** Axios 1.10 + React Query 5.82; types generated from Swagger via `swagger-typescript-api`
- **State:** React Context + React Query
- **Viz:** Recharts 3.4 + Three.js (3D visualizations in the "Playground")
- **Styling:** CSS + Sass, design tokens via CSS variables (dual: CoreUI + V2 tokens)
- **Tests:** Vitest 4 + React Testing Library + MSW; `data-testid` and a11y checks

### Structure (`src/`)
`API/` (generated Swagger client) · `components-v2/` (53 components) · `contexts/` (Auth, School,
Campus, Theme) · `hooks/` (`useAuth`, `usePermissions`, `useTheme`) · `layout-v2/` (Sidebar+Topbar) ·
`lib/` (logger, queryClient, permissions matrix) · `pages-v2/` (screens) · `routes/v2Routes.tsx`
(lazy loading) · `services/` (userService, campusService, etc.) · `styles-v2/` (tokens) · `test/`.

### Main screens
- **Dashboards (6):** Engagement, Popular Features, User Interactions, Community, Student Safety,
  Student Behavior
- **Campus/Students (4 lists):** Active, Banned, Deactivated, Disengaged
- **Events:** Manager, Insights, Check-In Analytics
- **Spaces:** Manager, Insights · **Ideas:** Manager, Insights
- **Moderation:** Report Safety, Report History
- **Administration (super/school admin):** Campuses (geofences, ambassadors), Ambassadors,
  Role Management, Administrator Settings
- **Playground:** 14 experimental data visualizations
- **Auth:** Login (+ optional 2FA), password recovery, forced password change

### Backend integration
- Axios with interceptors. Base URL from `VITE_API_BASE_URL`
  (prod `https://api.walkyapp.com/api`, local `http://localhost:8080|8081/api`).
- Bearer token in localStorage + CSRF protection (cookie token on non-GET requests).
- 401→logout/redirect to login; 403 with `ACCOUNT_DEACTIVATED`→modal; retry (max 3, skips 4xx except 408).
- Services layer + React Query (stale 5min, cache 10min).

### Auth
Token+user in localStorage. `useAuth()` is reactive. **RBAC** with roles
`super_admin`/`school_admin`/`campus_admin`/`moderator`/`walky_internal`; matrix in
`src/lib/permissions.ts`; `<PermissionGuard>` and `<AuthGuard>` protect routes. Cross-tab sync via
storage events.

### Build/run
`npm run dev` (port 5173), `build`, `preview`, `type-check`, `lint`, `test`, `test:coverage`,
`check:testids`, `check:a11y`, `check:all`, `generate:api` (requires `../walky-backend/swagger.json`),
`generate:icons`, `generate:images`. Deployed on Vercel.
Env: `VITE_API_BASE_URL`, `VITE_APP_NAME`, `VITE_ENV`, (optional) `VITE_GOOGLE_MAPS_API_KEY`,
`VITE_SENTRY_DSN`.
The local `.env` is git-ignored; only the committed template (`.env.example`/`.env.template`) is tracked.

---

## 4. walky-hq — Super-admin / Analytics panel (shadcn)

**Purpose:** an **HQ / super-admin** dashboard for the internal Walky team. Global platform
administration, advanced analytics, moderation, and configuration of core entities (users, schools,
campuses, interests, spaces, roles). It's the newest and most sophisticated system.

### Stack
- **React** 19 · **TypeScript** 5.7 (strict) · **Vite** 6 · **React Router** 6.22 · **Node** 18+ · Yarn
- **UI:** **shadcn/ui** (Radix) + **Tailwind CSS** 3.3 + Lucide + Sonner (modern, utility-first)
- **State:** Zustand 5 (auth, persisted in localStorage) + React Query 5.67 + Context (school/campus)
- **Data:** Axios 1.8 (interceptors + refresh) + React Hook Form 7.54 + Zod 3.24
- **Viz:** Recharts 3.3 · @dnd-kit (drag-and-drop) · Google Maps · Google Analytics Data API · Firebase 12

### Structure (`src/`)
`api/` (`client.ts` + 25+ services) · `components/` (`ui/` shadcn, `common/`, `analytics/`,
`layout/`, `filters/`) · `pages/` (35+) · `router/` (`ProtectedRoute.tsx`) · `store/authStore.ts` ·
`contexts/` (School, Campus) · `hooks/` · `types/` (hand-written; ~43 interfaces in `src/types/index.ts`) · `utils/` · `lib/` (firebase, cn).

### Main screens (35+ routes)
Dashboard (overview) · Engagement · Users · Walks · Events · Schools · Places · Popular Places ·
Interests · Interest Groups · Place Types · Surprise Rolls · Ideas · Spaces (+categories) ·
Roles (RBAC) · Reports · Banned Users · Areas of Study · Report Reasons · Deletion Requests ·
Audit Logs · User Activity · Locked Users · Jobs (background job monitoring) · Messages · Profile.
**Advanced analytics:** session, messaging, profile views, engagement, lifecycle, social graph,
referrals, safety.

### Backend integration
- `src/api/client.ts` (Axios). Base URL from `VITE_BASE_URL`
  (dev `http://localhost:8080`, staging `https://staging.walkyapp.com`, prod `https://api.walkyapp.com`).
- Interceptors: inject Bearer token; on 401, refresh and re-queue requests; on failure→logout/redirect.
- Tokens in localStorage (`token`, `refresh_token`, `auth-storage`). 25+ services in `api/services/`.

### Auth
JWT with refresh-token rotation. Zustand `authStore` persists `token/refreshToken/user/isAuthenticated`.
`ProtectedRoute` checks `isAuthenticated`. Known test credential: `gal@walkyapp.com`.

### Build/run
`yarn dev` (port 5173), `build`, `lint`, `preview`. Deployed on Vercel (`vercel.json`, output `dist/`).
Env: `VITE_BASE_URL` (required), `VITE_GA_PROPERTY_ID` (optional).
The local `.env` is git-ignored; only the committed template (`.env.example`/`.env.template`) is tracked.

---

## 5. Admin vs HQ — how they differ

| Aspect | walky-admin | walky-hq |
|--------|-------------|----------|
| UI | CoreUI 5 + Bootstrap | shadcn/ui + Tailwind |
| Build | Vite 7 | Vite 6 |
| State | Context + React Query | Zustand + React Query |
| Audience | Campus/school admins, moderators | Internal Walky super-admins |
| Focus | Per-campus operational management, moderation | Advanced global analytics, core-entity config |
| Maturity | CoreUI-based, operations-oriented system | Newer/more sophisticated system |

There is **functional overlap** (both have users, events, spaces, ideas, reports, roles, campus).
The distinction is one of **scope and audience**: Admin is per-campus/school operations; HQ is super-admin/global analytics.

---

## 6. Cross-cutting facts useful for the AI

- **Contract source:** the App and Admin derive their types from the **backend Swagger** (App via
  Orval, Admin via `swagger-typescript-api`), while HQ's types are hand-written. Documenting the
  backend first gives a foundation for the clients.
- **Consistent auth:** JWT (access + refresh) across the whole stack; role-based RBAC; the backend also
  supports university SAML SSO.
- **Real-time:** Socket.io on the backend (walk/chat/explore namespaces), consumed by the app.
- **Multi-tenant by campus/school:** `school`/`campus` entities run through every repo;
  School/Campus contexts exist in both Admin and HQ.
- **Shared business domains** (common vocabulary to document once): Users, Events,
  Walks, Chat, Spaces/Places, Ideas, Interests, Reports/Moderation, Analytics, Campus/School, Roles.
- **Deploy:** backend on GCP Cloud Run; Admin and HQ on Vercel; App via EAS (TestFlight / Firebase / Play).
- **Backend environments:** prod (`api.walkyapp.com`), staging (`staging.walkyapp.com`), local (8081).

---

## 7. Repository locations

```
/Volumes/SSDDEV/DEV_PROJETOS/
├── walkyApp/        # Mobile app (WOC)  — React Native / Expo
├── walky-backend/   # API + WS          — Node / Express / Mongo / Redis
├── walky-admin/     # Admin             — React / CoreUI / Vite
└── walky-hq/        # HQ super-admin    — React / shadcn / Vite
```

Each repository has its own `README.md`; `walky-hq` and `walky-admin` also have a
`claude.md`/`CLAUDE.md` with development notes.

---

## 8. How the AI should use this document

1. **Understand the whole** before documenting any repo in isolation (dependencies and shared contract).
2. **Write a documentation prompt** that:
   - documents the **backend first** (it's the source of the contract/types and business domains);
   - reuses the **domain vocabulary** from section 6 to keep repos consistent;
   - for each frontend, covers: purpose/audience, stack, folder structure, screens/features,
     backend integration (base URL/env/auth), build/run, and deploy;
   - highlights the **Admin vs HQ differences** to avoid duplication/confusion.
3. **Maintain a single glossary** of the domains (Events, Walks, Spaces, Ideas, Campus/School, Roles…)
   referenced across all four repositories.
