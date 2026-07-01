# Integrações — walky-admin

> Painel administrativo da plataforma Walky (React 19 + CoreUI 5 + Vite 7). Este documento descreve
> **todas as integrações externas e de contrato** que o painel usa, com paths reais, arquivos de
> configuração e variáveis de ambiente. Reflete exatamente o código do repositório.

Documentos relacionados: [deployment.md](./deployment.md) · Contexto do ecossistema: [`../AI_CONTEXT.md`](../AI_CONTEXT.md)

---

## Sumário

- [1. Visão geral](#1-visão-geral)
- [2. Backend REST (Axios)](#2-backend-rest-axios)
  - [2.1. Base URL e criação do cliente](#21-base-url-e-criação-do-cliente)
  - [2.2. Bearer token](#22-bearer-token)
  - [2.3. Proteção CSRF](#23-proteção-csrf)
  - [2.4. Interceptors de request/response](#24-interceptors-de-requestresponse)
  - [2.5. Camada de services + React Query](#25-camada-de-services--react-query)
- [3. Swagger TypeScript API (geração de tipos)](#3-swagger-typescript-api-geração-de-tipos)
- [4. Google Maps](#4-google-maps)
- [5. Sentry](#5-sentry)
- [6. Outras bibliotecas de dados/visualização](#6-outras-bibliotecas-de-dadosvisualização)
- [7. Resumo de variáveis de ambiente](#7-resumo-de-variáveis-de-ambiente)

---

## 1. Visão geral

O walky-admin é **cliente do walky-backend** (API REST). Não há WebSocket/tempo real no painel.
As integrações efetivamente presentes no código são:

| Integração | Propósito | Arquivo(s) de config | Env vars |
|---|---|---|---|
| **Backend REST (Axios)** | Toda a comunicação HTTP com a API | `src/API/index.ts`, `src/API/http-client.ts` | `VITE_API_BASE_URL` |
| **Swagger TypeScript API** | Geração dos tipos/clients a partir do OpenAPI do backend | `package.json` (script `generate:api`), saída em `src/API/` | — (lê `../walky-backend/swagger.json`) |
| **Google Maps** | Desenho de geofence/boundary do campus | `src/pages-v2/CampusBoundary/CampusBoundary.tsx` (`@react-google-maps/api`) | ⚠️ chave **hardcoded**, sem env var |
| **React Query** | Cache de server state sobre o Axios | `src/lib/queryClient.ts` | — |

> **Sentry:** o `.env.example` sugere `VITE_SENTRY_DSN`, mas **não há integração de Sentry no código**
> (nenhum pacote, import ou init). Ver [seção 5](#5-sentry).

```mermaid
flowchart LR
  subgraph admin["walky-admin (browser)"]
    RQ["React Query<br/>src/lib/queryClient.ts"]
    SVC["services/*<br/>userService, campusService…"]
    AX["Axios client + interceptors<br/>src/API/index.ts"]
    GEN["Cliente gerado (Swagger)<br/>src/API/WalkyAPI.ts, Api.ts…"]
    GM["Google Maps<br/>CampusBoundary.tsx"]
  end
  BE["walky-backend<br/>REST /api"]
  SW["../walky-backend/swagger.json"]
  GAPI["Google Maps JS API"]

  RQ --> SVC --> AX
  AX -.usa tipos.-> GEN
  AX -->|Bearer + CSRF| BE
  SW -->|generate:api| GEN
  GM --> GAPI
```

---

## 2. Backend REST (Axios)

Arquivos: [`src/API/index.ts`](../src/API/index.ts) e [`src/API/http-client.ts`](../src/API/http-client.ts) (gerado).

Há **duas instâncias Axios** em `src/API/index.ts`:

1. `API` (export default) — instância "manual" `axios.create(...)`, usada por código legado.
2. `apiClient` — instância do **cliente gerado** (`new Api(new HttpClient(...))`), exportada também
   como `httpClient` para compatibilidade. É a usada pela camada de `services/`.

Ambas recebem **os mesmos interceptors** (Bearer + CSRF + tratamento de erro), definidos duas vezes
no mesmo arquivo.

### 2.1. Base URL e criação do cliente

A base vem de `import.meta.env.VITE_API_BASE_URL`, com fallback `http://localhost:8080/api`:

```ts
// src/API/index.ts
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api",
  withCredentials: true, // habilita cookies para CSRF
});
```

Para o **cliente gerado**, o sufixo `/api` é **removido** da base:

```ts
// src/API/index.ts
const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";
const httpClientInstance = new HttpClient({
  baseURL: baseURL.replace(/\/api\/?$/, ""),
});
export const apiClient = new Api(httpClientInstance);
```

Motivo (comentado no código): os paths do Swagger são mistos — rotas de admin já incluem o prefixo
`/api/admin/...`, enquanto rotas legadas (`/ambassadors`, etc.) batem no router legado na raiz. Por
isso a base do cliente gerado é a **raiz** (sem `/api`).

O `HttpClient` gerado tem fallback próprio `http://localhost:8081` caso nenhuma base seja passada
(ver `src/API/http-client.ts`), mas na prática a base sempre é injetada por `index.ts`.

Ambientes típicos de `VITE_API_BASE_URL` (ver [`.env.example`](../.env.example)):

| Ambiente | Valor |
|---|---|
| Produção | `https://api.walkyapp.com/api` |
| Staging | `https://staging.walkyapp.com/api` |
| Local | `http://localhost:8081/api` (ou `8080`) |

### 2.2. Bearer token

O token JWT é lido de `localStorage` (chave `token`) no interceptor de request e injetado no header
`Authorization`:

```ts
// src/API/index.ts (nas duas instâncias)
const token = localStorage.getItem("token");
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
} else {
  logger.warn("⚠️ No token found for request:", config.url);
}
```

### 2.3. Proteção CSRF

Ambas as instâncias usam `withCredentials: true` (cookies enviados). Em requests **não-GET**
(exclui `get`/`head`/`options`), o token CSRF é lido de cookie e enviado em dois headers:

```ts
// src/API/index.ts — getCsrfToken()
const cookieNames = ["csrf_cookie_rr", "XSRF-TOKEN", "csrf_token", "_csrf"];
// ...
config.headers["X-CSRF-Token"] = csrfToken;
config.headers["X-XSRF-Token"] = csrfToken;
```

O helper `getCsrfToken()` tenta múltiplos nomes de cookie comuns e faz `decodeURIComponent`.

### 2.4. Interceptors de request/response

Response interceptor (idêntico nas duas instâncias):

- **Log** de sucesso (`logger.debug`) e de erro (`logger.error`) com método/URL/status.
- **401 Unauthorized:** remove `token` do `localStorage` e redireciona para `/login` (se ainda não
  estiver lá) via `window.location.href`.
- **403 Forbidden:** se o corpo do erro tiver `code === "ACCOUNT_DEACTIVATED"` ou
  `"USER_DEACTIVATED"`, dispara o modal via `triggerDeactivatedModal()`
  (`src/contexts/DeactivatedUserContext`). Erros 403 de permissão comum **não** disparam o modal.

> Observação: a lógica de **retry** e a política de não-retry em 4xx (exceto 408) **não** está no
> Axios, e sim no React Query — ver [2.5](#25-camada-de-services--react-query).

### 2.5. Camada de services + React Query

Os services em [`src/services/`](../src/services/) encapsulam chamadas do `apiClient` e expõem
funções tipadas. Existentes:

`ambassadorService.ts`, `analyticsService.ts`, `campusService.ts`, `campusSyncService.ts`,
`interestService.ts`, `lockedUsersService.ts`, `placeService.ts`, `placeTypeService.ts`,
`reportService.ts`, `rolesService.ts`, `schoolService.ts`, `userService.ts`.

Cada service importa `apiClient` de `../API`, o `logger` de `../lib/logger` e tipos de
`../API/WalkyAPI` (ex.: `src/services/userService.ts`).

O **React Query** ([`src/lib/queryClient.ts`](../src/lib/queryClient.ts)) define os defaults:

```ts
queries: {
  staleTime: 1000 * 60 * 5,  // 5 min
  gcTime:    1000 * 60 * 10,  // 10 min
  retry: (failureCount, error) => {
    // não faz retry em 4xx, exceto 408 (timeout); demais até 3 tentativas
    // ...
    return failureCount < 3;
  },
  refetchOnWindowFocus: false,
},
mutations: { retry: 1 },
```

Há também uma `queryKeys` factory (campuses, campus, students, geofences, ambassadors…).

---

## 3. Swagger TypeScript API (geração de tipos)

**Propósito:** gerar o cliente TypeScript + tipos de dados a partir do contrato OpenAPI do backend,
mantendo os tipos do painel em sincronia com a API.

**Comando** (em [`package.json`](../package.json)):

```jsonc
"generate:api": "npx swagger-typescript-api generate -p ../walky-backend/swagger.json -o ./src/API --axios --name WalkyAPI.ts"
```

- Ferramenta: [`swagger-typescript-api`](https://github.com/acacode/swagger-typescript-api) (autor
  acacode) — invocada via `npx` (não é dependência declarada).
- Entrada (`-p`): **`../walky-backend/swagger.json`** — o repositório `walky-backend` precisa estar
  clonado ao lado, e o `swagger.json` gerado/exportado. Não há download remoto do spec.
- Saída (`-o`): **`./src/API`**.
- Flags: `--axios` (cliente baseado em Axios) e `--name WalkyAPI.ts` (nome do arquivo principal).

**Arquivos gerados em [`src/API/`](../src/API/):** todos começam com o cabeçalho
`## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API` — **não editar à mão**:

- `WalkyAPI.ts` — arquivo principal (nome via `--name`); exporta `Api` e `HttpClient` (~378 KB).
- `Api.ts` — variante do cliente completo (~374 KB).
- `http-client.ts` — classe `HttpClient` (wrapper Axios genérico: `mergeRequestParams`,
  `createFormData`, `request`, etc.).
- `data-contracts.ts` — interfaces de tipos de dados.
- Clients por domínio: `Admin.ts`, `Age.ts`, `Ambassadors.ts`, `Analytics.ts`, `Audit.ts`,
  `Auth.ts`, `Users.ts`.

> `src/API/index.ts` **não** é gerado — é o wrapper manual que configura base, interceptors e
> exporta `apiClient`/`httpClient`/`API`.

**Fluxo de contrato (comum a app/admin/hq):** mudança no backend → regenerar `swagger.json` no
backend → rodar `generate:api` no admin → recompilar. Ver [`../AI_CONTEXT.md`](../AI_CONTEXT.md) §0.

```mermaid
flowchart LR
  BE["walky-backend"] -->|exporta| SW["swagger.json"]
  SW -->|generate:api<br/>swagger-typescript-api| OUT["src/API/*.ts<br/>(WalkyAPI, Api, http-client,<br/>data-contracts, Admin…)"]
  OUT -->|Api + HttpClient| IDX["src/API/index.ts<br/>(wrapper: base + interceptors)"]
  IDX -->|apiClient| SVC["src/services/*"]
```

---

## 4. Google Maps

**Propósito:** desenhar e editar o **boundary/geofence do campus** (polígono GeoJSON) na tela de
configuração de campus.

**Arquivo:** [`src/pages-v2/CampusBoundary/CampusBoundary.tsx`](../src/pages-v2/CampusBoundary/CampusBoundary.tsx)

**Biblioteca:** [`@react-google-maps/api`](https://www.npmjs.com/package/@react-google-maps/api)
(`^2.20.7`) — usa `useJsApiLoader`, `GoogleMap`, `StandaloneSearchBox`, `Libraries`.

```ts
// src/pages-v2/CampusBoundary/CampusBoundary.tsx
const libraries: Libraries = ["places"]; // DrawingManager foi removido na Maps JS v3.65
const { isLoaded, loadError } = useJsApiLoader({
  id: "google-map-script",
  googleMapsApiKey: "AIzaSyAumxyJ5Z1j-_X1EHUSy8GCRr21zDPzSHs",
  libraries,
});
```

> ⚠️ **Atenção — chave hardcoded:** a `googleMapsApiKey` está **fixa no código-fonte**, não vem de
> variável de ambiente. Apesar de o `.env.example` sugerir `VITE_GOOGLE_MAPS_API_KEY`, essa env var
> **não é lida em nenhum lugar** de `src/`. O único uso de env var no código é `VITE_API_BASE_URL`
> (e `import.meta.env.DEV`). Recomenda-se migrar a chave para `VITE_GOOGLE_MAPS_API_KEY` e restringi-la.

O polígono é desenhado manualmente com listeners de clique do mapa (a `drawing library` não é mais
usada porque `DrawingManager` foi removido na Maps JS API v3.65). Os tipos vêm de
`@types/google.maps` (`^3.58.1`).

---

## 5. Sentry

**Não há integração de Sentry no código.** Não existe pacote `@sentry/*` no
[`package.json`](../package.json), nem `import`/`init` de Sentry em `src/`.

O [`.env.example`](../.env.example) menciona `VITE_SENTRY_DSN` apenas como comentário ("Other
potential environment variables"), mas essa variável **não é consumida** em lugar nenhum. Tratar como
placeholder/intenção futura, não como integração ativa.

O que existe no lugar é um **logger próprio** ([`src/lib/logger.ts`](../src/lib/logger.ts)):
`debug`/`info` só em dev (`import.meta.env.DEV`), `warn`/`error` sempre — para não vazar PII no
console em produção. É o logger usado pelos interceptors do Axios e pelos services.

---

## 6. Outras bibliotecas de dados/visualização

Não são "integrações externas" (não chamam serviços de terceiros), mas fazem parte da camada de
dados/visualização do painel:

- **Recharts** (`^3.4.1`) — gráficos dos dashboards. Uso em
  `src/pages-v2/Dashboard/components/LineChart/LineChart.tsx` e
  `src/pages-v2/Dashboard/components/DonutChart/DonutChart.tsx` (e mock em `src/test/setup.ts`).
- **Three.js** + `@react-three/fiber` + `@react-three/drei` — visualizações 3D experimentais do
  **Playground** (`src/pages-v2/Playground/*` — ex.: `InterestCloud`, `InterestConstellation`,
  `ActiveUsersSpiral`, `ActiveUsersOrbs`…). Todas as ~13 telas 3D usam Three.js; o Playground **não**
  usa Recharts.
- **html2canvas** / **html2pdf.js** — export de relatórios (PDF/imagem).
- **date-fns**, **react-hot-toast**, **simplebar-react**, **lucide-react** — utilidades de UI.

---

## 7. Resumo de variáveis de ambiente

Ver detalhes de config/deploy em [deployment.md](./deployment.md#variáveis-de-ambiente).

| Variável | Onde é lida | Obrigatória | Observação |
|---|---|---|---|
| `VITE_API_BASE_URL` | `src/API/index.ts`, `src/test/handlers.ts` | Efetivamente sim | Fallback `http://localhost:8080/api`. Cliente gerado remove o sufixo `/api`. |
| `VITE_APP_NAME` | `.env.example` | Não (não lida em `src/`) | Ex.: `Walky Admin`. |
| `VITE_ENV` | `.env.example` | Não (não lida em `src/`) | `development` / `staging` / `production`. |
| `VITE_GOOGLE_MAPS_API_KEY` | — | Não | Sugerida no `.env.example`, mas **não usada** — a chave está hardcoded em `CampusBoundary.tsx`. |
| `VITE_SENTRY_DSN` | — | Não | Sugerida no `.env.example`, mas **sem integração** de Sentry. |
| `import.meta.env.DEV` | `src/lib/logger.ts` | (built-in Vite) | Ativa logs de dev. |

> Único uso real de env var de aplicação em `src/` = **`VITE_API_BASE_URL`**. As demais são apenas
> sugestões do `.env.example`.
