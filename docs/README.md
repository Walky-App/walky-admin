# Documentação — walky-admin

Documentação técnica do **walky-admin**, o painel administrativo (React 19 + CoreUI + Vite) da
plataforma Walky. Público: admins de campus/escola, moderadores e super-admins.

> Para a visão do **ecossistema inteiro** (os 4 repositórios), veja
> [`../AI_CONTEXT.md`](../AI_CONTEXT.md). O admin é **cliente do backend** e gera seus tipos a partir
> do Swagger de `../walky-backend/swagger.json`.

---

## Índice

| # | Documento | O que cobre |
|---|-----------|-------------|
| 1 | [overview.md](overview.md) | Propósito, papel no ecossistema, os 5 roles do RBAC e a **stack** com o porquê de cada lib |
| 2 | [architecture.md](architecture.md) | Providers, React Router v7 + lazy, service layer sobre Axios gerado, React Query, RBAC, multi-tenant (diagramas) |
| 3 | [folder-structure.md](folder-structure.md) | Cada diretório e o significado do sufixo `-v2` (redesign da UI vs. fundação) |
| 4 | [workflows.md](workflows.md) | 12 fluxos de negócio + 3 técnicos: login/OTP, sync entre abas, RBAC, dashboards, moderação, campus/geofences… |
| 5 | [business-rules.md](business-rules.md) | Matriz de permissões por role, durações de ban, regras de moderação, validações, rota→recurso |
| 6 | [integrations.md](integrations.md) | Backend/Axios (CSRF, interceptors), Swagger TypeScript API, Google Maps |
| 7 | [conventions.md](conventions.md) | `-v2`, `.tsx`+`.css` namespaced, `data-testid` obrigatório, a11y, barrel exports, design tokens + dark mode |
| 8 | [development.md](development.md) | Rodar (`npm run dev` 5173), nova página com rota lazy + PermissionGuard, `generate:api`, MSW, `check:all` |
| 9 | [deployment.md](deployment.md) | Env vars, scripts, Vite build, Vitest+RTL+MSW, workflows CI, deploy Vercel |
| 10 | [troubleshooting.md](troubleshooting.md) | 12 sintomas→solução (backend/CORS, 401 loop, 403 modal, tipos, testids, a11y, dark mode, SPA) |
| 11 | [ai-reference.md](ai-reference.md) | Referência densa para LLMs: mapa de módulos, fluxos auth/RBAC, regras e armadilhas |

> `TESTING.md` (pré-existente) foi preservado e trata do framework de testes em detalhe.

---

## Notas importantes descobertas na análise do código

- **Sem refresh token no admin:** todo 401 desloga (diverge do app/HQ). O RBAC do cliente é
  **UX/defesa-em-profundidade**; a autoridade final é do backend.
- **`.env` versionado aponta hoje para staging** (`https://staging.walkyapp.com/api`), não para local.
- **Google Maps com chave hardcoded** em `CampusBoundary.tsx`; `VITE_GOOGLE_MAPS_API_KEY` não é lida.
  A única env var de app realmente consumida é `VITE_API_BASE_URL`.
- **Sem Sentry:** `VITE_SENTRY_DSN` é só comentário no `.env.example`; há um logger próprio
  (`src/lib/logger.ts`).
- **Camada legada não usada:** `reportService.ts` (endpoints `adminReports*` sem `v2`) e os hooks
  `useSchoolFilter`/`useCampusFilter`/`useDashboardPrefetch` estão definidos mas não são invocados; o
  filtro multi-tenant efetivo passa `schoolId`/`campusId` direto nas queries.
- **`super_admin`/`school_admin`/`campus_admin` têm direitos idênticos por recurso** na matriz; a
  diferença de escopo é aplicada por campus/escola e pelo backend. Roles `editor`/`staff`/`viewer`
  passam no login mas caem em `noPermissions`.
- **Arquivos em `src/API/*` são gerados** (`@ts-nocheck`) — não editar à mão.

_Gerada por análise direta do código. Mantenha sincronizada ao alterar o código._
