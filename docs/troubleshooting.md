# Troubleshooting — walky-admin

> Sintomas → causa → solução, baseados em pistas reais do código. Itens marcados **(inferência)**
> não estão explicitados no código, mas seguem da configuração observada.

## Índice

- [Backend errado / sem dados / CORS](#backend-errado--sem-dados--cors)
- [401 em loop / redirect para /login](#401-em-loop--redirect-para-login)
- [403 abrindo modal de conta desativada](#403-abrindo-modal-de-conta-desativada)
- [Tipos da API desatualizados / faltando método](#tipos-da-api-desatualizados--faltando-método)
- [Commit bloqueado: testids faltando](#commit-bloqueado-testids-faltando)
- [Commit bloqueado: acessibilidade](#commit-bloqueado-acessibilidade)
- [Dark mode não aplica / cores hardcoded](#dark-mode-não-aplica--cores-hardcoded)
- [`console.*` reprovado no lint](#console-reprovado-no-lint)
- [Rota some / PermissionGuard redireciona sempre](#rota-some--permissionguard-redireciona-sempre)
- [Testes falhando: request sem mock / provider ausente](#testes-falhando-request-sem-mock--provider-ausente)
- [Vercel: 404 ao dar refresh numa rota (SPA routing)](#vercel-404-ao-dar-refresh-numa-rota-spa-routing)
- [`.env` editado e nada muda](#env-editado-e-nada-muda)

Cross-links: [conventions.md](./conventions.md) · [development.md](./development.md) · [ai-reference.md](./ai-reference.md)

---

## Backend errado / sem dados / CORS

**Sintoma:** telas vazias, erros de rede no console, ou CORS bloqueado.

**Causa/solução:** `VITE_API_BASE_URL` (`.env`) determina o backend. O client em `src/API/index.ts`
faz `baseURL.replace(/\/api\/?$/, "")` para o cliente OpenAPI (rotas admin já trazem `/api`; rotas
legadas batem na raiz). Por isso **a URL deve terminar em `/api`**. Fallback quando ausente:
`http://localhost:8080/api`.

- Local: `VITE_API_BASE_URL=http://localhost:8080/api` (ou `:8081/api`) com o `walky-backend` rodando.
- O `.env` versionado hoje aponta para **staging** (`https://staging.walkyapp.com/api`) — troque para dev local.
- Reinicie `yarn dev` após editar `.env`.
- **CORS (inferência):** o Axios usa `withCredentials: true` (cookies para CSRF). Se o backend local
  não permitir a origem `http://localhost:5173` com credenciais, requests não-GET podem falhar —
  garanta o CORS do backend liberando essa origem.

## 401 em loop / redirect para /login

**Sintoma:** volta para `/login` repetidamente, ou logout inesperado.

**Causa:** os interceptors de resposta (`src/API/index.ts`) tratam **401** removendo `localStorage.token`
e navegando para `/login` (`window.location.href = "/login"`). Auth é lido de `localStorage`
(`token` + `user`) por `useAuth` (`src/hooks/useAuth.ts`); `AuthGuard` redireciona quem não está autenticado.

**Solução:**
- Token expirado/inválido → refaça login. Não há refresh automático **(inferência: não há lógica de
  refresh nos interceptors deste repo)**; um 401 sempre desloga.
- Se o backend local rejeita o token (segredo JWT diferente de staging/prod), gere um token no mesmo
  backend para onde `VITE_API_BASE_URL` aponta.
- Estado dessincronizado entre abas: `useAuth` escuta `storage` e `auth:user-updated`; limpar
  `localStorage` e recarregar resolve estados corrompidos (`user` inválido também dispara logout).

## 403 abrindo modal de conta desativada

**Sintoma:** ação retorna 403 e aparece o modal de "conta desativada".

**Causa:** o interceptor só dispara `triggerDeactivatedModal()` quando `error.response.data.code` é
`ACCOUNT_DEACTIVATED` ou `USER_DEACTIVATED` (`src/API/index.ts` + `src/contexts/DeactivatedUserContext`).
403 por **falta de permissão** (código diferente) **não** abre o modal.

**Solução:** se você não deveria estar desativado, verifique a conta no backend. Se for erro de
permissão, cheque a role/matriz (ver seção do PermissionGuard).

## Tipos da API desatualizados / faltando método

**Sintoma:** `apiClient.api.<método>` não existe, ou tipos divergem da resposta real do backend.

**Causa:** `src/API/WalkyAPI.ts` é **gerado** do Swagger e pode estar velho.

**Solução:**
```bash
yarn generate:api   # precisa de ../walky-backend/swagger.json atualizado
```
Regenere o `swagger.json` no backend primeiro (Swagger em `http://localhost:8081/api-docs/`). Não edite
os arquivos gerados à mão (`src/API/WalkyAPI.ts`, `Api.ts`, `data-contracts.ts`, `http-client.ts`).

## Commit bloqueado: testids faltando

**Sintoma:** pre-commit/CI falha com "Add data-testid to elements".

**Causa:** `scripts/check-test-ids.js` exige `data-testid` em `<button>`/`<input>`/`<form>` dentro de
`src/pages-v2` e `src/components-v2`.

**Solução:** adicione `data-testid="descritivo"` ao elemento (ou, em componentes que abstraem o
elemento, passe a prop de testid — ex.: `FilterDropdown testId="..."`). Rode `yarn check:testids`.

## Commit bloqueado: acessibilidade

**Sintoma:** pre-commit/CI falha com violações WCAG.

**Causa:** `scripts/check-accessibility.js` varre `pages-v2`/`components-v2`/`layout-v2`.

**Soluções por regra:**
- `<img>` → `alt="..."` ou `aria-hidden="true"` (decorativa).
- `<button>` só-ícone → `aria-label="..."`.
- `<input>`/`<select>` → `aria-label`, `aria-labelledby` ou `id` (para `<label>`).
- `role="radio"` → `aria-checked`; `role="tab"` → `aria-selected`; landmarks/widgets → `aria-label`.
- Warning de foco: adicione `:focus`/`:focus-visible` no `.css` do componente.

Rode `yarn check:a11y` para ver arquivo/linha exatos.

## Dark mode não aplica / cores hardcoded

**Sintoma:** componente não muda no tema escuro.

**Causa:** o dark mode sobrescreve tokens `--v2-*` sob `:root[data-coreui-theme="dark"]` e
`[data-theme="dark"]` (`src/styles-v2/design-tokens.css`). Cores hardcoded no CSS não herdam.

**Solução:** use as CSS variables `--v2-*` (ex.: `color: var(--v2-text-primary); background: var(--v2-bg-card);`)
em vez de hex fixos. O `ThemeProvider` (`src/contexts/ThemeProvider.tsx`) seta `data-coreui-theme` e
`data-theme` no `<html>` e alterna `body.dark-theme`; o `App.tsx` alterna `body.dark-mode`. Se o toggle
não persiste, verifique `localStorage("theme")`.

## `console.*` reprovado no lint

**Sintoma:** ESLint falha com `no-console`.

**Causa:** regra `no-console: 'error'` (`eslint.config.js`) para não vazar PII em produção.

**Solução:** use `logger` de `src/lib/logger.ts` (`logger.debug/info/warn/error`). `debug`/`info` só
saem em DEV; o build ainda remove `console.log/info/debug` (`vite.config.ts`). Só `logger.ts` pode usar
`console` (via `eslint-disable`).

## Rota some / PermissionGuard redireciona sempre

**Sintoma:** usuário é jogado para `/dashboard/engagement` ao abrir uma tela; ou item some da sidebar.

**Causa:** `PermissionGuard` (`fallback="redirect"`) checa `permissionMatrix[role][resource].read`
(`src/lib/permissions.ts`). Se a role não tem `read` no `resource`, redireciona para `redirectTo`
(default `/dashboard/engagement`). Ex.: `moderator`/`walky_internal` têm `noPermissions` em
`active_students`, etc.

**Solução:**
- Confirme a `role` do usuário (`localStorage.user`) e a linha correspondente na `permissionMatrix`.
- Rota nova sem entrada em `routeResourceMap` é liberada por default (`canAccessRoute` retorna `true`).
- Ao adicionar rota protegida: inclua o `resource` no union, na matriz de **todas** as roles, e em
  `routeResourceMap`. Ver [development.md §4](./development.md#4-adicionar-uma-página-nova-rota-lazy--permissionguard).
- Enquanto `useAuth().isLoading`, os guards renderizam `null` (evita flash) — não confunda com "página em branco".

## Testes falhando: request sem mock / provider ausente

**Sintoma:** teste falha por request de rede real, ou hook lança "must be used within a Provider".

**Causa:** MSW faz requests sem handler **falharem** de propósito; e contextos exigem seus providers.

**Solução:**
- Renderize com `renderWithProviders` (`src/test/test-utils.tsx`) — já monta Theme/School/Campus/
  Dashboard/DeactivatedUser/Router/QueryClient.
- Mocke a rota com `server.use(http.get(\`${API_BASE}/...\`, ...))` (`src/test/handlers.ts`,
  `src/test/server.ts`). Handlers default cobrem casos comuns; override é resetado após cada teste.
- Auth: semeie `localStorage` (`token`, `user`) antes de renderizar.

## Vercel: 404 ao dar refresh numa rota (SPA routing)

**Sintoma:** navegar client-side funciona, mas F5 em `/events` dá 404 no deploy.

**Causa/solução:** SPA precisa de rewrite para `index.html`. Já configurado em `vercel.json`
(`"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]`). Se hospedar fora da Vercel
**(inferência)**, replique esse rewrite/fallback no servidor (ex.: `try_files` no Nginx). O router usa
`BrowserRouter` (`src/main.tsx`), então paths reais precisam cair no `index.html`.

## `.env` editado e nada muda

**Sintoma:** mudou `VITE_*` mas o app usa o valor antigo.

**Causa:** Vite lê env no boot e só expõe variáveis com prefixo `VITE_`.

**Solução:** reinicie `yarn dev`. Confirme o prefixo `VITE_`. Em produção/preview, rebuilde
(`yarn build`) — os valores são embutidos no bundle.
