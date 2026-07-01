# Walky Admin — Estrutura de Pastas

> O que cada diretório importante contém e **por quê**. Foco em `src/`, no significado do sufixo
> **`-v2`**, e nas fronteiras entre camada de dados, RBAC, UI e tema.

## Índice

- [1. Raiz do repositório](#1-raiz-do-repositório)
- [2. `src/` — mapa geral](#2-src--mapa-geral)
- [3. O sufixo `-v2` — por que existe](#3-o-sufixo--v2--por-que-existe)
- [4. `API/` — cliente gerado por Swagger](#4-api--cliente-gerado-por-swagger)
- [5. `services/` — service layer](#5-services--service-layer)
- [6. `lib/` — permissões, query, logger, utils](#6-lib--permissões-query-logger-utils)
- [7. `contexts/` — estado de UI/seleção](#7-contexts--estado-de-uiseleção)
- [8. `hooks/` — auth, permissões, filtros, tema](#8-hooks--auth-permissões-filtros-tema)
- [9. `layout-v2/` — shell (Sidebar + Topbar)](#9-layout-v2--shell-sidebar--topbar)
- [10. `components-v2/` — biblioteca de componentes](#10-components-v2--biblioteca-de-componentes)
- [11. `pages-v2/` — as telas](#11-pages-v2--as-telas)
- [12. `routes/` — mapa de rotas](#12-routes--mapa-de-rotas)
- [13. `types/` — tipos hand-written](#13-types--tipos-hand-written)
- [14. `styles-v2/` e `theme.ts`](#14-styles-v2-e-themets)
- [15. `test/`, `scripts/`, `docs/`](#15-test-scripts-docs)
- [Cross-links](#cross-links)

---

## 1. Raiz do repositório

| Path | O que é |
|------|---------|
| `package.json` | Pacote `admin-panel`; scripts, deps (ver [overview](./overview.md#6-stack-completa-versões-reais-e-o-porquê)). |
| `vite.config.ts` | Config Vite: plugins react + svgr; `esbuild.pure` remove console.* em prod; `manualChunks` (react-vendor/coreui/charts/query). |
| `vitest.config.ts` | Config de teste (jsdom, setup, coverage V8 com ratchet, alias `@ → src`). |
| `tsconfig*.json` | `tsconfig.json` (referências) → `tsconfig.app.json` (app, `strict`, `noUnusedLocals`) + `tsconfig.node.json` (config files). |
| `eslint.config.js` | ESLint flat config (typescript-eslint + react-hooks/react-refresh). |
| `.env` / `.env.example` / `.env.template` | Env `VITE_*` (ver overview). |
| `.nvmrc` | Node **22**. |
| `vercel.json` | Deploy Vercel: framework vite, SPA rewrite, `NODE_VERSION 22`. |
| `index.html` | HTML raiz da SPA (monta `#root`). |
| `clean-build.sh` | Usado no pré-commit (lint-staged) e no script `clean`. |
| `scripts/` | `generate-icons.cjs`, `generate-images.cjs`, `check-test-ids.js`, `check-accessibility.js`. |
| `docs/` | Esta documentação + `docs/admin/*` (docs dos controllers do backend) e `docs/TESTING.md`. |
| `public/`, `dist/`, `coverage/` | Estáticos, build e relatório de cobertura. |

## 2. `src/` — mapa geral

```
src/
├── main.tsx            # entry: providers (QueryClient→Theme→School→BrowserRouter→App)
├── App.tsx             # rotas públicas vs. AuthGuard→V2Routes; Toaster
├── theme.ts            # getTheme(isDark) → objeto de cores do app
├── index.css / App.css # CSS base
├── API/                # cliente HTTP GERADO por Swagger + interceptors (index.ts)
├── services/           # service layer sobre apiClient (12 services)
├── lib/                # permissions, queryClient, logger, utils
├── contexts/           # Theme, School, Campus, Dashboard, DeactivatedUser
├── hooks/              # useAuth, usePermissions, useCampusFilter, useTheme, ...
├── types/              # tipos TS hand-written (extensões dos gerados)
├── routes/             # v2Routes.tsx (lazy routes + PermissionGuard)
├── layout-v2/          # shell: LayoutV2 + SidebarV2 + TopbarV2
├── components-v2/      # 50+ componentes reutilizáveis (guards, modais, tabelas, filtros)
├── pages-v2/           # telas (Dashboard, Campus, Events, Spaces, Ideas, Moderation, Admin, ...)
├── styles-v2/          # design tokens (CSS vars + .ts), global.css
├── assets-v2/          # imagens/svg do design V2
├── assets/             # assets legados (coexistem)
└── test/               # setup + helpers de teste (Vitest/MSW)
```

## 3. O sufixo `-v2` — por que existe

O `-v2` marca um **redesign completo da camada de UI**, feito **sem** reescrever a arquitetura de
dados. A divisão é nítida:

| Com `-v2` (camada de UI redesenhada) | Sem `-v2` (fundação preservada / genérica) |
|---|---|
| `components-v2/`, `pages-v2/`, `layout-v2/`, `styles-v2/`, `assets-v2/` | `API/`, `services/`, `lib/`, `contexts/`, `hooks/`, `types/`, `routes/`, `test/`, `assets/` |

Ou seja: a **apresentação** (componentes, telas, layout, estilos, assets do Figma) foi refeita numa
nova geração V2, enquanto **cliente HTTP, services, contexts, hooks, permissões e tipos** continuam
compartilhados/estáveis. Sinais no código que confirmam a migração:

- `App.tsx` redireciona paths legados `/v2/*` para a raiz (`V2RedirectHandler`) — os caminhos novos
  viraram o padrão e o prefixo `/v2` antigo é reescrito.
- `assets/` (legado) **coexiste** com `assets-v2/` (novo, com `README.md`, `images/`, `svg/`).
- `routes/v2Routes.tsx` (o único arquivo de rotas ativo) monta tudo dentro de `layout-v2`.

> Regra prática ao contribuir: **UI nova vai em `*-v2`**; lógica de dados/estado vai nos diretórios
> sem sufixo.

## 4. `API/` — cliente gerado por Swagger

`src/API/` — a fronteira HTTP com o backend. Ver detalhes em
[architecture §4](./architecture.md#4-camada-de-dados-axios-gerado--services--react-query).

| Arquivo | Conteúdo |
|---------|----------|
| `WalkyAPI.ts` | **Gerado** (`swagger-typescript-api`, ~15k linhas): classe `Api` (endpoints tipados) + `HttpClient`. `// @ts-nocheck`. |
| `Api.ts`, `Admin.ts`, `Users.ts`, `Auth.ts`, `Analytics.ts`, `Ambassadors.ts`, `Audit.ts`, `Age.ts` | Módulos gerados (agrupamentos de endpoints por domínio). |
| `data-contracts.ts` | **Gerado**: interfaces de dados (Chat, Message, Idea, ...). |
| `http-client.ts` | **Gerado**: wrapper Axios base (default `baseURL` `http://localhost:8081`). |
| `index.ts` | **Hand-written**: instancia `apiClient`, remove `/api` do baseURL, aplica interceptors (Bearer, CSRF, 401→login, 403 desativação). Exporta `apiClient` (e um `API` axios cru). |

**Não editar os arquivos gerados** — rode `npm run generate:api` (lê `../walky-backend/swagger.json`).

## 5. `services/` — service layer

`src/services/` — 12 módulos entre o `apiClient` gerado e as telas. Cada um: importa `apiClient` de
`../API`, chama endpoints, normaliza a resposta, loga via `logger`.

| Service | Responsabilidade | Endpoint exemplo |
|---------|------------------|------------------|
| `userService.ts` | Lista/gerencia usuários (paginação, filtros de escola/campus/role); tipo `UserWithRoles`. | `adminUsersList` |
| `campusService.ts` | Lista/cria/atualiza campuses; mapeia `_id→id`. | `campusesList` |
| `schoolService.ts` | Escolas; define/re-exporta o tipo `School`. | lista de escolas |
| `ambassadorService.ts` | Embaixadores (CRUD parcial). | `ambassadors.ambassadorsList` (namespace legado) |
| `analyticsService.ts` | Social health, wellbeing, KPIs, alertas dos dashboards. | `adminCampusMetricsSocialHealthList` |
| `reportService.ts` | Denúncias (filtro por status/tipo) e usuários banidos. | `adminReportsList` |
| `rolesService.ts` | Roles, permissões, atribuição de role. | `adminRolesList` |
| `interestService.ts` | Interesses. | — |
| `placeService.ts` | Places/Spaces. | — |
| `placeTypeService.ts` | Tipos de place. | — |
| `lockedUsersService.ts` | Usuários bloqueados. | — |
| `campusSyncService.ts` | Sincronização de dados de campus. | — |

## 6. `lib/` — permissões, query, logger, utils

`src/lib/` — fundação transversal (não-UI).

| Arquivo | Papel |
|---------|-------|
| `permissions.ts` | **RBAC**: tipos `RoleName`/`PermissionResource`/`PermissionAction`, `permissionMatrix` (5 roles × ~24 recursos × 6 ações), helpers (`hasPermission`, `canAccessRoute`, `getAssignableRoles`), mapas de display name. Fonte da verdade do controle de acesso no cliente. Ver [architecture §5.3](./architecture.md#53-matriz-de-permissões). |
| `queryClient.ts` | `QueryClient` do React Query (staleTime 5min, gcTime 10min, retry sem 4xx exceto 408) + `queryKeys` factory. |
| `logger.ts` | Wrapper de console: `debug`/`info` só em dev; `warn`/`error` sempre. Evita vazar PII em prod. |
| `utils/` | `dateUtils.ts`, `errors.ts`, `nameUtils.ts` (+ testes). Utilidades puras. |
| `permissions.test.ts`, `queryClient.test.ts` | Testes das peças críticas. |

## 7. `contexts/` — estado de UI/seleção

`src/contexts/` — React Context para estado que **não** é dado remoto (esse fica no React Query).

| Arquivo | Estado / função |
|---------|-----------------|
| `SchoolContext.tsx` | Escola selecionada (persistida em `localStorage`), lista disponível. Multi-tenant. |
| `CampusContext.tsx` | Campus selecionado (persistido), lista disponível. Tipo `Campus`. |
| `DashboardContext.tsx` | `timePeriod` dos dashboards (default `"month"`). |
| `DeactivatedUserContext.tsx` | Flag de conta desativada + `handleLogout`; expõe `triggerDeactivatedModal()` (setter global usado pelos interceptors, fora do React). |
| `ThemeContext.ts` + `ThemeProvider.tsx` | Tema (dark/light) — ver [§14](#14-styles-v2-e-themets). |
| `index.ts` | Barrel de exports. |

## 8. `hooks/` — auth, permissões, filtros, tema

`src/hooks/`

| Hook | Papel |
|------|-------|
| `useAuth.ts` | Lê `token`/`user` do `localStorage`; sync entre abas (evento `storage` + `auth:user-updated`); `isAuthenticated`, `hasRole`, `updateUser`. |
| `usePermissions.ts` | Envolve `lib/permissions`: `can/canRead/canUpdate/canExport/...` + flags `isSuperAdmin/...`. |
| `useCampusFilter.ts` | Interceptor que injeta `campus_id` nas requests do campus selecionado (GET params / body). |
| `useSchoolFilter.ts` | Análogo para escola. |
| `useTheme.ts` | Acessa o `ThemeContext`. |
| `useDashboardPrefetch.ts` | Prefetch de dados de dashboard. |
| `useDebounce.ts` / `useMediaQuery.ts` / `useToolTip.ts` | Utilitários de UI (+ testes). |
| `index.ts` | Barrel. |

## 9. `layout-v2/` — shell (Sidebar + Topbar)

`src/layout-v2/` — o "casco" das telas autenticadas (renderizado por `v2Routes` em torno do
`<Outlet/>`).

| Arquivo | Papel |
|---------|-------|
| `LayoutV2.tsx` | Compõe `SidebarV2` + `TopbarV2` + `<Outlet/>`; controla visibilidade responsiva da sidebar (auto-fecha ≤992px, fecha ao trocar de rota no mobile); monta o `DeactivatedUserModal`. |
| `SidebarV2/SidebarV2.tsx` | Navegação. **Filtra itens por permissão** via `usePermissions().canRead(resource)`: item sem permissão some; submenu vazio remove o pai. |
| `TopbarV2/TopbarV2.tsx` | Seletores de **escola/campus** (`useSchool`/`useCampus`, buscando via `apiClient`), toggle de tema, logout. |

## 10. `components-v2/` — biblioteca de componentes

`src/components-v2/` — ~50 componentes reutilizáveis (exportados por `index.ts`). Categorias:

- **Guards:** `AuthGuard`, `PermissionGuard` (+ HOC `withPermission`) — ver
  [architecture §5.2](./architecture.md#52-guards).
- **Filtros/busca:** `FilterBar`, `FilterDropdown`, `MultiSelectFilterDropdown`, `SearchInput`,
  `StatusDropdown`, `ActionDropdown`.
- **Tabela/lista:** `Pagination`, `NoData`, `SkeletonLoader`, `LastUpdated`, `CopyableId`, `Chip`,
  `Divider`, `Drawer`, `BoundaryAvatar`.
- **Export/gráficos:** `ExportButton` (CSV/PDF), `StackedBarChart`.
- **Modais (muitos):** de usuário (`BanUserModal`, `UnbanUserModal`, `ActivateUserModal`,
  `DeactivateUserModal`, `DeleteAccountModal`, `StudentProfileModal`, `SendPasswordResetModal`,
  `LogoutAllDevicesModal`, `WriteNoteModal`), de moderação (`FlagModal`, `FlagUserModal`,
  `UnflagModal`, `ReportDetailModal`, `ReportDetailsModal`), de conteúdo (`EventDetailsModal`,
  `SpaceDetailsModal`, `IdeaDetailsModal`, `ScheduledEventsModal`, `ChangeCategoryModal`,
  `SeeAllInterestsModal`), de admin/roles (`CreateMemberModal`, `RemoveMemberModal`,
  `ChangeRoleModal`, `RolePermissionsModal`, `AddAmbassadorModal`, `DeleteAmbassadorModal`),
  genéricos (`DeleteModal`, `UnsavedChangesModal`, `DeactivatedUserModal`).
- **Assets/toast:** `AssetIcon`, `AssetImage`, `CustomToast`, `utils`.

## 11. `pages-v2/` — as telas

`src/pages-v2/` — cada rota de [v2Routes](../src/routes/v2Routes.tsx) tem sua tela aqui. Subpastas
frequentemente têm `components/` locais + barril `index.ts`.

```
pages-v2/
├── Dashboard/            # 6 dashboards + components/
│   ├── Engagement/  PopularFeatures/  UserInteractions/
│   ├── Community/  StudentSafety/  StudentBehavior/
├── Campus/               # ActiveStudents, BannedStudents,
│                         #   DeactivatedStudents, DisengagedStudents
├── CampusBoundary/       # componente de geofence/limite de campus
├── Events/               # EventsManager, EventsInsights, CheckInAnalytics
├── Spaces/               # SpacesManager, SpacesInsights
├── Ideas/                # IdeasManager, IdeasInsights
├── Moderation/           # ReportSafety, ReportHistory
├── Admin/                # AdministratorSettings, Ambassadors,
│                         #   Campuses, RoleManagement (+ index.ts)
├── Playground/           # 14 visualizações experimentais (Interest* + ActiveUsers*, Three.js)
├── LoginV2/              # login (2FA/OTP, force-password-change) + LoginV2.css
├── RecoverPasswordV2/    # RecoverPasswordV2 + VerifyCodeStep + ResetPasswordStep
└── ForcePasswordChange/  # troca forçada de senha no 1º login
```

> Nota: `Dashboard` expõe os 6 painéis via export default; `Campus`, `Events`, `Spaces`, `Ideas`,
> `Moderation`, `Admin` usam exports nomeados de barris (desembrulhados em `v2Routes` com
> `.then(m => ({ default: m.Name }))`).

## 12. `routes/` — mapa de rotas

`src/routes/v2Routes.tsx` — único arquivo de rotas ativo. Monta `<LayoutV2/>` com as telas
**lazy-loaded**, cada uma envolvida por `<PermissionGuard resource="..." fallback="redirect">`.
Também provê `CampusProvider` + `DashboardProvider` e trata redirects de paths legados
(`/campuses → /admin/campuses`, etc.). Ver [architecture §3](./architecture.md#3-roteamento-react-router-v7--lazy).

## 13. `types/` — tipos hand-written

`src/types/` — tipos TS **escritos à mão** que estendem/combinam os gerados: `ambassador.ts`,
`analytics.ts`, `api.ts`, `campus.ts`, `place.ts`, `placeType.ts`, `report.ts`, `role.ts`. Os
services (`services/*`) unem esses tipos com os de `API/data-contracts.ts`/`WalkyAPI.ts` para
entregar às telas a forma que elas esperam.

## 14. `styles-v2/` e `theme.ts`

`src/styles-v2/` — sistema de estilo dual (CoreUI + tokens V2):

| Arquivo | Conteúdo |
|---------|----------|
| `design-tokens.css` / `design-tokens.ts` | Tokens (spacing, cornerRadius, colors, ...) auto-gerados do Figma — CSS vars e versão TS. |
| `theme-variables.css` | Variáveis de tema (light/dark). |
| `ThemeComponents.css` | Estilos de componentes temáticos. |
| `global.css` | Estilos globais. |

`src/theme.ts` — `getTheme(isDark)` retorna o objeto de cores consumido por
[`ThemeProvider`](../src/contexts/ThemeProvider.tsx), que aplica `data-coreui-theme` + `data-theme` +
CSS vars `--app-*` no `<html>`/`<body>`. Ver [architecture §7](./architecture.md#7-tema-e-design-tokens).

## 15. `test/`, `scripts/`, `docs/`

- `src/test/` — `setup.ts` (setup do Vitest/Testing Library) e helpers; MSW para mock de rede. Testes
  ficam ao lado do código (`*.test.ts[x]`).
- `scripts/` — `check-test-ids.js` (exige `data-testid`), `check-accessibility.js` (a11y),
  `generate-icons.cjs`, `generate-images.cjs`.
- `docs/` — esta documentação (`overview`, `architecture`, `folder-structure`), além de `docs/admin/`
  (referência dos controllers do backend) e `docs/TESTING.md`.

---

## Cross-links

- [Visão geral](./overview.md) — propósito, público, stack.
- [Arquitetura](./architecture.md) — fluxo de dados, RBAC, decisões.
