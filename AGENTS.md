# AGENTS.md — walky-admin

<!--
  Single source of instructions for AI coding agents in this repo.
  Codex reads AGENTS.md directly; Claude Code reads CLAUDE.md, which imports this file.
  Edit THIS file. Keep CLAUDE.md as a thin import (Claude-only notes at most).
-->

Campus/school admin and moderator panel (React 19 + Vite 7 + TypeScript strict, CoreUI +
React Bootstrap, React Query, Axios, Vitest + RTL + MSW). Audience: `super_admin`,
`school_admin`, `campus_admin`, `moderator`, `walky_internal`; RBAC in
`src/lib/permissions.ts`. Different from `walky-hq` (internal super-admin/analytics).
Dense reference: `docs/ai-reference.md`; more in `docs/` (`overview.md`, `conventions.md`,
`development.md`, `TESTING.md`, `troubleshooting.md`).

## Commands

- `yarn dev` (5173), `yarn build` (`tsc -b && vite build`), `yarn lint`, `yarn type-check`
- `yarn test --run`, `yarn test:coverage`, `yarn check:all` (testids + a11y + tests; also
  enforced by pre-commit and CI). Run `check:all` and `lint` before opening a PR.
- `yarn generate:api` regenerates the client in `src/API/` from `../walky-backend/swagger.json`.
- Env: `VITE_API_BASE_URL` (must end in `/api`; local backend `http://localhost:8080/api`).
  Deployed by Vercel's Git integration (`main` = production, previews per PR).

## Conventions

- New code goes in the `-v2` folders (`pages-v2/`, `components-v2/`, `layout-v2/`, ...);
  legacy folders are end-of-life.
- A component is a `Name/` folder with `Name.tsx`, `Name.css` (classes prefixed `name-*`,
  no CSS Modules) and `index.ts`; import through the root barrel.
- `data-testid` on every button/input/form in v2 code; WCAG 2.1 AA (labels, aria, focus).
- Server state via React Query; never `console.*` (use `logger`); colors/spacing via
  `--v2-*` tokens so dark mode works.
- `src/API/WalkyAPI.ts` and friends are generated: never hand-edit, regenerate.
- Tests next to the file (`Foo.test.tsx`), render with `renderWithProviders`, MSW for network.

## Walky ecosystem (shared across all repos)

Walky is a social app for university campuses: events, "walks" (spontaneous real-time
meetups), chat, spaces, ideas, map/peers. Multi-tenant by school/campus (FIU, FAU, ...).
Owner: Gustavo (GitHub `gustavobacellarladeira`), GitHub org `Walky-App`. Sibling clones
live next to each other (author's path: `/Volumes/SSDDEV/DEV_PROJETOS/`).

| Repo | What | Default branch | Stack |
|---|---|---|---|
| `walky-backend` | REST API + WebSockets | `staging` (`main` = prod) | Node 20, Express, TS, MongoDB/Mongoose, Redis, Socket.io, Jest |
| `walkyApp` | Student mobile app (RN, being replaced) | `main` | React Native 0.81, Expo 54 dev client, Bun, Expo Router, Zustand, React Query, Orval |
| `walky-native` | Native rewrite of walkyApp (same bundle id) | `main` | iOS Swift/SwiftUI (WalkyCore), Android Kotlin/Compose |
| `walky-admin` | Campus/school admin + moderator panel | `main` | React 19, Vite 7, CoreUI, React Query, Vitest |
| `walky-hq` | Internal super-admin / analytics panel | `main` | React 19, Vite 6, shadcn/Tailwind, Zustand, React Query |
| `deep-link` | Universal links, short links, OG previews | `main` | Express on Vercel |

Deep cross-repo reference: `AI_CONTEXT.md` (identical copy in walkyApp, walky-backend,
walky-admin, walky-hq). Read only the section you need.

## Project-wide rules

- Talk to Gustavo in Portuguese, short and direct. Code, commits and docs stay in English.
- Understand the full flow before changing it; fix root causes, not symptoms; map the
  impact on every layer (backend, apps, panels, database, integrations).
- Small PRs (~500 changed lines). Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`.
- Never push directly to `main` or `staging`; always open a PR. Run the repo's lint and
  tests before opening it.
- No deploy, release, migration, or change to production data/config without Gustavo's
  explicit request, confirmed twice after explaining what will happen.
- Backend contract change ⇒ regenerate the walkyApp client (Orval, `bun api:generate`) and
  the walky-admin client (`yarn generate:api`), hand-edit walky-hq types in `src/types/`,
  and check the walky-native Core models.
- Never commit secrets or populated `.env` files.

## Keeping agent context in sync

`AGENTS.md` (this file) and `CLAUDE.md` must always describe the same rules, so Codex and
Claude work from the same context. `CLAUDE.md` only imports this file, so edit here.
Any PR that changes architecture, commands, conventions, environments, or workflows
updates this file in the same PR (and `AI_CONTEXT.md` in all four copies when the change
is cross-repo).
