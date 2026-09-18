## Why

The bridge can now validate configuration and prove connectivity, but maintainers still do not know which VITO resources are available or what basic response shapes they expose. A read-only discovery command is needed before designing import mappings, Supabase persistence, or synchronization behavior.

## What Changes

- Add a VITO data discovery command under `bridge/` that reads a configured list of read-only VITO paths.
- Fetch each configured path with the existing local credential model and bounded timeout behavior.
- Print a review-safe summary for each resource: configured name/path, status, top-level field names, basic inferred field types, and array item counts where applicable.
- Redact secrets and avoid dumping raw VITO response payloads or private sample values.
- Document safe local usage and configuration placeholders.
- Preserve existing `check` and `probe` commands.

### Assumptions

- VITO resource paths are not confirmed yet, so discovery paths must be configurable.
- Discovery is a maintainer/dev operation, not a user-facing web feature.
- Discovery output is evidence for later mapping design, not the mapping itself.

### Non-goals

- No gift, customer, order, inventory, or user data import.
- No data export to VITO.
- No Supabase schema, migration, RLS policy, seed data, or Edge Function changes.
- No web UI changes or route changes.
- No production scheduler, queue, webhook, or background job.
- No persistence of raw VITO payloads, response samples, or discovered data.
- No real credentials, tokens, private endpoints, or VITO response payloads committed to the repository.

### User-visible outcome and acceptance criteria

- Maintainers can configure one or more read-only VITO paths and run a documented discovery command.
- The command reports a safe shape summary for each configured path without printing raw values or secrets.
- Failures are classified per resource so one bad path does not hide the rest of the discovery result.
- The command does not synchronize domain data or mutate Gift Management or VITO state.

## Capabilities

### New Capabilities

- `vito-data-discovery`: Defines the maintainer-facing contract for safe, read-only VITO resource shape discovery before import or persistence exists.

### Modified Capabilities

- None.

## Impact

- Affected code area: `bridge/`.
- Affected documentation/configuration: `bridge/README.md`, `bridge/env.example`, and root `README.md` if needed.
- Affected systems: configured VITO endpoints are contacted only when a maintainer intentionally runs discovery with local credentials.
- Dependencies: use built-in Node APIs first; add bridge-local dependencies only if required and justified.
- Security: credentials remain outside git; output must redact tokens and summarize shapes without dumping raw payloads.
