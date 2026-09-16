# Gift Management

Initial repository skeleton for the Gift Management project.

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

## Current scope

This repository currently contains only the first skeleton:

- `web/` is reserved for a future React app and intentionally contains no app code.
- `bridge/` is reserved for a future VITO bridge and intentionally contains no bridge code.
- `supabase/` contains local Supabase CLI project configuration only.
- Supabase Edge Runtime is disabled in this skeleton because no Edge Functions exist yet.
- OpenSpec is initialized so future changes can start with `/opsx:propose`.

No React implementation, bridge implementation, database schema, migrations, policies, or seed data are included yet.
