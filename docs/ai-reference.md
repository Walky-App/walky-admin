# AI Reference — walky-admin

> Referência densa para LLMs. Mapa de diretórios, arquivos-chave (paths absolutos), convenções,
> fluxos principais, regras e armadilhas. Fonte-de-verdade é o código; ver também
> [conventions.md](./conventions.md) · [development.md](./development.md) · [troubleshooting.md](./troubleshooting.md).

## Índice

- [Identidade](#identidade)
- [Stack](#stack)
- [Mapa de diretórios](#mapa-de-diretórios)
- [Arquivos-chave](#arquivos-chave)
- [Fluxo de auth (login → guarda de rota)](#fluxo-de-auth-login--guarda-de-rota)
- [Fluxo de RBAC (permissões)](#fluxo-de-rbac-permissões)
- [Fluxo de dados (React Query + services + API gerada)](#fluxo-de-dados-react-query--services--api-gerada)
- [Convenções obrigatórias](#convenções-obrigatórias)
- [Comandos](#comandos)
- [Regras-chave](#regras-chave)
- [Limitações / armadilhas](#limitações--armadilhas)

---

## Identidade

Painel administrativo do ecossistema **Walky** (rede social de campus). Público: `super_admin`,
`school_admin`, `campus_admin`, `moderator`, `walky_internal`. Cliente do `walky-backend` (deriva tipos
do Swagger). Deploy em Vercel. Repo em `/Volumes/SSDDEV/DEV_PROJETOS/walky-admin`.
Contexto do ecossistema: `/Volumes/SSDDEV/DEV_PROJETOS/walky-admin/AI_CONTEXT.md`.

## Stack

React 19.1 · TypeScript 5.8 (strict, project references) · Vite 7 · React Router 7.6 · CoreUI 5.7 +
React Bootstrap 2.10 · React Query 5.82 · Axios 1.10 · Recharts 3.4 + Three.js (Playground) · Vitest 4
+ RTL + MSW 2 · Sass. Node ≥ 20 (Vercel/`.nvmrc`: 22). Package manager efetivo: **yarn** (husky/CI).

## Mapa de diretórios

```
/Volumes/SSDDEV/DEV_PROJETOS/walky-admin/
├── src/
│   ├── API/                 # cliente HTTP GERADO do Swagger (WalkyAPI.ts) + index.ts (Axios, interceptors)
│   ├── components-v2/        # 53 componentes reutilizáveis (pasta = .tsx + .css + index.ts)
│   │   └── index.ts          # barrel agregador
│   ├── pages-v2/             # telas por feature (Admin, Campus, Dashboard, Events, Ideas, Spaces,
│   │                         #  Moderation, Playground, LoginV2, RecoverPasswordV2, ForcePasswordChange)
│   ├── layout-v2/            # LayoutV2 + SidebarV2 + TopbarV2
│   ├── routes/v2Routes.tsx   # rotas lazy + PermissionGuard
│   ├── contexts/             # School, Campus, Dashboard, DeactivatedUser, Theme
│   ├── hooks/                # useAuth, usePermissions, useDebounce, useMediaQuery, useTheme, filtros
│   ├── lib/                  # permissions.ts, queryClient.ts, logger.ts, utils/
│   ├── services/             # userService, campusService, reportService, rolesService, ... (12)
│   ├── styles-v2/            # design-tokens.css/.ts, theme-variables.css, global.css, ThemeComponents.css
│   ├── theme.ts              # getTheme(isDark) → objeto de cores
│   ├── test/                 # setup.ts, test-utils.tsx, server.ts, handlers.ts, factories.ts
│   ├── App.tsx / main.tsx    # shell + montagem de providers
│   ├── assets-v2/ types/     # assets novos, tipos
│   └── (legado) components/ pages/ assets/  # descontinuando
├── scripts/                  # check-test-ids.js, check-accessibility.js, generate-icons/images.cjs
├── docs/                     # conventions/development/troubleshooting/ai-reference + TESTING.md
├── .husky/pre-commit         # build → testids → a11y → lint-staged
├── .github/workflows/        # code-quality.yml, test.yml
├── eslint.config.js vite.config.ts vitest.config.ts vercel.json tsconfig*.json
└── .env / .env.example
```

## Arquivos-chave

| Path | Papel |
|------|-------|
| `src/main.tsx` | Monta providers: `QueryClientProvider` → `ThemeProvider` → `SchoolProvider` → `BrowserRouter` → `App`. Importa CSS CoreUI + tokens V2. |
| `src/App.tsx` | Rotas públicas (`/login`, `/recover-password`, `/force-password-change`) + `AuthGuard` envolvendo `V2Routes`. Toaster (`react-hot-toast`). Alterna `body.dark-mode`. |
| `src/routes/v2Routes.tsx` | Todas as rotas autenticadas, lazy, sob `LayoutV2`, cada uma com `PermissionGuard`. Providers `CampusProvider`/`DashboardProvider`. |
| `src/API/index.ts` | Cria `apiClient` (do `WalkyAPI.ts`), remove `/api` do baseURL, interceptors: Bearer token, CSRF em não-GET, 401→logout, 403(`ACCOUNT_DEACTIVATED`)→modal. Exporta `apiClient`, `httpClient`, `API`. |
| `src/API/WalkyAPI.ts` | Cliente Axios tipado GERADO (não editar). |
| `src/lib/permissions.ts` | `permissionMatrix`, `hasPermission`, `routeResourceMap`, `roleHierarchy`, display-name maps. |
| `src/hooks/useAuth.ts` | Lê `localStorage` (`token`,`user`), sincroniza entre abas (`storage`/`auth:user-updated`), `updateUser`. |
| `src/hooks/usePermissions.ts` | `can/canRead/canUpdate/...`, flags `isSuperAdmin/isModerator/...`. |
| `src/components-v2/AuthGuard/AuthGuard.tsx` | Redireciona não-autenticados p/ `/login`; `null` enquanto `isLoading`. |
| `src/components-v2/PermissionGuard/PermissionGuard.tsx` | Guarda por `resource`+`action`; `fallback` `hidden`/`redirect`/node. HOC `withPermission`. |
| `src/lib/queryClient.ts` | QueryClient (stale 5min, gc 10min, retry pula 4xx≠408) + `queryKeys` factory. |
| `src/lib/logger.ts` | Wrapper de console (único autorizado); DEV-gated para debug/info. |
| `src/styles-v2/design-tokens.css` | Tokens `--v2-*` + overrides dark sob `[data-coreui-theme="dark"]`/`[data-theme="dark"]`. |
| `src/contexts/ThemeProvider.tsx` | Estado de tema, seta atributos no `<html>`, injeta `--app-*`. |
| `src/contexts/SchoolContext.tsx` / `CampusContext.tsx` | Seleção multi-tenant (school/campus), persistida em `localStorage`. |
| `src/test/test-utils.tsx` | `renderWithProviders` com stack real de providers + MemoryRouter. |
| `src/test/handlers.ts` / `server.ts` / `factories.ts` | MSW default + server + builders. |
| `scripts/check-test-ids.js` / `check-accessibility.js` | Gates de qualidade (pre-commit + CI). |

## Fluxo de auth (login → guarda de rota)

- Login (`src/pages-v2/LoginV2/`) grava `token` e `user` em `localStorage`; 2FA opcional; troca forçada
  de senha em `/force-password-change`.
- `useAuth` deriva `isAuthenticated` de `localStorage`; escuta `storage` (multi-aba) e evento custom
  `auth:user-updated`. `updateUser(null)` faz logout local.
- `AuthGuard` (em `App.tsx`, rota `/*`) barra não-autenticados; renderiza `null` durante `isLoading`
  (evita flash de redirect no refresh).
- Interceptors (`src/API/index.ts`): injetam `Authorization: Bearer <token>`; em **401** removem token
  e navegam para `/login`. **Não há refresh automático de token neste repo.**
- CSRF: em requests não-GET, lê cookie (`csrf_cookie_rr`/`XSRF-TOKEN`/…) e envia `X-CSRF-Token`/
  `X-XSRF-Token`; Axios com `withCredentials: true`.
- 403 com `code` `ACCOUNT_DEACTIVATED`/`USER_DEACTIVATED` → `triggerDeactivatedModal()`.

## Fluxo de RBAC (permissões)

- Roles: `super_admin`, `school_admin`, `campus_admin`, `moderator`, `walky_internal`.
- Ações: `read`, `create`, `update`, `delete`, `export`, `manage`.
- `permissionMatrix[role][resource] → ResourcePermission` (`src/lib/permissions.ts`).
  Ex.: `super_admin.events_manager = readUpdateDeleteExport`; `moderator.active_students = noPermissions`,
  mas `moderator.report_safety = readUpdateExport`; `walky_internal` é leitura-só (sem reports).
- Rotas: `PermissionGuard resource=... fallback="redirect"` em `v2Routes.tsx`. `routeResourceMap`
  mapeia path→resource (`canAccessRoute`); path não mapeado é liberado por default.
- UI inline: `PermissionGuard fallback="hidden"` ou `withPermission`; ou `usePermissions().can(...)`.
- Hierarquia de atribuição de role: `roleHierarchy` (super→school/campus/moderator; school→campus/
  moderator; campus→moderator). Helpers `getAssignableRoles`, `canAssignRole(ByDisplayName)`.

## Fluxo de dados (React Query + services + API gerada)

```
Componente (pages-v2)
  └─ useQuery({ queryKey: [feature, ...filtros, school?._id, campus?._id], queryFn })
       └─ service (src/services/*)  ── ou ──  apiClient.api.<método>() direto
            └─ apiClient (src/API/index.ts)  # Axios + interceptors
                 └─ WalkyAPI.ts (GERADO do swagger.json do backend)
                      └─ walky-backend
```

- `queryKey` inclui **todos** os filtros + `selectedSchool?._id`/`selectedCampus?._id` (multi-tenant).
- Buscas de texto passam por `useDebounce` (500 ms) antes da key.
- Paginação: `placeholderData: keepPreviousData`.
- Services normalizam a resposta (campos opcionais com `??`/`||`), logam via `logger`, `throw` no erro.
- Contextos `School`/`Campus` selecionam o tenant; persistidos em `localStorage` (`selectedSchool`, etc.).

## Convenções obrigatórias

- Código novo em pastas **`-v2`** (components-v2/pages-v2/layout-v2/styles-v2/assets-v2). Legado em EOL.
- Componente = pasta `Name/` com `Name.tsx` + `Name.css` (classes prefixadas `name-*`, sem CSS Modules) + `index.ts`.
- `data-testid` em todo `<button>`/`<input>`/`<form>` de pages-v2/components-v2.
- a11y WCAG 2.1 AA (alt, aria-label, labels, aria-checked/selected, focus styles).
- Importar via barrel raiz (`../../../components-v2`), não do arquivo interno.
- Server state via React Query; nunca `console.*` (usar `logger`).
- Cores/spacing via tokens `--v2-*` para herdar dark mode.
- Teste ao lado (`Foo.test.tsx`), render com `renderWithProviders`, MSW para rede.

## Comandos

`yarn dev` (5173) · `yarn build` (`tsc -b && vite build`) · `yarn test [--run]` · `yarn test:coverage`
· `yarn check:testids` · `yarn check:a11y` · `yarn check:all` · `yarn lint` · `yarn type-check`
· `yarn generate:api` (requer `../walky-backend/swagger.json`) · `generate:icons`/`generate:images`.
Env: `VITE_API_BASE_URL` (terminar em `/api`), `VITE_APP_NAME`, `VITE_ENV`, opc. `VITE_GOOGLE_MAPS_API_KEY`,
`VITE_SENTRY_DSN`.

## Regras-chave

- ESLint: `no-console: error`; `@typescript-eslint/no-explicit-any: warn` (isento em `src/API/WalkyAPI.ts`,
  `Api.ts`); `no-unused-vars` ignora prefixo `_`.
- `WalkyAPI.ts` e cia são **gerados** — nunca editar à mão; regenerar via `generate:api`.
- `VITE_API_BASE_URL` deve terminar em `/api` (o client remove `/api` para o cliente OpenAPI).
- Pre-commit e CI bloqueiam por testids, a11y, testes.
- `PermissionGuard`/`AuthGuard` retornam `null` durante `isLoading` (não é bug, evita flash).
- Vercel: rewrite SPA em `vercel.json`; `BrowserRouter` em `main.tsx`.

## Limitações / armadilhas

- **Sem refresh de token**: 401 sempre desloga (troubleshooting.md).
- **`.env` versionado aponta para staging** — trocar para local em dev.
- Dois sistemas de tema convivem (CoreUI `data-coreui-theme` + tokens V2 `--v2-*`); cores hardcoded não
  herdam dark mode.
- `generate:api` depende do backend clonado ao lado (`../walky-backend/swagger.json`) e atualizado.
- `handlers.ts`/`test-utils.tsx` precisam acompanhar novos endpoints/providers, senão testes quebram
  (request sem mock **falha** de propósito).
- Pastas legadas (`components/`, `pages/`) ainda existem; não escrever código novo nelas.
- README.md do repo é um tutorial genérico de CoreUI — o contexto real está em `AI_CONTEXT.md` e nestes docs.
- Cobertura tem *ratchet* em `vitest.config.ts` (thresholds só sobem); baixar cobertura quebra o build.
