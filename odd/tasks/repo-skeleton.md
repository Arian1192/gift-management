# Repository Skeleton

## Scope
Create the first repository skeleton only.

## Tasks
- [x] Create top-level folders: `web/`, `bridge/`, and Supabase local project files under `supabase/`.
- [x] Initialize OpenSpec repository scaffolding for later `/opsx:propose` work.
- [x] Add root documentation and environment examples: `README.md`, `.env.example`, `.nvmrc`.
- [x] Verify `supabase start` and `supabase status` work locally, or record the blocker precisely.

## Out of Scope
- React application code.
- VITO bridge implementation.
- Database tables, migrations, policies, or seed data.
- Commits or delivery steps.

## Evidence
- `git status --short`: reported untracked skeleton files: `.env.example`, `.nvmrc`, `.pi/`, `README.md`, `bridge/`, `odd/`, `openspec/`, `supabase/`, `web/`.
- First `supabase start`: failed because Docker could not bind local database port `0.0.0.0:54322`; another local Supabase project (`parte-compras`) was using the default ports.
- User chose to stop the other local project. Ran `supabase stop --project-id parte-compras` successfully.
- Second `supabase start`: failed because `supabase_edge_runtime_gift-management` returned a local runtime boot error (`failed to create the graph: Operation not permitted`).
- Updated `supabase/config.toml` to disable Edge Runtime for the initial skeleton because no Edge Functions exist yet.
- Final `supabase start`: succeeded and printed local service URLs.
- Final `supabase status`: succeeded and returned local service status.

## Notes
- `web/` and `bridge/` contain only `.gitkeep` placeholders so Git can retain the empty skeleton directories; these are not React or bridge implementation code.
- OpenSpec was initialized with Pi tooling as requested. The initializer also created `.pi/` tool integration files in addition to `openspec/`.
- Supabase CLI warns that `supabase/seed.sql` is absent; this skeleton intentionally adds no seed data or tables.
