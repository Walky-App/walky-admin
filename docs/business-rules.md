# Walky Admin — Business Rules

> Rules extracted **from the code** of the `walky-admin` panel. Each rule cites the file that
> implements it. Rules that depend on the backend (not verifiable from the admin alone) are marked
> **(not confirmed in the admin)**. The admin's RBAC is **UX/presentation**; effective authorization
> lives in the backend.
>
> Companion document: [workflows.md](./workflows.md) (flows with diagrams).
> See also [overview.md](./overview.md), [integrations.md](./integrations.md).

## Table of Contents

- [1. Permission matrix by role](#1-permission-matrix-by-role)
- [2. Role assignment hierarchy](#2-role-assignment-hierarchy)
- [3. Moderation and student management rules](#3-moderation-and-student-management-rules)
- [4. Role names and mappings](#4-role-names-and-mappings)
- [5. Session and security rules](#5-session-and-security-rules)
- [6. Campus, geofence, and ambassador rules](#6-campus-geofence-and-ambassador-rules)
- [7. Form validations](#7-form-validations)
- [8. Route protection (route → resource)](#8-route-protection-route--resource)
- [Cross-links](#cross-links)

---

## 1. Permission matrix by role

**File:** `src/lib/permissions.ts` (`permissionMatrix`). Possible actions per resource:
`read | create | update | delete | export | manage`.

### Resources (`PermissionResource`)

Dashboard: `engagement`, `popular_features`, `user_interactions`, `community`, `student_safety`,
`student_behavior`. Students: `active_students`, `banned_students`, `inactive_students`,
`disengaged_students`, `reported_content`. Content: `events_manager`, `events_insights`,
`spaces_manager`, `spaces_insights`, `ideas_manager`, `ideas_insights`. Moderation: `report_safety`,
`report_history`. Admin: `campuses`, `ambassadors`, `role_management`.

### Consolidated matrix (what each role can do)

Legend: **R**=read, **C**=create, **U**=update, **D**=delete, **E**=export, **M**=manage, **—**=no access.

| Resource | super_admin | school_admin | campus_admin | moderator | walky_internal |
|---|---|---|---|---|---|
| **Dashboards** (all 6) | R, E | R, E | R, E | R | R |
| `active_students` | R, U, E | R, U, E | R, U, E | — | — |
| `banned_students` | R, U, E | R, U, E | R, U, E | — | — |
| `inactive_students` | R, U, E | R, U, E | R, U, E | — | — |
| `disengaged_students` | R, E | R, E | R, E | — | — |
| `reported_content` | R, U, E | R, U, E | R, U, E | — | — |
| `events_manager` | R, U, D, E | R, U, D, E | R, U, D, E | R | R |
| `events_insights` | R, E | R, E | R, E | R | R |
| `spaces_manager` | R, U, D, E | R, U, D, E | R, U, D, E | R | R |
| `spaces_insights` | R, E | R, E | R, E | R | R |
| `ideas_manager` | R, U, D, E | R, U, D, E | R, U, D, E | R | R |
| `ideas_insights` | R, E | R, E | R, E | R | R |
| `report_safety` | R, U, E | R, U, E | R, U, E | R, U, E | — |
| `report_history` | R, U, E | R, U, E | R, U, E | R, U, E | — |
| `campuses` | R, U | R, U | R, U | — | R |
| `ambassadors` | R, C, D | R, C, D | R, C, D | — | R |
| `role_management` | R, C, U, D, M | R, C, U, D, M | R, C, U, D, M | — | R |

**Notes from the code:**
- `super_admin`, `school_admin`, and `campus_admin` have an **identical matrix** in `permissions.ts`.
  The difference between them is **scope/tenant** (super sees all schools; school sees its school;
  campus sees its campus), enforced in the backend and reflected in the school/campus selectors (see
  §5 and [workflows.md §6](./workflows.md#6-switching-school--campus-multi-tenant)).
- **`moderator`:** dashboards **without export**; **no access** to student management or the Admin
  area; its power is in **Moderation** (report_safety/report_history: R, U, E).
- **`walky_internal`** (internal employee, "read-only"): everything **R** only (including `campuses`,
  `ambassadors`, `role_management` in read); **no** moderation and **no** student management.
- **Unknown** role → `noPermissions` (everything `false`), via `getPermissions()`.

> **(not confirmed in the admin)** The backend is the real source of authorization; the matrix above
> only governs the admin's UI/routes.

---

## 2. Role assignment hierarchy

**File:** `src/lib/permissions.ts` (`roleHierarchy`, `getAssignableRoles`, `canAssignRole`).

Who can **assign** which role to other members (used in RoleManagement / CreateMemberModal):

| User's role | Can assign |
|---|---|
| `super_admin` | `school_admin`, `campus_admin`, `moderator` |
| `school_admin` | `campus_admin`, `moderator` |
| `campus_admin` | `moderator` |
| `moderator` | (none) |
| `walky_internal` | (none) |

- No one (via this hierarchy) can assign `super_admin` or `walky_internal` — they do not appear in
  any `roleHierarchy` list.
- `getAssignableRoleDisplayNames(userRole)` translates to the display names used in the dropdowns.
- Helpers: `canAssignRole(userRole, targetRole)`, `canAssignRoleByDisplayName(userRole, displayName)`.

---

## 3. Moderation and student management rules

**Files:** `src/pages-v2/Campus/components/{StudentTable,BannedStudentTable,DeactivatedStudentTable}.tsx`,
`src/pages-v2/Moderation/ReportSafety/ReportSafety.tsx`, modals in `src/components-v2/*`,
`src/services/reportService.ts` (legacy — see note).

### 3.1 Student actions (actual v2 endpoints)

| Action | Endpoint | Payload / Rule |
|---|---|---|
| Ban | `PUT /api/admin/v2/students/{id}/lock-settings` | `{ isLocked:true, lockReason, lockDuration }` — `lockReason` required (modal blocks if empty) |
| Unban | `POST /api/admin/v2/students/{id}/unban` | — |
| Deactivate | `DELETE /api/admin/v2/students/{id}` | The student is **notified by email** about the deactivation (text from `DeactivateUserModal`). Reversible. |
| Activate | `POST /api/admin/v2/students/{id}/activate` | Reactivates a deactivated account |
| Flag | `POST /api/admin/v2/students/{id}/flag` | `{ reason }` (the reason may be auto-generated from the admin's email) |
| Unflag | `POST /api/admin/v2/students/{id}/unflag` | — |

**Ban durations** (`BanUserModal`, mapped to days): 1, 3, 7, 14, 30, 90.
**"Permanent" → 36500 days** (100 years). The modal also has the **"Resolve all related reports
for this user"** checkbox (checked by default).

### 3.2 "Incomplete onboarding" status (ActiveStudents)

**File:** `src/pages-v2/Campus/ActiveStudents/ActiveStudents.tsx`. A student is displayed as
**`incomplete`** when `isOnboarded === false` **or** they have **fewer than 3 interests**
(`interestCount < 3`). Otherwise the backend's `status` is kept.

### 3.3 Reports (ReportSafety)

- **Statuses (screen labels):** `Pending review`, `Under evaluation`, `Resolved`, `Dismissed`.
- **Mandatory note:** changing a status to **Resolved** or **Dismissed** requires a note (via
  `WriteNoteModal`, non-empty, max **500** characters). The note (`adminV2ReportsNoteCreate`) is
  written **before** the status change (`adminV2ReportsStatusPartialUpdate`). Other statuses change
  directly.
- **Flag/Unflag the reported item:** routed by type — `Students`/`Events`/`Ideas`/`Spaces`
  (`adminV2{Type}FlagCreate/UnflagCreate`), with an optimistic update of the `["reports"]` list.
- **Ban/Deactivate from the report:** reuses `adminV2StudentsLockSettingsUpdate` and
  `adminV2StudentsDelete`.

### 3.4 `reportService` layer (legacy / not used by the screen)

`src/services/reportService.ts` implements another moderation convention, pointing to endpoints
**without `v2`**: `adminReportsList/Detail/StatusPartialUpdate/BanUserCreate/BulkPartialUpdate`, with
- **Status:** `pending | under_review | resolved | dismissed`
- **Bulk `action`:** `resolve | dismiss | under_review`
- **Ban from the report:** `{ ban_duration, ban_reason, resolve_related_reports }`
- **removeUser:** `DELETE /api/admin/users/{id}/remove` with `{ reason, sendEmail }` (default `sendEmail=true`)

> The `ReportSafety` screen does **not** use this service (it uses `adminV2Reports*`). Treated as an
> **old layer**; kept in the repo but outside the active UI path.

---

## 4. Role names and mappings

**File:** `src/lib/permissions.ts` (`roleDisplayNameMap`, `displayNameToRoleMap`).

| Internal name | Display name |
|---|---|
| `super_admin` | Walky Admin |
| `school_admin` | School Admin |
| `campus_admin` | Campus Admin |
| `moderator` | Moderator |
| `walky_internal` | Walky Internal |

**Login allowlist** (`src/pages-v2/LoginV2/LoginV2.tsx`) — roles accepted into the panel:
`super_admin`, `walky_internal`, `school_admin`, `campus_admin`, `editor`, `moderator`, `staff`,
`viewer`. (Note that `editor`, `staff`, `viewer` **pass login but have no entry in the
`permissionMatrix`** → they would fall into `noPermissions` for every mapped resource.)

**Roles assignable via `rolesService.assignRole`** (`src/services/rolesService.ts`) — the type accepts
a larger set: `super_admin | school_admin | campus_admin | editor | moderator | staff | viewer |
student | faculty | parent`. **(not confirmed in the admin)** which ones are actually valid is decided
by the backend.

---

## 5. Session and security rules

**Files:** `src/hooks/useAuth.ts`, `src/API/index.ts`, `src/layout-v2/TopbarV2/TopbarV2.tsx`,
`src/contexts/DeactivatedUserContext.tsx`, `src/pages-v2/ForcePasswordChange/ForcePasswordChange.tsx`.

1. **Session source of truth = `localStorage`** (`token`, `user`). There is no app-side session
   cookie for auth (but `withCredentials: true` is used for the CSRF cookie).
2. **JWT token in `Authorization: Bearer`** injected into every request by the interceptor. If `user`
   in storage is corrupted, `useAuth` clears `token` + `user`.
3. **CSRF:** on **non-GET** requests (`!get/head/options`), the interceptor reads the CSRF cookie
   (`csrf_cookie_rr` → `XSRF-TOKEN` → `csrf_token` → `_csrf`) and sends it in `X-CSRF-Token` **and**
   `X-XSRF-Token`.
4. **401 → logout:** the interceptor removes `token` and redirects to `/login` (if not already there).
   **There is no refresh token** in the admin: the login's `refresh_token` is not persisted and
   `POST /api/refresh-token` is not called.
5. **403 `ACCOUNT_DEACTIVATED` / `USER_DEACTIVATED` → deactivated-account modal** (blocking). An
   ordinary permission 403 does **not** open the modal.
6. **Forced password change:** if `require_password_change` at login, the user is taken to
   `/force-password-change` (new password min. 8, confirm matching; `currentPassword` empty because it
   is a forced reset). The route is public but the page revalidates the session and the flag.
7. **Cross-tab sync:** logout/login in one tab propagates to others via the native `storage` event
   (`useAuth`), and within the same tab via the custom `auth:user-updated` event.
8. **Logout:** removes `token`+`user` (Topbar) — does **not** remove `selectedSchool`/`selectedCampus`.
   The deactivated-account logout also removes `refreshToken`. Both use `window.location.href = "/login"`.
9. **RBAC is client-side (UX):** `AuthGuard` protects the authenticated area and `PermissionGuard`
   protects each route; inline actions disappear via `can*()`/`fallback="hidden"`. **Real authorization
   lives in the backend.**
10. **Log out of all devices** and **2FA** exist in AdministratorSettings
    (`adminV2SettingsLogoutAllCreate`, `adminProfile2Fa{Enable,Disable}Create`) — the real
    validation/effect lives in the backend. **(not confirmed in the admin)**.

> **Note (security):** the generated client's base strips the `/api` suffix (`baseURL.replace(/\/api\/?$/, "")`)
> because admin routes already include `/api/...` and legacy routes hit the root (`/campus`, `/ambassadors`).
> See [workflows.md §T1](./workflows.md#t1-axios-layer-interceptors-csrf-token).

---

## 6. Campus, geofence, and ambassador rules

**Files:** `src/services/campusService.ts`, `src/services/campusSyncService.ts`,
`src/pages-v2/CampusBoundary/CampusBoundary.tsx`, `src/services/ambassadorService.ts`,
`src/components-v2/AddAmbassadorModal/AddAmbassadorModal.tsx`.

### 6.1 Campus

- **Create/update fields** (`campusService.create/update`): **required** `campus_name`,
  `phone_number`, `address`, `city`, `state`, `zip`, `time_zone`. **Optional** `campus_short_name`,
  `image_url`, `ambassador_ids[]`, `coordinates` (Polygon), `dawn_to_dusk[]`, `is_active` (default `true`).
- **`campusService.getAll`** treats **404 as an empty list** (no error). Create logs extra details on
  a 400 error (backend validation).
- **Mapping** `_id → id` for frontend compatibility.

### 6.2 Geofence (boundary)

- A polygon drawn on Google Maps needs a **minimum of 3 vertices**; the ring is **closed** (first
  point repeated at the end) and saved as a GeoJSON `Polygon` with coords **`[lng, lat]`** (WGS84).
- **`previewCampusBoundary(id)`** returns `bounds`, `center`, `area_sqm`/`area_acres`, `search_points`
  used in the place sync.
- **Google Maps key hardcoded** in `CampusBoundary.tsx` (the `VITE_GOOGLE_MAPS_API_KEY` env suggested
  in `.env.example` is **not read**). See [integrations.md](./integrations.md).

### 6.3 Place sync

`campusSyncService`: `syncCampus`, `syncAllCampuses`, `getSyncLogs`, `getCampusesWithSyncStatus`,
`previewCampusBoundary`. Sync status: `completed | failed | partial | in_progress`. Each sync
reports `places_added/updated/removed`, `api_calls_used`, `sync_duration_ms`, `errors[]`.
**(not confirmed in the admin)** the rules for how many Google Places calls / limits live in the backend.

### 6.4 Ambassadors

- Create fields (`ambassadorService.create`): `name`, `email` (required); optional `phone`,
  `student_id`, `is_active` (default `true`), `profile_image_url`, `bio`, `graduation_year`, `major`.
- **`getAll` is fail-soft** (returns `[]` on error); the other operations propagate errors.
- In `AddAmbassadorModal`, students are searched by **exact name**
  (`adminV2MembersList({ role:"student", exactMatch:true })`) and each selection becomes an ambassador
  with `{ name, email, user_id, school_id, campuses_id[] }`.
- Actions gated by `canCreate("ambassadors")` / `canDelete("ambassadors")`.

---

## 7. Form validations

Source: the components of each screen/modal cited.

| Form | Field | Rule | File |
|---|---|---|---|
| Login | email/password | both `required`; role must be in the allowlist | `LoginV2.tsx` |
| Force password change | newPassword | `>= 8` chars and `=== confirmPassword` | `ForcePasswordChange.tsx` |
| Recover — OTP | otp | exactly **6 digits** (`/^\d{6}$/`), trimmed; max 6 attempts (lockout) | `RecoverPasswordV2/VerifyCodeStep.tsx` |
| Recover — reset | password | `>= 8` and `=== confirm`; backend "Password validation failed" errors listed | `RecoverPasswordV2/ResetPasswordStep.tsx` |
| Settings — password | newPassword | `>= 8`, confirm matching, `currentPassword` required | `AdministratorSettings.tsx` |
| Settings — avatar | avatar | image, max **5MB** | `AdministratorSettings.tsx` |
| Ban user | reason | **required** (button disabled if empty); default duration "1 Day" | `BanUserModal.tsx` |
| Write note (report) | note | non-empty; `maxCharacters` **500** | `WriteNoteModal.tsx` |
| Create member | firstName, lastName, email, role | all required; email format; role filtered by hierarchy | `CreateMemberModal.tsx` |
| Campus | campus_name, phone_number, address, city, state, zip, time_zone | required | `campusService.ts` / page form |
| Ambassador | name, email | required | `ambassadorService.ts` / `AddAmbassadorModal.tsx` |

> Many validations are **duplicated in the backend** — the admin does the UX validation; the backend
> rejects definitively. **(not confirmed in the admin)** the exact backend limits (e.g., password policy).

---

## 8. Route protection (route → resource)

**File:** `src/lib/permissions.ts` (`routeResourceMap`, `canAccessRoute`) + `src/routes/v2Routes.tsx`.

Each route mapped to a resource is protected by `PermissionGuard` with `action = 'read'`
(`fallback="redirect"` → `/dashboard/engagement`).

| Route | Resource |
|---|---|
| `/dashboard/engagement` | `engagement` |
| `/dashboard/popular-features` | `popular_features` |
| `/dashboard/user-interactions` | `user_interactions` |
| `/dashboard/community` | `community` |
| `/dashboard/student-safety` | `student_safety` |
| `/dashboard/student-behavior` | `student_behavior` |
| `/manage-students/active` | `active_students` |
| `/manage-students/banned` | `banned_students` |
| `/manage-students/deactivated` | `inactive_students` |
| `/manage-students/disengaged` | `disengaged_students` |
| `/events` · `/events/insights` · `/events/check-in` | `events_manager` · `events_insights` · `events_insights` |
| `/spaces` · `/spaces/insights` | `spaces_manager` · `spaces_insights` |
| `/ideas` · `/ideas/insights` | `ideas_manager` · `ideas_insights` |
| `/report-safety` · `/report-history` | `report_safety` · `report_history` |
| `/admin/campuses` · `/admin/ambassadors` · `/admin/role-management` | `campuses` · `ambassadors` · `role_management` |

**`canAccessRoute` rules:**
- Route **without** a mapping → **allowed by default** (e.g., `/admin/settings` — no `PermissionGuard`
  in the router; any authenticated admin can access it).
- Mapped route → requires `hasPermission(role, resource, 'read')`.
- `/manage-students/deactivated` maps to the **`inactive_students`** resource (the internal name
  differs from the "deactivated" path).
- **Playground** routes (14 views) and the `*` (404) have no permission guard.
- Legacy redirects: `/campuses`, `/ambassadors`, `/role-management` → `/admin/...`.

---

## Cross-links

- [workflows.md](./workflows.md) — end-to-end flows with Mermaid diagrams.
- [overview.md](./overview.md) — purpose, stack, audience, env vars.
- [integrations.md](./integrations.md) — API layer and integrations (Google Maps, etc.).
- [conventions.md](./conventions.md) — code conventions.
- Backend controllers:
  [admin/admin-students-controller.md](./admin/admin-students-controller.md),
  [admin/admin-reports-controller.md](./admin/admin-reports-controller.md),
  [admin/admin-settings-controller.md](./admin/admin-settings-controller.md),
  [admin/admin-ambassadors-controller.md](./admin/admin-ambassadors-controller.md).
