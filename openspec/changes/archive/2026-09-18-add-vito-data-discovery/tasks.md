## 1. Configuration and Command Surface

- [x] 1.1 Add discovery path configuration parsing for comma-separated `name:path` entries; verify tests cover missing paths, unnamed paths, and multiple configured resources.
- [x] 1.2 Add a dedicated `discover` npm script while preserving existing `check` and `probe` behavior; verify all three scripts remain distinct.

## 2. Discovery Implementation

- [x] 2.1 Implement per-resource discovery requests using existing credential and timeout patterns; verify tests cover configured URL construction and authorization redaction.
- [x] 2.2 Implement JSON object and array shape summarization without values; verify tests cover top-level object fields, array item count, merged item object fields, and mixed value types.
- [x] 2.3 Implement unsupported content and per-resource failure classification; verify tests cover non-JSON, auth failure, network failure, timeout, and unexpected HTTP status without raw body dumps.
- [x] 2.4 Ensure discovery does not import, export, persist, or mutate domain data; verify by tests/inspection that no Supabase files, jobs, queues, webhooks, or data writes are introduced.

## 3. Documentation

- [x] 3.1 Update `bridge/env.example` and bridge documentation with discovery path placeholders and safe local usage; verify examples contain no real credentials or private endpoints.
- [x] 3.2 Update root documentation to mention the discovery command and distinguish `check`, `probe`, and `discover`; verify docs state discovery output is shape-only and non-persistent.

## 4. Final Verification

- [x] 4.1 Run `npm --prefix bridge test`, `npm --prefix bridge run check`, and local-safe `probe`/`discover` command paths; record results.
- [x] 4.2 Run `npm --prefix web test` and `npm --prefix web run build` to confirm existing app behavior remains unaffected; record results.
- [x] 4.3 Run `npx --yes openspec validate add-vito-data-discovery --strict` and `npx --yes openspec status --change add-vito-data-discovery`; record results.
