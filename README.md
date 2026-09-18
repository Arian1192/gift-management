# Gift Management

Gift Management is starting with a small Supabase-backed authentication foundation.

## Prerequisites

- Node.js 22.22.3 (`nvm use` reads `.nvmrc`)
- Supabase CLI
- Docker running locally for Supabase services

## Local setup

```sh
nvm use
cp .env.example .env
supabase start
supabase status
```

## Web auth setup

The React app lives in `web/` and uses Supabase Auth with public browser environment variables:

```sh
npm --prefix web install
cp .env.example web/.env.local
# Fill VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY with local Supabase values.
npm --prefix web run dev
```

Required variables:

- `VITE_SUPABASE_URL`: local or hosted Supabase project URL.
- `VITE_SUPABASE_ANON_KEY`: Supabase anon public key. Do not use a service-role key in the browser.

## VITO bridge setup

The VITO bridge foundation lives in `bridge/`. The local `check` command validates bridge configuration without calling VITO or synchronizing data.

```sh
npm --prefix bridge test
npm --prefix bridge run check
```

Bridge configuration uses environment variables. `bridge/env.example` contains safe placeholders only; copy it to `bridge/.env` for local development and keep real VITO credentials out of git.

Required variables:

- `VITO_BASE_URL`: future VITO API base URL.
- `VITO_API_TOKEN`: future VITO API credential; secret, never commit a real value.
- `VITO_PROBE_PATH`: least-sensitive read-only VITO status/health path for the live probe.
- `VITO_PROBE_TIMEOUT_MS`: optional probe timeout in milliseconds; defaults to `5000`.

To intentionally verify live read-only VITO connectivity with local credentials:

```sh
set -a
. bridge/.env
set +a
npm --prefix bridge run probe
```

To intentionally discover safe VITO resource shapes from configured read-only paths:

```sh
set -a
. bridge/.env
set +a
npm --prefix bridge run discover
```

The live probe and discovery commands redact credentials, do not print raw VITO response payloads, and do not import, export, persist, or synchronize domain data.

## Dependency update workflow

Dependabot tracks supported dependency updates by opening pull requests, not by creating regular GitHub issues for each update.
For npm dependencies under `web/`, Dependabot opens scheduled weekly pull requests against `dev` with a conservative open PR limit.
These PRs should use dependency-focused labels such as `dependencies` and `npm`; if either label is missing in GitHub, add or approve it through normal repository governance instead of changing labels ad hoc during dependency updates.

Dependency PRs must be reviewed and merged into `dev` first. Production promotion remains the normal `dev` to `main` flow; this repository does not auto-merge Dependabot changes or send them directly to production.

## Current scope

Included in this slice:

- Minimal React app in `web/`.
- Tailwind CSS and minimal shadcn/ui-compatible component setup.
- Supabase email/password sign-up, sign-in, session restoration, and sign-out.
- Safe user-facing auth errors.

Out of scope for this slice:

- Gift-management domain tables, migrations, RLS policies, and seed data.
- VITO bridge implementation.
- OAuth, magic links, password reset, custom email templates, and user profiles.
