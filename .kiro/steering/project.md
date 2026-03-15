# Project Overview

daed is a web dashboard for the dae proxy service. This is a pnpm monorepo managed by Turborepo.

## Monorepo Structure

- `apps/web` — Main React SPA (Vite + React 19)
- `packages/dae-editor` — Monaco editor integration with RoutingA language support
- `packages/dae-lsp` — Language Server Protocol implementation
- `packages/dae-node-parser` — Proxy node URL parser library
- `packages/dae-vscode` — VS Code extension

## Tech Stack

| Layer           | Technology                                    |
| --------------- | --------------------------------------------- |
| Framework       | React 19 + React Router 7                     |
| Build           | Vite 7, tsdown (packages)                     |
| State           | nanostores + @nanostores/persistent           |
| Data Fetching   | TanStack React Query + graphql-request        |
| UI Components   | Radix UI (shadcn/ui pattern) + Tailwind CSS 4 |
| Forms           | React Hook Form + Zod validation              |
| i18n            | i18next (en, zh-Hans)                         |
| Editor          | Monaco Editor + Shiki                         |
| Charts          | Recharts                                      |
| DnD             | @hello-pangea/dnd                             |
| Animation       | Framer Motion                                 |
| Type Generation | @graphql-codegen/client-preset                |
| Testing         | Vitest                                        |
| Package Manager | pnpm 10 with catalog mode                     |

## Key Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server (Turbo)
pnpm build            # Production build
pnpm lint             # ESLint + auto-fix
pnpm check-types      # TypeScript type checking
pnpm codegen          # GraphQL code generation (requires SCHEMA_PATH env)
pnpm test             # Run tests via Vitest
```

## Path Aliases

In `apps/web`, `~` maps to `src/` (configured in vite.config.ts).

## GraphQL

- Schema types are auto-generated in `apps/web/src/schemas/gql/`
- Use `graphql()` template tag from `~/schemas/gql` for typed queries
- Do NOT manually edit files under `src/schemas/` — they are generated
