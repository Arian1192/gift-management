## Context

See `proposal.md` for motivation. The observed repository state is:

- `bridge/` exists only as a reserved directory with `.gitkeep`.
- `web/` is an existing React/Vite app with its own npm package and tests.
- `supabase/` contains local Supabase CLI configuration; Edge Runtime is disabled and no bridge-related database objects exist.
- Project runtime is Node.js 22.22.3 via `.nvmrc`.

This design keeps the first bridge slice isolated from the web app and database so future VITO work has a clear boundary before data synchronization is introduced.

## Goals / Non-Goals

**Goals:**

- Establish `bridge/` as a small, independently verifiable Node-based workspace.
- Provide a maintainer-facing verification command that validates required configuration names and returns a clear success/failure result.
- Document bridge configuration without committing real VITO credentials or private VITO data.
- Keep the implementation small enough for a single reviewable foundation slice.

**Non-Goals:**

- No live VITO client, network calls, webhook handling, queues, or scheduled jobs.
- No Supabase migrations, RLS policies, Edge Functions, seed data, or domain tables.
- No changes to `web/` runtime behavior or authenticated navigation.
- No production deployment or secret-management integration beyond naming local environment variables.

## Decisions

### Decision: make `bridge/` an isolated Node workspace

Use a bridge-local `package.json` and source/test files under `bridge/` instead of adding bridge scripts to the web package.

- Rationale: the bridge is a standalone integration boundary and should not couple its tooling, dependencies, or verification command to the React app.
- Alternative considered: add scripts to `web/package.json`; rejected because it hides bridge behavior inside frontend tooling and makes later server/integration dependencies harder to isolate.
- Alternative considered: Supabase Edge Function first; rejected because this slice does not require runtime deployment, and Edge Runtime is currently disabled because no functions exist yet.

### Decision: start with configuration validation and a health/check command

Implement the first observable behavior as a command that loads bridge configuration, validates required names, and reports readiness without network access.

- Rationale: this satisfies the maintainer contract while avoiding speculative VITO API design before real endpoint details are known.
- Alternative considered: implement a mocked VITO client; rejected because a fake client would imply API shape decisions that are not needed for the foundation.

### Decision: commit only safe examples and ignore local secret files

Document environment variable names and provide safe placeholders if an example file is useful. Any real local environment file must be ignored.

- Rationale: VITO credentials and endpoint details are integration secrets. The repository should make required names discoverable without storing values.
- Alternative considered: put placeholder values directly in source constants; rejected because it blurs configuration from runtime behavior and makes future secret handling less clear.

### Decision: keep data ownership unchanged

The foundation does not own gift-management domain data. It only creates the place where future VITO bridge behavior will live.

- Rationale: no domain tables or VITO mappings exist yet, so data ownership decisions should be made in the first data-specific change.
- Alternative considered: create placeholder Supabase tables now; rejected because it would expand the slice beyond foundation work and add unvalidated data-model assumptions.

## Risks / Trade-offs

- [Risk] The foundation may feel too small because it does not integrate with VITO yet. → Mitigation: the spec explicitly positions this as the safety boundary before import/export slices.
- [Risk] Required VITO configuration names may change once real API details are known. → Mitigation: keep configuration validation centralized and documented so later changes are narrow.
- [Risk] Adding bridge-local tooling can duplicate some repository tooling. → Mitigation: keep the initial package minimal and avoid dependencies unless implementation requires them.
- [Risk] Secrets can be accidentally committed during local testing. → Mitigation: add/verify ignore rules for bridge-local environment files and document placeholder-only examples.

## Migration Plan

1. Add the bridge-local package/source/test structure under `bridge/`.
2. Add safe configuration documentation and ignore rules for local secret files.
3. Add a bridge verification command and tests for success and missing-configuration paths.
4. Update repository documentation with the bridge verification command.
5. Verify with the bridge tests, repository web checks if unaffected, and OpenSpec validation.

Rollback is straightforward: remove the new bridge-local files and any documentation/ignore-rule additions from the branch. No database rollback is needed because this design introduces no Supabase schema or data changes.

## Open Questions

- Which real VITO API authentication method and endpoint set will be used? This can be deferred because the foundation only validates local configuration names and avoids live VITO calls.
