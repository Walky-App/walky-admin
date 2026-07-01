# Convenções — walky-admin

> Padrões **reais** do painel administrativo Walky (React 19 + CoreUI 5 + Vite 7).
> Todos os exemplos abaixo são trechos verdadeiros do código-fonte. Cite sempre paths
> absolutos ao referenciar arquivos.

## Índice

- [1. O sufixo `-v2`](#1-o-sufixo--v2)
- [2. Nomenclatura de arquivos e símbolos](#2-nomenclatura-de-arquivos-e-símbolos)
- [3. Componente: pasta `.tsx` + `.css` namespaced](#3-componente-pasta-tsx--css-namespaced)
- [4. `data-testid` obrigatório (`check:testids`)](#4-data-testid-obrigatório-checktestids)
- [5. Acessibilidade (`check:a11y`)](#5-acessibilidade-checka11y)
- [6. Barrel exports (`index.ts`)](#6-barrel-exports-indexts)
- [7. Camada de services](#7-camada-de-services)
- [8. React Query](#8-react-query)
- [9. Design tokens (CSS variables) + dark mode](#9-design-tokens-css-variables--dark-mode)
- [10. `PermissionGuard` / `AuthGuard` em rotas](#10-permissionguard--authguard-em-rotas)
- [11. Logging (nunca `console.*` direto)](#11-logging-nunca-console-direto)

Cross-links: [development.md](./development.md) · [troubleshooting.md](./troubleshooting.md) · [ai-reference.md](./ai-reference.md)

---

## 1. O sufixo `-v2`

O app foi migrado para um novo design system. **O código novo vive em pastas com sufixo `-v2`**;
o código legado (sem sufixo) está em processo de descontinuação. Ao criar algo novo, use sempre a
variante `-v2`.

| Legado | Atual (usar) |
|--------|--------------|
| `src/components/` | `src/components-v2/` |
| `src/pages/`, `src/views/` | `src/pages-v2/` |
| `src/layout/` | `src/layout-v2/` |
| `src/assets/` | `src/assets-v2/` |
| `src/styles/` | `src/styles-v2/` |
| rotas antigas | `src/routes/v2Routes.tsx` |

O `App.tsx` monta `V2Routes` como rota default (`/*`) e redireciona paths antigos `/v2/*` para a raiz
(`src/App.tsx`). As checagens de qualidade (`scripts/check-test-ids.js`, `scripts/check-accessibility.js`)
**só varrem** `src/pages-v2`, `src/components-v2` e `src/layout-v2`.

## 2. Nomenclatura de arquivos e símbolos

- **Componentes/páginas**: `PascalCase`. A pasta tem o mesmo nome do componente:
  `src/components-v2/Chip/Chip.tsx`, `src/pages-v2/Events/EventsManager/EventsManager.tsx`.
- **CSS pareado**: mesmo nome do componente — `Chip.tsx` → `Chip.css`.
- **Barrel**: cada pasta tem um `index.ts` que reexporta.
- **Hooks**: `camelCase` com prefixo `use` — `src/hooks/useAuth.ts`, `useDebounce.ts`.
- **Services**: `camelCase` + sufixo `Service` — `src/services/userService.ts`, `campusService.ts`.
- **Testes**: um arquivo por fonte, ao lado — `Foo.tsx` → `Foo.test.tsx` (ver [development.md](./development.md#testes)).
- **Classes CSS**: `kebab-case` prefixado pelo nome do componente (ver seção 3).

## 3. Componente: pasta `.tsx` + `.css` namespaced

Cada componente é uma pasta com três arquivos: o `.tsx`, o `.css` de mesmo nome e o `index.ts`.
Não há CSS Modules; o isolamento é feito por **convenção de prefixo** nas classes.

```
src/components-v2/Chip/
├── Chip.tsx      # componente
├── Chip.css      # estilos, classes prefixadas .chip-*
└── index.ts      # barrel
```

O `.tsx` importa o `.css` diretamente e todas as classes começam com o nome do componente:

```tsx
// src/components-v2/Chip/Chip.tsx
import "./Chip.css";

export const Chip: React.FC<ChipProps> = ({ value, type, className = "" }) => {
  return (
    <span className={`chip-badge ${sizeClass} ${className}`.trim()} style={{ ... }}>
      <span className="chip-badge__label">{displayLabel}</span>
    </span>
  );
};
```

```css
/* src/components-v2/Chip/Chip.css — todas as classes prefixadas com .chip-badge */
.chip-badge { display: inline-flex; border-radius: 999px; font-family: "Lato", sans-serif; }
.chip-badge--compact { min-height: 28px; }
.chip-badge__label { display: block; white-space: pre-line; }
```

Páginas seguem o mesmo padrão: `EventsManager.tsx` importa `./EventsManager.css` e usa classes
`events-manager-*` (`src/pages-v2/Events/EventsManager/`). Sub-componentes de uma página moram em
`components/` dentro da pasta da feature (ex.: `src/pages-v2/Events/components/EventTable/`).

## 4. `data-testid` obrigatório (`check:testids`)

**Todo `<button>`, `<input>` e `<form>`** em `pages-v2`/`components-v2` precisa de `data-testid`.
O script `scripts/check-test-ids.js` roda no pre-commit e no CI (`.github/workflows/code-quality.yml`)
e **bloqueia** o commit se faltar.

```tsx
// src/pages-v2/Events/EventsManager/EventsManager.tsx
<button
  data-testid="view-list-btn"
  className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
  onClick={() => setViewMode("list")}
>
  List view
</button>
```

Componentes de UI compartilhados expõem props para propagar o testid ao elemento interativo interno
(ex.: `FilterDropdown` recebe `testId="event-type-filter"`). Nos testes, prefira consultar por
role/label/testid — nunca por classe CSS (ver `docs/TESTING.md`).

## 5. Acessibilidade (`check:a11y`)

O `scripts/check-accessibility.js` (WCAG 2.1 AA) roda no pre-commit e no CI, varrendo
`pages-v2`, `components-v2`, `layout-v2`. Regras aplicadas (violação = commit bloqueado):

- `<img>` precisa de `alt` ou `aria-hidden="true"`.
- `<button>` precisa de texto visível **ou** `aria-label`/`aria-labelledby` (botões só-ícone
  exigem `aria-label`).
- `<input>`/`<select>` precisam de `aria-label`, `aria-labelledby` ou `id` (para associar `<label>`).
- Roles de landmark/widget (`region`, `group`, `navigation`, `form`, …) exigem rótulo acessível.
- `role="radio"` → `aria-checked`; `role="tab"` → `aria-selected`.

Warnings (não bloqueiam): páginas em `pages-v2` deveriam ter landmark `<main>`; componentes com
`onClick` cujo `.css` não tem `:focus`/`:focus-visible`. Exemplo real de página com `<main>`:

```tsx
// src/pages-v2/Events/EventsManager/EventsManager.tsx
return <main className="events-manager-container"> ... </main>;
```

## 6. Barrel exports (`index.ts`)

Cada componente/feature exporta via `index.ts`, e há um barrel raiz agregando tudo:

```ts
// src/components-v2/Chip/index.ts
export { Chip } from "./Chip";
export type { ChipProps, ChipType } from "./Chip";
```

```ts
// src/components-v2/index.ts (agregador — importe daqui)
export { Chip } from "./Chip";
export { FilterDropdown } from "./FilterDropdown";
export { PermissionGuard } from "./PermissionGuard";
export { AuthGuard } from "./AuthGuard";
```

Consumidores importam do barrel, não do arquivo interno:

```tsx
import { Pagination, SearchInput, FilterDropdown, NoData } from "../../../components-v2";
```

Barrels de feature também reexportam tipos usados fora dela — ex.:
`src/pages-v2/Events/index.ts` exporta `EventsManager`, `EventsInsights`, `CheckInAnalytics` e os
tipos `EventData`/`EventType`.

## 7. Camada de services

`src/services/*` encapsula chamadas ao **cliente Swagger gerado** (`apiClient` de `src/API`),
normaliza a resposta e centraliza logging/erros. Não chame `apiClient` cru em componentes de negócio
quando um service existir. Estrutura típica: objeto com métodos `async` + `export default`.

```ts
// src/services/userService.ts
import { logger } from "../lib/logger";
import { apiClient } from "../API";

export const userService = {
  getUsers: async (params?: UsersListParams): Promise<UsersListResponse> => {
    try {
      const response = await apiClient.api.adminUsersList({ ...params });
      return {
        users: response.data.users || [],
        pagination: { page: apiPagination?.page ?? 1, /* ... */ },
      };
    } catch (error) {
      logger.error("❌ Failed to fetch users:", error);
      throw error;
    }
  },
};
export default userService;
```

Convenções: parâmetros/retornos tipados via interfaces; normalização de campos opcionais com `??`/`||`;
`logger.debug` na entrada/sucesso e `logger.error` + `throw` no catch (para o React Query tratar).

## 8. React Query

Server state é sempre via `@tanstack/react-query`. O client global (`src/lib/queryClient.ts`) define:
`staleTime` 5 min, `gcTime` 10 min, `refetchOnWindowFocus: false`, e um `retry` que **não** repete
4xx (exceto 408), até 3 tentativas; mutations `retry: 1`.

Uso em página, com `queryKey` incluindo todos os filtros e contexto de school/campus, e
`placeholderData: keepPreviousData` para paginação suave:

```tsx
// src/pages-v2/Events/EventsManager/EventsManager.tsx
const { data: eventsData, isLoading } = useQuery({
  queryKey: ["events", currentPage, debouncedSearchQuery, typeFilter, statusFilter,
             sortBy, sortOrder, selectedSchool?._id, selectedCampus?._id],
  queryFn: () => apiClient.api.adminV2EventsList({ page: currentPage, limit: 10, /* ... */ }),
  placeholderData: keepPreviousData,
});
```

Há uma factory de chaves em `queryClient.ts` (`queryKeys.campuses`, `queryKeys.campus(id)`, …) para
domínios com invalidação. Buscas com input de texto passam por `useDebounce` (`src/hooks/useDebounce.ts`,
500 ms típico) antes de virar `queryKey`.

## 9. Design tokens (CSS variables) + dark mode

Convivem **dois** sistemas de tema: os do CoreUI (`data-coreui-theme`) e os tokens **V2** próprios.

- Tokens V2 em `src/styles-v2/design-tokens.css` como CSS variables `--v2-*`
  (`--v2-primary-purple-main: #526ac9`, `--v2-bg-card`, `--v2-text-primary`, `--v2-spacing-16`, …).
  Origem: Figma "Walky Admin Portal". Importados uma vez em `src/main.tsx`.
- **Dark mode** sobrescreve os mesmos tokens sob dois seletores:

```css
/* src/styles-v2/design-tokens.css */
:root[data-coreui-theme="dark"],
[data-theme="dark"] { /* redefine --v2-* para o tema escuro */ }
```

O `ThemeProvider` (`src/contexts/ThemeProvider.tsx`) inicializa de `localStorage("theme")` ou
`prefers-color-scheme`, e no toggle seta `data-coreui-theme` + `data-theme` no `<html>`, injeta cores
`--app-*` e adiciona/remove `body.dark-theme`. O `App.tsx` também alterna `body.dark-mode`.
No CSS de componentes, **use as variáveis `--v2-*`** em vez de cores hardcoded para herdar dark mode.

## 10. `PermissionGuard` / `AuthGuard` em rotas

RBAC é declarado por rota. Roles: `super_admin`, `school_admin`, `campus_admin`, `moderator`,
`walky_internal`. A matriz de permissões vive em `src/lib/permissions.ts`
(`permissionMatrix[role][resource] → { read, create, update, delete, export, manage }`).

- `AuthGuard` (`src/components-v2/AuthGuard/`) protege toda a árvore autenticada em `App.tsx`:
  redireciona para `/login` se não autenticado, e **renderiza `null` enquanto `isLoading`** (evita
  flash de redirect no refresh).
- `PermissionGuard` (`src/components-v2/PermissionGuard/`) envolve cada rota protegida em
  `src/routes/v2Routes.tsx`, com `resource` e `fallback="redirect"`:

```tsx
// src/routes/v2Routes.tsx
<Route path="events" element={
  <PermissionGuard resource="events_manager" fallback="redirect">
    <EventsManager />
  </PermissionGuard>
} />
```

Em UI inline (botões de ação), use o mesmo guard com `fallback="hidden"` (default) ou o HOC
`withPermission`. Para checagens imperativas, `usePermissions()` expõe `can/canRead/canUpdate/
canExport/canCreate/canDelete/canManage` e flags `isSuperAdmin`/`isModerator`/… (`src/hooks/usePermissions.ts`).

## 11. Logging (nunca `console.*` direto)

A regra ESLint `no-console: error` **proíbe** `console.*` no código. Todo log passa por
`src/lib/logger.ts` (`logger.debug/info/warn/error`). `debug`/`info` só emitem em DEV
(`import.meta.env.DEV`) para não vazar payloads/PII em produção; `warn`/`error` sempre emitem.
Vite também remove `console.log/info/debug` no build (`vite.config.ts` → `esbuild.pure`).
O único arquivo com `console` permitido é o próprio `logger.ts` (via `eslint-disable`).
