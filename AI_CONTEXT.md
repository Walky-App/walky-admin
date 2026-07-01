# Walky — Contexto do Ecossistema (para IA)

> **Objetivo deste documento:** servir de **contexto único** para uma IA entender os quatro
> repositórios que compõem a plataforma Walky. A partir daqui, a IA deve conseguir escrever
> um **prompt de documentação** e, depois, gerar a documentação de cada repositório de forma
> consistente. Não é a documentação final — é o mapa que dá à IA a visão de conjunto.

---

## 0. Visão geral da plataforma

**Walky** é uma plataforma de **rede social para campus universitários**. Ajuda estudantes a
descobrir eventos, encontrar colegas por perto, explorar espaços do campus, trocar mensagens em
tempo real e organizar encontros espontâneos ("walks"). Atende 10.000+ estudantes em várias
universidades (ex.: FIU, FAU).

A plataforma é composta por **4 repositórios**, todos localizados em `/Volumes/SSDDEV/DEV_PROJETOS/`:

| # | Repositório | Pasta | Papel | Público-alvo |
|---|-------------|-------|-------|--------------|
| 1 | **App móvel (WOC)** | `walkyApp` | App iOS/Android que o estudante usa | Estudantes |
| 2 | **Backend** | `walky-backend` | API REST + WebSockets, banco de dados | (serve todos) |
| 3 | **Admin** | `walky-admin` | Painel administrativo (CoreUI) | Admins de campus/escola, moderadores |
| 4 | **HQ** | `walky-hq` | Painel super-admin/analytics (shadcn) | Super-admins Walky (interno) |

**Fluxo de dependência:** o **App**, o **Admin** e o **HQ** são todos clientes do **Backend**.
Admin e HQ geram seus tipos TypeScript a partir do **Swagger/OpenAPI do backend**
(`../walky-backend/swagger.json`). O App usa **Orval** para gerar hooks React Query do mesmo Swagger.

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

**Convenção de geração de tipos (comum aos 3 clientes):** todos consomem o contrato OpenAPI do
backend. Mudança de contrato no backend → regenerar tipos/clients nos 3 frontends.

---

## 1. walkyApp — App móvel (WOC)

**Propósito:** app móvel voltado ao estudante. Conexão entre pares, compartilhamento de
localização em tempo real, mensagens, eventos e descoberta via mapa. Versão atual **3.5.2**.
Repositório privado.

### Stack
- **React Native** 0.81.4 · **React** 19.1 · **TypeScript** 5.9 · **Expo** 54 (dev client)
- **Gerenciador de pacotes:** Bun 1.2.4
- **Estado:** Zustand 4.5 (`useGlobalStore`) + React Query 5.80 (server state)
- **API client:** Orval 7.11 (gera hooks React Query a partir do Swagger) + Axios
- **Navegação:** Expo Router 6 (file-based) + React Navigation 7
- **UI/animação:** Reanimated 4, Gesture Handler, Gorhom Bottom Sheet, Unistyles 3, Lottie
- **Tempo real:** socket.io-client 4.8 (WebSocket + polling fallback p/ WiFi restritivo do campus)
- **Mapas/localização:** react-native-maps, Turf.js, Expo Location (com background tracking)
- **Monitoramento/analytics:** Sentry, Firebase Analytics, Mixpanel, PostHog, Pendo
- **Storage:** AsyncStorage, MMKV, Expo FileSystem

### Estrutura (`src/`)
- `app/` — rotas file-based do Expo Router: `(public)` (auth), `(main-v3)` (tabs autenticadas),
  `(global-v3)` (modais), `(bottom-sheet)`
- `features/` — módulos por feature: `auth`, `home`, `events-v3`, `chat-v3`, `explore`, `map`,
  `peers`, `profile`, `spaces`, `ideas-v3`, `report`, `upgrades`, `sa-onboarding`, `bottomTabBar`
- `components/common/` — 46+ componentes reutilizáveis
- `services/` — camada de integração: `API/` (Axios), `analytics/`, `notifications/`, `location/`,
  `featureFlags/`, `deeplink/`, `prefetch/`, `logging/`
- `api/generated/` — cliente gerado por Orval (`walky.ts`) · `api/mutator/` — Axios custom
- `hooks/` — hooks de socket por feature (`useEventSocket`, `useInviteSocket`, etc.)
- `store/global/`, `query/`, `theme/`, `styles/unistyles.ts`, `utils/`

### Features principais
`auth` (login/onboarding), `home` (feed/descoberta), `events-v3` (criar/RSVP/chat de evento),
`chat-v3` (DM + chat de evento em tempo real), `explore`+`map` (descoberta por mapa),
`peers` (perfis/conexões), `profile`, `spaces` (comunidades), `ideas-v3`, `report` (moderação).

### Integração com backend
- **HTTP:** Axios em `src/services/API/`, base via env `BASE_URL`, Bearer token via `AuthService`,
  refresh automático no 401, checagem de conectividade (netinfo) antes de requisitar.
- **Socket:** `SocketProvider` em `src/utils/sockets/`, auth por token no handshake,
  WebSocket + long-polling, reconnect tunado p/ mobile.
- **Orval:** config em `orval.config.ts`, gera hooks em `src/api/generated/walky.ts`.
  Scripts: `api:generate`, `api:generate:watch`, `api:fetch-swagger`.

### Env vars
`APP_ID`, `DISPLAY_NAME`, `BASE_URL`, `SOCKET_URL`, `GOOGLE_MAPS_API_KEY`, `SENTRY_DSN`,
`MIXPANEL_TOKEN`, `POSTHOG_API_KEY`, `PENDO_API_KEY`, `USE_BACKGROUND_LOCATION`.
Arquivos: `.env`, `.env.staging`, `.env.production`, `.env.e2e`.

### Build/run
- Scripts (Bun): `bun start`, `bun ios`, `bun android`, `bun type-check`, `bun lint`, `bun test`,
  `bun test:e2e`, `bun api:generate`.
- **EAS** (`eas.json`): perfis `development`, `development-device`, `preview`, `staging`,
  `production`, `e2e-test`. iOS→TestFlight, Android→Firebase App Distribution/Google Play.
- **Testes:** Jest (unit, 40+ mocks) + Maestro (E2E em YAML, `.maestro/`).

### Convenção local (deste ambiente)
- O simulador **sempre** aponta para o backend local (`walky-backend`), nunca staging/prod.
- Backend local roda em `PORT=8080`; Metro usa 8081. `.env`: `BASE_URL=http://localhost:8080`,
  `SOCKET_URL=ws://localhost:8080`. Após alterar `.env`, reiniciar Metro com
  `npx expo start --dev-client --clear`.

---

## 2. walky-backend — API REST + WebSockets

**Propósito:** API REST central da plataforma (serve app, admin e HQ). Node.js/Express/TypeScript
com MongoDB, Redis e Socket.io. Deploy em **GCP Cloud Run**. Equipe pequena (2–3 devs), foco em
velocidade e tempo real.

### Stack
- **TypeScript** (strict) · **Node 20+** · **Express** · **MongoDB 4.12+ / Mongoose 7.2** ·
  **Redis** (location sync, tempo real) · **Socket.io 4.7**
- **GCP:** Cloud Run (hosting), Cloud Build (CI/CD), Secret Manager, Cloud Storage (imagens),
  Cloud Logging, Cloud Vision (moderação de imagem), Cloud Tasks
- **Integrações:** Sentry, Firebase FCM (push), Expo Server SDK (push V2), SendGrid (email),
  Twilio (SMS/OTP), Google Analytics 4, Google Places API, Replicate (upscale), Sharp, Rebrandly
- **Auth:** JWT + SAML 2.0 (SSO universitário, ex.: FAU)
- **Testes:** Jest 30 + ts-jest + MongoDB Memory Server

### Estrutura (`src/`)
- `index.ts` (entry + socket init), `config.ts`, `config/` (SAML, universidades, GCS, certs)
- `routes/` (54 arquivos) — inclui `dualRouter.ts` (roteia `/api/*` **e** paths legados na raiz)
- `controllers/` (70+), `services/` (61), `model/` (52 schemas Mongoose)
- `middleware/` (11 — auth, rate limit de login, bad words, permissões)
- `jobs/` (14 — cleanup de eventos, rollover de recorrentes, lembretes, agregação de analytics,
  alertas, engagement scores)
- `sockets/` — `walk.socket`, `chat.socket`, `explore.socket` + middleware de auth
- `validators/`, `repositories/`, `migrations/` (98+ scripts), `scripts/` (54, seed/utilitários),
  `templates/emails/`

### Domínios principais
Auth/RBAC · Users/Profiles · **Events** (core) · **Walks** (encontros espontâneos em tempo real) ·
Chat/Messaging · Spaces/Places (locais do campus + Google Places) · Ideas · Interests/Communities ·
Admin/Moderação · Notificações · Analytics/Métricas · Location/Discovery.

### Banco de dados
- **MongoDB Atlas.** Ambientes: **prod** (cluster `prod`), **staging**, dev local.
  > ⚠️ Nota de contexto do time: o DB de produção se chama **`prod`** (não `walky`/`staging`).
- **52 coleções** (models). Core: `users`, `events`, `walks`, `chat`, `spaces`, `ideas`,
  `interests`. Relacionamentos: `eventInvites`, `peerRequests`, `walkInvites`, `spaceMember`.
  Admin: `reports`, `roles`, `permissions`, `auditLogs`, `adminMessages`. Analytics:
  `campusMetricsCache`, `campusAlerts`, `userActivityLog`, `profileView`. Places: `place`,
  `placeType`, `popularPlace`, `campus`, `school`, `areaOfStudy`.

### Auth
- **JWT:** access 24h + refresh 7d. Payload `{ sub, email, role, tokenVersion, iat }`,
  issuer `walky-app`, audience `walky-users`. `authMiddleware.ts` valida. Segredo em `JWT_SECRET`.
  Revogação via incremento de `tokenVersion`.
- **SAML 2.0:** SSO universitário (`saml-config-v2.ts`, certs em `config/certificates/`).
- **RBAC:** roles Student/Faculty/Admin/Sales via IDs em env (`ADMIN_ROLE`, `STUDENT_ROLE`, etc.).

### Tempo real (Socket.io)
Namespaces separados: **walk** (convites/localização ao vivo), **chat** (DM + grupo),
**explore** (feed de descoberta). Rate limit 15 conexões/min por IP (máx 5). Auth JWT no handshake.

### Run local
- Node 20+, MongoDB, Redis, `.env` (pedir ao time). `yarn install` → `yarn dev` → **porta 8081**
  (ou `PORT`). No contexto deste ambiente, roda-se em **8080** para o simulador do app.
- Scripts: `yarn dev|staging|prod|build|test|test:watch|lint|format|seed`.
- **Swagger:** local `http://localhost:8081/api-docs/`, staging/prod idem sob os domínios.

### Env vars (principais)
`PORT`, `NODE_ENV`, `PROJECT_ID`, `MONGO_URI`, `REDIS_URL`, `JWT_SECRET`,
`FIREBASE_PROJECT_ID/PRIVATE_KEY/CLIENT_EMAIL`, `TWILIO_*`, `SENDGRID_API_KEY`,
`AWS_REGION/ACCESS_KEY_ID/SECRET_ACCESS_KEY/S3_BUCKET` (legado), `EXPO_ACCESS_TOKEN`,
`ADMIN_ROLE/STUDENT_ROLE/FACULTY_ROLE/SALES_ROLE`, `REBRANDLY_API_KEY`.

### Ambientes
- Produção: `https://api.walkyapp.com` (branch `main`)
- Staging: `https://staging.walkyapp.com` (branch `staging`)
- Dev: `http://localhost:8081`

---

## 3. walky-admin — Painel administrativo (CoreUI)

**Propósito:** painel para **admins de campus, admins de escola, moderadores e super-admins**
gerenciarem estudantes, eventos, spaces, ideas, moderação e configurações de campus.

### Stack
- **TypeScript** 5.8 · **React** 19.1 · **React Router** v7.6 · **Vite** 7 · **Node** ≥20
- **UI:** **CoreUI 5.7** + React Bootstrap 2.10 (framework de admin tradicional)
- **Dados:** Axios 1.10 + React Query 5.82; tipos gerados via Swagger TypeScript API
- **Estado:** React Context + React Query
- **Viz:** Recharts 3.4 + Three.js (visualizações 3D no "Playground")
- **Estilo:** CSS + Sass, design tokens via CSS variables (dual: CoreUI + tokens V2)
- **Testes:** Vitest 4 + React Testing Library + MSW; checagem de `data-testid` e a11y

### Estrutura (`src/`)
`API/` (cliente Swagger gerado) · `components-v2/` (53 componentes) · `contexts/` (Auth, School,
Campus, Theme) · `hooks/` (`useAuth`, `usePermissions`, `useTheme`) · `layout-v2/` (Sidebar+Topbar) ·
`lib/` (logger, queryClient, matriz de permissões) · `pages-v2/` (telas) · `routes/v2Routes.tsx`
(lazy loading) · `services/` (userService, campusService, etc.) · `styles-v2/` (tokens) · `test/`.

### Telas principais
- **Dashboards (6):** Engagement, Popular Features, User Interactions, Community, Student Safety,
  Student Behavior
- **Campus/Estudantes (4 listas):** Active, Banned, Deactivated, Disengaged
- **Events:** Manager, Insights, Check-In Analytics
- **Spaces:** Manager, Insights · **Ideas:** Manager, Insights
- **Moderação:** Report Safety, Report History
- **Administração (super/school admin):** Campuses (geofences, ambassadors), Ambassadors,
  Role Management, Administrator Settings
- **Playground:** 14 visualizações experimentais de dados
- **Auth:** Login (+2FA opcional), recuperação de senha, troca forçada de senha

### Integração com backend
- Axios com interceptors. Base via `VITE_API_BASE_URL`
  (prod `https://api.walkyapp.com/api`, local `http://localhost:8080|8081/api`).
- Bearer token em localStorage + proteção CSRF (token de cookie em requests não-GET).
- 401→logout/redirect login; 403 com `ACCOUNT_DEACTIVATED`→modal; retry (máx 3, pula 4xx exceto 408).
- Camada de services + React Query (stale 5min, cache 10min).

### Auth
Token+user em localStorage. `useAuth()` reativo. **RBAC** com roles
`super_admin`/`school_admin`/`campus_admin`/`moderator`/`walky_internal`; matriz em
`src/lib/permissions.ts`; `<PermissionGuard>` e `<AuthGuard>` protegem rotas. Sync entre abas via
storage events.

### Build/run
`npm run dev` (porta 5173), `build`, `preview`, `type-check`, `lint`, `test`, `test:coverage`,
`check:testids`, `check:a11y`, `check:all`, `generate:api` (requer `../walky-backend/swagger.json`),
`generate:icons`, `generate:images`. Deploy Vercel.
Env: `VITE_API_BASE_URL`, `VITE_APP_NAME`, `VITE_ENV`, (opc.) `VITE_GOOGLE_MAPS_API_KEY`,
`VITE_SENTRY_DSN`.

---

## 4. walky-hq — Painel super-admin / Analytics (shadcn)

**Propósito:** dashboard de **HQ / super-admin** para o time interno Walky. Administração global da
plataforma, analytics avançado, moderação e configuração de entidades core (usuários, escolas,
campi, interesses, spaces, roles). É o sistema mais novo e sofisticado.

### Stack
- **React** 19 · **TypeScript** 5.7 (strict) · **Vite** 6 · **React Router** 6.22 · **Node** 18+ · Yarn
- **UI:** **shadcn/ui** (Radix) + **Tailwind CSS** 3.3 + Lucide + Sonner (moderno, utility-first)
- **Estado:** Zustand 5 (auth, persistido em localStorage) + React Query 5.67 + Context (school/campus)
- **Dados:** Axios 1.8 (interceptors + refresh) + React Hook Form 7.54 + Zod 3.24
- **Viz:** Recharts 3.3 · @dnd-kit (drag-and-drop) · Google Maps · Google Analytics Data API · Firebase 12

### Estrutura (`src/`)
`api/` (`client.ts` + 25+ services) · `components/` (`ui/` shadcn, `common/`, `analytics/`,
`layout/`, `filters/`) · `pages/` (35+) · `router/` (`ProtectedRoute.tsx`) · `store/authStore.ts` ·
`contexts/` (School, Campus) · `hooks/` · `types/` (100+ interfaces) · `utils/` · `lib/` (firebase, cn).

### Telas principais (35+ rotas)
Dashboard (overview) · Engagement · Users · Walks · Events · Schools · Places · Popular Places ·
Interests · Interest Groups · Place Types · Surprise Rolls · Ideas · Spaces (+categorias) ·
Roles (RBAC) · Reports · Banned Users · Areas of Study · Report Reasons · Deletion Requests ·
Audit Logs · User Activity · Locked Users · Jobs (monitoramento de background jobs) · Messages · Profile.
**Analytics avançado:** session, messaging, profile views, engagement, lifecycle, social graph,
referrals, safety.

### Integração com backend
- `src/api/client.ts` (Axios). Base via `VITE_BASE_URL`
  (dev `http://localhost:8080`, staging `https://staging.walkyapp.com`, prod `https://api.walkyapp.com`).
- Interceptors: injeta Bearer token; no 401 faz refresh e re-fila requests; falha→logout/redirect.
- Tokens em localStorage (`token`, `refresh_token`, `auth-storage`). 25+ services em `api/services/`.

### Auth
JWT com rotação de refresh token. Zustand `authStore` persiste `token/refreshToken/user/isAuthenticated`.
`ProtectedRoute` checa `isAuthenticated`. Credencial de teste conhecida: `gal@walkyapp.com`.

### Build/run
`yarn dev` (porta 5173), `build`, `lint`, `preview`. Deploy Vercel (`vercel.json`, saída `dist/`).
Env: `VITE_BASE_URL` (obrigatório), `VITE_GA_PROPERTY_ID` (opcional).

---

## 5. Admin vs HQ — como diferem

| Aspecto | walky-admin | walky-hq |
|--------|-------------|----------|
| UI | CoreUI 5 + Bootstrap | shadcn/ui + Tailwind |
| Build | Vite 7 | Vite 6 |
| Estado | Context + React Query | Zustand + React Query |
| Público | Admins de campus/escola, moderadores | Super-admins internos Walky |
| Ênfase | Gestão operacional por campus, moderação | Analytics global avançado, config de entidades core |
| Maturidade | Sistema com CoreUI, orientado a operação | Sistema mais novo/sofisticado |

Há **sobreposição funcional** (ambos têm users, events, spaces, ideas, reports, roles, campus).
A distinção é de **escopo e público**: Admin é operação por campus/escola; HQ é super-admin/analytics global.

---

## 6. Fatos transversais úteis para a IA

- **Contrato único:** os 3 frontends derivam tipos do **Swagger do backend**. Documentar o backend
  primeiro dá base para os clients.
- **Auth consistente:** JWT (access + refresh) em toda a stack; RBAC por roles; backend também
  suporta SAML SSO universitário.
- **Tempo real:** Socket.io no backend (namespaces walk/chat/explore) consumido pelo app.
- **Multi-tenant por campus/escola:** entidades `school`/`campus` permeiam todos os repos;
  contexts de School/Campus existem tanto no Admin quanto no HQ.
- **Domínios de negócio compartilhados** (vocabulário comum a documentar uma vez): Users, Events,
  Walks, Chat, Spaces/Places, Ideas, Interests, Reports/Moderação, Analytics, Campus/School, Roles.
- **Deploy:** backend em GCP Cloud Run; Admin e HQ em Vercel; App via EAS (TestFlight / Firebase / Play).
- **Ambientes backend:** prod (`api.walkyapp.com`), staging (`staging.walkyapp.com`), local (8081).

---

## 7. Localização dos repositórios

```
/Volumes/SSDDEV/DEV_PROJETOS/
├── walkyApp/        # App móvel (WOC)  — React Native / Expo
├── walky-backend/   # API + WS         — Node / Express / Mongo / Redis
├── walky-admin/     # Admin            — React / CoreUI / Vite
└── walky-hq/        # HQ super-admin   — React / shadcn / Vite
```

Cada repositório tem seu próprio `README.md`; `walky-hq` e `walky-admin` também têm um
`claude.md`/`CLAUDE.md` com notas de desenvolvimento.

---

## 8. Como a IA deve usar este documento

1. **Entender o conjunto** antes de documentar qualquer repo isolado (dependências e contrato comum).
2. **Escrever um prompt de documentação** que:
   - documente o **backend primeiro** (é a fonte do contrato/tipos e dos domínios de negócio);
   - reutilize o **vocabulário de domínio** da seção 6 para manter consistência entre repos;
   - para cada frontend, cubra: propósito/público, stack, estrutura de pastas, telas/features,
     integração com backend (base URL/env/auth), build/run e deploy;
   - destaque **diferenças Admin vs HQ** para não duplicar/confundir.
3. **Manter um glossário único** dos domínios (Events, Walks, Spaces, Ideas, Campus/School, Roles…)
   referenciado pelos quatro repositórios.
