# Guia de Desenvolvimento — walky-admin

> Como rodar, adicionar telas, regenerar tipos, testar e passar nos checks obrigatórios.
> Stack: React 19 · TypeScript 5.8 · Vite 7 · CoreUI 5 · React Router 7 · React Query 5 · Vitest 4.

## Índice

- [1. Pré-requisitos](#1-pré-requisitos)
- [2. Rodar localmente](#2-rodar-localmente)
- [3. Variáveis de ambiente](#3-variáveis-de-ambiente)
- [4. Adicionar uma página nova (rota lazy + PermissionGuard)](#4-adicionar-uma-página-nova-rota-lazy--permissionguard)
- [5. Regenerar tipos da API (`generate:api`)](#5-regenerar-tipos-da-api-generateapi)
- [6. Testes](#6-testes)
- [7. Checks obrigatórios (`check:all`)](#7-checks-obrigatórios-checkall)
- [8. Scripts disponíveis](#8-scripts-disponíveis)
- [9. Erros comuns](#9-erros-comuns)

Cross-links: [conventions.md](./conventions.md) · [troubleshooting.md](./troubleshooting.md) · [ai-reference.md](./ai-reference.md) · [TESTING.md](./TESTING.md)

---

## 1. Pré-requisitos

- **Node ≥ 20** (`package.json` → `engines`; `.nvmrc` = `22`; Vercel usa Node 22).
- Gerenciador: os scripts do husky/CI usam **yarn**, mas `npm` funciona (o README usa `npm run dev`).
- Backend (`walky-backend`) rodando localmente para dados reais e para `generate:api`.

## 2. Rodar localmente

```bash
yarn install         # ou npm install
yarn dev             # Vite dev server em http://localhost:5173
```

Aponte para o **backend local**. O backend Walky roda em `8080` ou `8081` (neste ambiente o app móvel
usa `8080`; o backend também expõe `8081`). O client sempre concatena/remove `/api` conforme a rota
(ver `src/API/index.ts`), então o `VITE_API_BASE_URL` **deve terminar em `/api`**:

```env
# .env
VITE_API_BASE_URL=http://localhost:8080/api   # ou :8081/api
VITE_APP_NAME=Walky Admin
VITE_ENV=development
```

> ⚠️ O `.env` versionado atualmente aponta para **staging** (`https://staging.walkyapp.com/api`).
> Para desenvolvimento local, troque para `localhost`. Reinicie o `yarn dev` após editar o `.env`
> (Vite injeta env no boot).

## 3. Variáveis de ambiente

| Variável | Obrigatória | Uso |
|----------|-------------|-----|
| `VITE_API_BASE_URL` | sim | Base do Axios. Prod `https://api.walkyapp.com/api`, staging `https://staging.walkyapp.com/api`, local `http://localhost:8080|8081/api`. Deve terminar em `/api`. |
| `VITE_APP_NAME` | sim | Nome exibido (`Walky Admin`). |
| `VITE_ENV` | sim | `development` \| `staging` \| `production`. |
| `VITE_GOOGLE_MAPS_API_KEY` | opcional | Mapas (geofences de campus). |
| `VITE_SENTRY_DSN` | opcional | Monitoramento. |

Template em `.env.example`. Só variáveis com prefixo `VITE_` chegam ao bundle.

## 4. Adicionar uma página nova (rota lazy + PermissionGuard)

Fluxo real, seguindo o padrão de `src/routes/v2Routes.tsx`.

**4.1** Crie a pasta da página em `src/pages-v2/<Feature>/<Screen>/` com `Screen.tsx` + `Screen.css`.
Use `<main className="...">` (a11y) e `data-testid` nos elementos interativos:

```tsx
// src/pages-v2/Reports/ReportsList/ReportsList.tsx
import "./ReportsList.css";
export const ReportsList: React.FC = () => {
  return <main className="reports-list-container">{/* ... */}</main>;
};
```

**4.2** Exporte no barrel da feature `src/pages-v2/Reports/index.ts`:

```ts
export { ReportsList } from "./ReportsList/ReportsList";
```

**4.3** Registre a rota em `src/routes/v2Routes.tsx` com `React.lazy` (named export → unwrap para
`default`) e envolva com `PermissionGuard`:

```tsx
const ReportsList = lazy(() =>
  import("../pages-v2/Reports").then((m) => ({ default: m.ReportsList }))
);
// ...dentro de <Route path="/" element={<LayoutV2 />}>
<Route path="reports" element={
  <PermissionGuard resource="report_history" fallback="redirect">
    <ReportsList />
  </PermissionGuard>
} />
```

**4.4** Se a rota tem RBAC próprio, adicione o mapeamento em `src/lib/permissions.ts`:
inclua o `PermissionResource` no union, defina a linha em cada role de `permissionMatrix`, e registre
o path em `routeResourceMap` (ex.: `'/reports': 'report_history'`).

**4.5** Adicione o item de navegação em `src/layout-v2/SidebarV2/SidebarV2.tsx` (array de `label`/`path`).

**4.6** Crie o teste `ReportsList.test.tsx` ao lado (ver seção 6).

## 5. Regenerar tipos da API (`generate:api`)

O cliente HTTP tipado é **gerado** a partir do Swagger do backend — não edite à mão.

```bash
yarn generate:api
# = npx swagger-typescript-api generate -p ../walky-backend/swagger.json \
#     -o ./src/API --axios --name WalkyAPI.ts
```

- **Requer** `../walky-backend/swagger.json` existente (repo backend clonado ao lado). Gere/atualize
  esse arquivo no backend antes (o backend expõe Swagger em `http://localhost:8081/api-docs/`).
- Saída: `src/API/WalkyAPI.ts` (+ `Api.ts`, `data-contracts.ts`, `http-client.ts`). Esses arquivos são
  **isentos** de `no-explicit-any` no ESLint (`eslint.config.js`) e da cobertura (`vitest.config.ts`).
- Sempre que o contrato do backend mudar, regenere e ajuste os services/páginas consumidores.
- Consuma via `apiClient` (`src/API/index.ts`), que aplica interceptors de token/CSRF/401/403.

## 6. Testes

Vitest + React Testing Library + MSW. Guia completo em [`docs/TESTING.md`](./TESTING.md).

```bash
yarn test              # watch
yarn test --run        # single run (o que o CI usa)
yarn test:ui           # UI do Vitest
yarn test:coverage     # cobertura (text + html em /coverage)
```

- **Um teste ao lado da fonte**: `Foo.tsx` → `Foo.test.tsx`.
- Renderize com `renderWithProviders` (`src/test/test-utils.tsx`) — monta a stack real de providers
  (QueryClient novo por render, Theme, School, Campus, Dashboard, DeactivatedUser, MemoryRouter):

```tsx
import { renderWithProviders, screen } from "@/test/test-utils";
renderWithProviders(<EventsManager />, { route: "/events" });
expect(await screen.findByRole("table")).toBeInTheDocument();
```

- **MSW**: handlers default em `src/test/handlers.ts` (base = `API_BASE`, derivada de `VITE_API_BASE_URL
  ?? http://localhost:8080/api`). Override por teste com `server.use(...)`; requests sem mock **falham**
  o teste de propósito. Factories em `src/test/factories.ts` (`mockUser`, `mockSchool`, `mockCampus`, …).
- **Auth em teste**: semeie `localStorage` (`token` + `user`) antes de renderizar; é limpo após cada teste.
- Consulte por role/label/testid, nunca por classe CSS. Cobertura tem *ratchet* em `vitest.config.ts`
  (só pode subir).

## 7. Checks obrigatórios (`check:all`)

```bash
yarn check:all   # = check:testids && check:a11y && test --run
```

Rodam também no **pre-commit** (`.husky/pre-commit`: build → testids → a11y → lint-staged) e no
**CI** (`.github/workflows/code-quality.yml` e `test.yml`, gatilho em PRs para `main/develop/staging/feat/*`).

- `yarn check:testids` — `<button>`/`<input>`/`<form>` sem `data-testid` = falha. Ver
  [conventions.md §4](./conventions.md#4-data-testid-obrigatório-checktestids).
- `yarn check:a11y` — regras WCAG 2.1 AA. Ver [conventions.md §5](./conventions.md#5-acessibilidade-checka11y).
- `yarn test -- --run` — suíte Vitest (hard gate no CI).
- `yarn lint` (ESLint) e `yarn type-check` (`tsc -b`) rodam à parte; `no-console` é **error**.

## 8. Scripts disponíveis

| Script | Faz |
|--------|-----|
| `dev` | Vite dev server (5173). |
| `build` | `tsc -b && vite build` → `dist/`. |
| `preview` | Serve o build. |
| `lint` | ESLint em todo o repo. |
| `type-check` / `tsc` | Type-check via project references. |
| `test` / `test:ui` / `test:coverage` | Vitest. |
| `check:testids` / `check:a11y` / `check:all` | Gates de qualidade. |
| `generate:api` | Regenera cliente da API do Swagger do backend. |
| `generate:icons` / `generate:images` | Geram assets (`scripts/generate-*.cjs`). |
| `clean` | `clean-build.sh`. |

Deploy: **Vercel** (`vercel.json` → `framework: vite`, `outputDirectory: dist`, rewrite SPA de
`/(.*)` para `/index.html`, `NODE_VERSION: 22`).

## 9. Erros comuns

- **Sem dados / 401 em loop**: `VITE_API_BASE_URL` errado ou não terminando em `/api`; ou apontando
  para staging/prod sem token válido. Detalhes em [troubleshooting.md](./troubleshooting.md).
- **Tipos da API desatualizados**: rode `yarn generate:api` (precisa do `swagger.json` do backend).
- **Commit bloqueado**: falta `data-testid` ou violação de a11y — rode `yarn check:all` antes.
- **`console.*` reprovado no lint**: use `logger` de `src/lib/logger.ts`.
- **Editou `.env` e nada mudou**: reinicie `yarn dev` (Vite injeta env no boot).
