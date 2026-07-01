# Walky Admin — Regras de Negócio

> Regras extraídas **do código** do painel `walky-admin`. Cada regra cita o arquivo que a
> implementa. Regras que dependem do backend (não confirmáveis só pelo admin) estão marcadas com
> **(não confirmado no admin)**. O RBAC do admin é de **UX/apresentação**; a autorização efetiva é
> do backend.
>
> Documento-irmão: [workflows.md](./workflows.md) (fluxos com diagramas).
> Ver também [overview.md](./overview.md), [integrations.md](./integrations.md).

## Índice

- [1. Matriz de permissões por role](#1-matriz-de-permissões-por-role)
- [2. Hierarquia de atribuição de roles](#2-hierarquia-de-atribuição-de-roles)
- [3. Regras de moderação e gestão de estudantes](#3-regras-de-moderação-e-gestão-de-estudantes)
- [4. Nomes de roles e mapeamentos](#4-nomes-de-roles-e-mapeamentos)
- [5. Regras de sessão e segurança](#5-regras-de-sessão-e-segurança)
- [6. Regras de campus, geofences e ambassadors](#6-regras-de-campus-geofences-e-ambassadors)
- [7. Validações de formulários](#7-validações-de-formulários)
- [8. Proteção de rotas (route → resource)](#8-proteção-de-rotas-route--resource)
- [Cross-links](#cross-links)

---

## 1. Matriz de permissões por role

**Arquivo:** `src/lib/permissions.ts` (`permissionMatrix`). Ações possíveis por recurso:
`read | create | update | delete | export | manage`.

### Recursos (`PermissionResource`)

Dashboard: `engagement`, `popular_features`, `user_interactions`, `community`, `student_safety`,
`student_behavior`. Estudantes: `active_students`, `banned_students`, `inactive_students`,
`disengaged_students`, `reported_content`. Conteúdo: `events_manager`, `events_insights`,
`spaces_manager`, `spaces_insights`, `ideas_manager`, `ideas_insights`. Moderação: `report_safety`,
`report_history`. Admin: `campuses`, `ambassadors`, `role_management`.

### Matriz consolidada (o que cada role pode)

Legenda: **R**=read, **C**=create, **U**=update, **D**=delete, **E**=export, **M**=manage, **—**=sem acesso.

| Recurso | super_admin | school_admin | campus_admin | moderator | walky_internal |
|---|---|---|---|---|---|
| **Dashboards** (todos os 6) | R, E | R, E | R, E | R | R |
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

**Observações do código:**
- `super_admin`, `school_admin` e `campus_admin` têm **matriz idêntica** em `permissions.ts`. A
  diferença entre eles é **escopo/tenant** (super vê todas as escolas; school vê sua escola; campus
  seu campus), imposto no backend e refletido nos seletores de escola/campus (ver §5 e
  [workflows.md §6](./workflows.md#6-troca-de-escola--campus-multi-tenant)).
- **`moderator`:** dashboards **sem export**; **sem acesso** à gestão de estudantes e à área Admin;
  seu poder está em **Moderação** (report_safety/report_history: R, U, E).
- **`walky_internal`** (funcionário interno, "read-only"): tudo **R** apenas (inclui `campuses`,
  `ambassadors`, `role_management` em read); **sem** moderação e **sem** gestão de estudantes.
- Role **desconhecido** → `noPermissions` (tudo `false`), via `getPermissions()`.

> **(não confirmado no admin)** O backend é a fonte real da autorização; a matriz acima só governa a
> UI/rotas do admin.

---

## 2. Hierarquia de atribuição de roles

**Arquivo:** `src/lib/permissions.ts` (`roleHierarchy`, `getAssignableRoles`, `canAssignRole`).

Quem pode **atribuir** qual role a outros membros (usado no RoleManagement / CreateMemberModal):

| Role do usuário | Pode atribuir |
|---|---|
| `super_admin` | `school_admin`, `campus_admin`, `moderator` |
| `school_admin` | `campus_admin`, `moderator` |
| `campus_admin` | `moderator` |
| `moderator` | (nenhum) |
| `walky_internal` | (nenhum) |

- Ninguém (via essa hierarquia) pode atribuir `super_admin` ou `walky_internal` — não aparecem em
  nenhuma lista de `roleHierarchy`.
- `getAssignableRoleDisplayNames(userRole)` traduz para os nomes de exibição usados nos dropdowns.
- Helpers: `canAssignRole(userRole, targetRole)`, `canAssignRoleByDisplayName(userRole, displayName)`.

---

## 3. Regras de moderação e gestão de estudantes

**Arquivos:** `src/pages-v2/Campus/components/{StudentTable,BannedStudentTable,DeactivatedStudentTable}.tsx`,
`src/pages-v2/Moderation/ReportSafety/ReportSafety.tsx`, modais em `src/components-v2/*`,
`src/services/reportService.ts` (legado — ver nota).

### 3.1 Ações sobre estudantes (endpoints v2 reais)

| Ação | Endpoint | Payload / Regra |
|---|---|---|
| Ban | `PUT /api/admin/v2/students/{id}/lock-settings` | `{ isLocked:true, lockReason, lockDuration }` — `lockReason` obrigatório (modal bloqueia se vazio) |
| Unban | `POST /api/admin/v2/students/{id}/unban` | — |
| Deactivate | `DELETE /api/admin/v2/students/{id}` | Estudante é **notificado por email** sobre a desativação (texto do `DeactivateUserModal`). Reversível. |
| Activate | `POST /api/admin/v2/students/{id}/activate` | Reativa conta desativada |
| Flag | `POST /api/admin/v2/students/{id}/flag` | `{ reason }` (motivo pode ser auto-gerado a partir do email do admin) |
| Unflag | `POST /api/admin/v2/students/{id}/unflag` | — |

**Durações de ban** (`BanUserModal`, mapeadas para dias): 1, 3, 7, 14, 30, 90.
**"Permanent" → 36500 dias** (100 anos). O modal também tem o checkbox **"Resolve all related reports
for this user"** (default marcado).

### 3.2 Status de "onboarding incompleto" (ActiveStudents)

**Arquivo:** `src/pages-v2/Campus/ActiveStudents/ActiveStudents.tsx`. Um estudante é exibido como
**`incomplete`** quando `isOnboarded === false` **ou** possui **menos de 3 interesses**
(`interestCount < 3`). Caso contrário mantém o `status` do backend.

### 3.3 Reports (ReportSafety)

- **Status (labels da tela):** `Pending review`, `Under evaluation`, `Resolved`, `Dismissed`.
- **Nota obrigatória:** mudar status para **Resolved** ou **Dismissed** exige nota (via
  `WriteNoteModal`, não-vazia, máx **500** caracteres). A nota (`adminV2ReportsNoteCreate`) é gravada
  **antes** da mudança de status (`adminV2ReportsStatusPartialUpdate`). Outros status mudam direto.
- **Flag/Unflag do item denunciado:** roteia por tipo — `Students`/`Events`/`Ideas`/`Spaces`
  (`adminV2{Tipo}FlagCreate/UnflagCreate`), com update otimista da lista `["reports"]`.
- **Banir/Desativar a partir do report:** reutiliza `adminV2StudentsLockSettingsUpdate` e
  `adminV2StudentsDelete`.

### 3.4 Camada `reportService` (legado / não usado pela tela)

`src/services/reportService.ts` implementa outra convenção de moderação, apontando para endpoints
**sem `v2`**: `adminReportsList/Detail/StatusPartialUpdate/BanUserCreate/BulkPartialUpdate`, com
- **Status:** `pending | under_review | resolved | dismissed`
- **Bulk `action`:** `resolve | dismiss | under_review`
- **Ban a partir do report:** `{ ban_duration, ban_reason, resolve_related_reports }`
- **removeUser:** `DELETE /api/admin/users/{id}/remove` com `{ reason, sendEmail }` (default `sendEmail=true`)

> A tela `ReportSafety` **não** usa esse service (usa `adminV2Reports*`). Tratado como **camada
> antiga**; mantido no repo mas fora do caminho ativo de UI.

---

## 4. Nomes de roles e mapeamentos

**Arquivo:** `src/lib/permissions.ts` (`roleDisplayNameMap`, `displayNameToRoleMap`).

| Nome interno | Nome de exibição |
|---|---|
| `super_admin` | Walky Admin |
| `school_admin` | School Admin |
| `campus_admin` | Campus Admin |
| `moderator` | Moderator |
| `walky_internal` | Walky Internal |

**Allowlist de login** (`src/pages-v2/LoginV2/LoginV2.tsx`) — roles aceitos no painel:
`super_admin`, `walky_internal`, `school_admin`, `campus_admin`, `editor`, `moderator`, `staff`,
`viewer`. (Note que `editor`, `staff`, `viewer` **passam no login mas não têm entrada na
`permissionMatrix`** → cairiam em `noPermissions` para todo recurso mapeado.)

**Roles atribuíveis via `rolesService.assignRole`** (`src/services/rolesService.ts`) — o tipo aceita
um conjunto maior: `super_admin | school_admin | campus_admin | editor | moderator | staff | viewer |
student | faculty | parent`. **(não confirmado no admin)** quais são de fato válidos é decidido pelo
backend.

---

## 5. Regras de sessão e segurança

**Arquivos:** `src/hooks/useAuth.ts`, `src/API/index.ts`, `src/layout-v2/TopbarV2/TopbarV2.tsx`,
`src/contexts/DeactivatedUserContext.tsx`, `src/pages-v2/ForcePasswordChange/ForcePasswordChange.tsx`.

1. **Fonte de verdade da sessão = `localStorage`** (`token`, `user`). Não há cookie de sessão do lado
   do app para auth (mas `withCredentials: true` é usado para o cookie de CSRF).
2. **Token JWT em `Authorization: Bearer`** injetado em toda request pelo interceptor. Se `user` no
   storage estiver corrompido, `useAuth` limpa `token` + `user`.
3. **CSRF:** em requests **não-GET** (`!get/head/options`), o interceptor lê o cookie CSRF
   (`csrf_cookie_rr` → `XSRF-TOKEN` → `csrf_token` → `_csrf`) e o envia em `X-CSRF-Token` **e**
   `X-XSRF-Token`.
4. **401 → logout:** o interceptor remove `token` e redireciona a `/login` (se ainda não estiver lá).
   **Não há refresh token** no admin: o `refresh_token` do login não é persistido e
   `POST /api/refresh-token` não é chamado.
5. **403 `ACCOUNT_DEACTIVATED` / `USER_DEACTIVATED` → modal de conta desativada** (bloqueante). Um
   403 comum de permissão **não** abre o modal.
6. **Troca forçada de senha:** se `require_password_change` no login, o usuário é levado a
   `/force-password-change` (nova senha mín. 8, confirmar igual; `currentPassword` vazio por ser reset
   forçado). A rota é pública mas a página revalida sessão e a flag.
7. **Sync entre abas:** logout/login numa aba propaga para outras via evento nativo `storage`
   (`useAuth`), e na mesma aba via evento custom `auth:user-updated`.
8. **Logout:** remove `token`+`user` (Topbar) — **não** remove `selectedSchool`/`selectedCampus`. O
   logout de conta desativada remove também `refreshToken`. Ambos usam `window.location.href = "/login"`.
9. **RBAC é client-side (UX):** `AuthGuard` protege a área autenticada e `PermissionGuard` cada rota;
   ações inline somem via `can*()`/`fallback="hidden"`. **A autorização real é do backend.**
10. **Logout de todos os dispositivos** e **2FA** existem em AdministratorSettings
    (`adminV2SettingsLogoutAllCreate`, `adminProfile2Fa{Enable,Disable}Create`) — a validação/efeito
    real é do backend. **(não confirmado no admin)**.

> **Nota (segurança):** a base do cliente gerado remove o sufixo `/api` (`baseURL.replace(/\/api\/?$/, "")`)
> porque rotas admin já incluem `/api/...` e rotas legadas batem na raiz (`/campus`, `/ambassadors`).
> Ver [workflows.md §T1](./workflows.md#t1-camada-axios-interceptors-csrf-token).

---

## 6. Regras de campus, geofences e ambassadors

**Arquivos:** `src/services/campusService.ts`, `src/services/campusSyncService.ts`,
`src/pages-v2/CampusBoundary/CampusBoundary.tsx`, `src/services/ambassadorService.ts`,
`src/components-v2/AddAmbassadorModal/AddAmbassadorModal.tsx`.

### 6.1 Campus

- **Campos do create/update** (`campusService.create/update`): **obrigatórios** `campus_name`,
  `phone_number`, `address`, `city`, `state`, `zip`, `time_zone`. **Opcionais** `campus_short_name`,
  `image_url`, `ambassador_ids[]`, `coordinates` (Polygon), `dawn_to_dusk[]`, `is_active` (default `true`).
- **`campusService.getAll`** trata **404 como lista vazia** (sem erro). O create loga detalhes extras
  em erro 400 (validação do backend).
- **Mapeamento** `_id → id` para compat com o frontend.

### 6.2 Geofence (boundary)

- Polígono desenhado no Google Maps precisa de **mínimo 3 vértices**; o anel é **fechado** (primeiro
  ponto repetido no fim) e salvo como GeoJSON `Polygon` com coords **`[lng, lat]`** (WGS84).
- **`previewCampusBoundary(id)`** retorna `bounds`, `center`, `area_sqm`/`area_acres`, `search_points`
  usados no sync de places.
- **Chave do Google Maps hardcoded** em `CampusBoundary.tsx` (a env `VITE_GOOGLE_MAPS_API_KEY`
  sugerida no `.env.example` **não é lida**). Ver [integrations.md](./integrations.md).

### 6.3 Sync de places

`campusSyncService`: `syncCampus`, `syncAllCampuses`, `getSyncLogs`, `getCampusesWithSyncStatus`,
`previewCampusBoundary`. Status de sync: `completed | failed | partial | in_progress`. Cada sync
reporta `places_added/updated/removed`, `api_calls_used`, `sync_duration_ms`, `errors[]`.
**(não confirmado no admin)** as regras de quantas chamadas ao Google Places / limites são do backend.

### 6.4 Ambassadors

- Campos do create (`ambassadorService.create`): `name`, `email` (obrigatórios); opcionais `phone`,
  `student_id`, `is_active` (default `true`), `profile_image_url`, `bio`, `graduation_year`, `major`.
- **`getAll` é fail-soft** (retorna `[]` em erro); as demais operações propagam erro.
- No `AddAmbassadorModal`, estudantes são buscados por **nome exato**
  (`adminV2MembersList({ role:"student", exactMatch:true })`) e cada seleção vira um ambassador com
  `{ name, email, user_id, school_id, campuses_id[] }`.
- Ações gated por `canCreate("ambassadors")` / `canDelete("ambassadors")`.

---

## 7. Validações de formulários

Fonte: componentes de cada tela/modal citados.

| Formulário | Campo | Regra | Arquivo |
|---|---|---|---|
| Login | email/senha | ambos `required`; role deve estar na allowlist | `LoginV2.tsx` |
| Force password change | newPassword | `>= 8` chars e `=== confirmPassword` | `ForcePasswordChange.tsx` |
| Recover — OTP | otp | exatamente **6 dígitos** (`/^\d{6}$/`), trim; máx 6 tentativas (lockout) | `RecoverPasswordV2/VerifyCodeStep.tsx` |
| Recover — reset | password | `>= 8` e `=== confirm`; erros de backend "Password validation failed" listados | `RecoverPasswordV2/ResetPasswordStep.tsx` |
| Settings — senha | newPassword | `>= 8`, confirmar igual, `currentPassword` obrigatório | `AdministratorSettings.tsx` |
| Settings — avatar | avatar | imagem, máx **5MB** | `AdministratorSettings.tsx` |
| Ban user | reason | **obrigatório** (botão desabilitado se vazio); duração default "1 Day" | `BanUserModal.tsx` |
| Write note (report) | note | não-vazia; `maxCharacters` **500** | `WriteNoteModal.tsx` |
| Create member | firstName, lastName, email, role | todos obrigatórios; email formato; role filtrado por hierarquia | `CreateMemberModal.tsx` |
| Campus | campus_name, phone_number, address, city, state, zip, time_zone | obrigatórios | `campusService.ts` / form da página |
| Ambassador | name, email | obrigatórios | `ambassadorService.ts` / `AddAmbassadorModal.tsx` |

> Muitas validações são **duplicadas no backend** — o admin faz a validação de UX; o backend rejeita
> definitivamente. **(não confirmado no admin)** os limites exatos do backend (ex.: política de senha).

---

## 8. Proteção de rotas (route → resource)

**Arquivo:** `src/lib/permissions.ts` (`routeResourceMap`, `canAccessRoute`) + `src/routes/v2Routes.tsx`.

Cada rota mapeada a um recurso é protegida por `PermissionGuard` com `action = 'read'`
(`fallback="redirect"` → `/dashboard/engagement`).

| Rota | Recurso |
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

**Regras de `canAccessRoute`:**
- Rota **sem** mapeamento → **permitida por padrão** (ex.: `/admin/settings` — sem `PermissionGuard`
  no roteador; qualquer admin autenticado acessa).
- Rota mapeada → exige `hasPermission(role, resource, 'read')`.
- `/manage-students/deactivated` mapeia para o recurso **`inactive_students`** (nome interno difere
  do caminho "deactivated").
- Rotas do **Playground** (14 visualizações) e o `*` (404) não têm guard de permissão.
- Redirects legados: `/campuses`, `/ambassadors`, `/role-management` → `/admin/...`.

---

## Cross-links

- [workflows.md](./workflows.md) — fluxos de ponta a ponta com diagramas Mermaid.
- [overview.md](./overview.md) — propósito, stack, público-alvo, env vars.
- [integrations.md](./integrations.md) — camada de API e integrações (Google Maps, etc.).
- [conventions.md](./conventions.md) — convenções de código.
- Controllers do backend:
  [admin/admin-students-controller.md](./admin/admin-students-controller.md),
  [admin/admin-reports-controller.md](./admin/admin-reports-controller.md),
  [admin/admin-settings-controller.md](./admin/admin-settings-controller.md),
  [admin/admin-ambassadors-controller.md](./admin/admin-ambassadors-controller.md).
