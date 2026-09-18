## Context

See `proposal.md` for motivation. The bridge currently provides:

- `check`: no-network configuration validation;
- `probe`: one explicit read-only connectivity request;
- redacted output and no persistence guarantees for probe behavior.

This change adds a separate discovery command for maintainers to gather safe resource-shape evidence before any import mapping or Supabase persistence is designed.

## Goals / Non-Goals

**Goals:**

- Add a separate `discover` command that accepts a configurable list of read-only VITO resource paths.
- Reuse the existing bridge configuration style, credential redaction, bounded timeout, and safe failure classification patterns.
- Summarize JSON shapes without printing raw values.
- Return per-resource results so one failed path does not hide successful resources.
- Keep the slice bridge-only and reviewable.

**Non-Goals:**

- No replacement of `check` or `probe`.
- No persisted discovery output, raw JSON fixtures, or sample data files.
- No Supabase changes: no migrations, policies, seeds, Edge Functions, jobs, queues, or webhooks.
- No web UI changes.
- No domain import/export or data mapping decisions.

## Decisions

### Decision: add a separate `discover` command

Keep discovery separate from `check` and `probe`.

- Rationale: `check` is no-network, `probe` validates one connectivity endpoint, and `discover` intentionally queries configured resource paths for shape evidence.
- Alternative considered: extend `probe` to support multiple paths; rejected because probe success/failure and resource-shape discovery are different maintainer questions.

### Decision: use configurable discovery paths

Add configuration such as `VITO_DISCOVERY_PATHS`, encoded as comma-separated entries. Each entry may optionally include a readable name using `name:path`.

- Rationale: VITO resources are not confirmed yet. Configurable paths let maintainers choose the least-sensitive read-only endpoints available.
- Alternative considered: hardcode expected gift/customer endpoints; rejected because it would encode mapping assumptions too early.

### Decision: summarize shapes, never raw values

For objects, report top-level keys and broad value types. For arrays, report item count and merged object-item keys/types. For unsupported content, report a safe unsupported-content status.

- Rationale: shape evidence is useful for design while values may contain private customer or business data.
- Alternative considered: write raw payloads to local files; rejected because it creates privacy and accidental-commit risk.

### Decision: classify each resource independently

Discovery should attempt every configured path and return a result per path unless global configuration is missing.

- Rationale: one unavailable resource should not block learning from others.
- Alternative considered: fail fast; rejected because it produces less useful discovery evidence.

## Risks / Trade-offs

- [Risk] Configured paths might hit sensitive resources. → Mitigation: document that maintainers must choose least-sensitive read-only paths and keep output summarized.
- [Risk] Shape inference may be incomplete for heterogeneous arrays. → Mitigation: merge object item keys/types at a shallow level and label mixed types clearly.
- [Risk] Discovery could be mistaken for import readiness. → Mitigation: docs and specs state this command produces evidence only and persists nothing.
- [Risk] Large responses could be expensive. → Mitigation: support existing timeout behavior and summarize without retaining payloads.

## Migration Plan

1. Add discovery configuration parsing and validation.
2. Add discovery request/result implementation with injected fetch behavior for tests.
3. Add tests for configuration parsing, object/array shape summaries, unsupported content, per-resource failures, redaction, and no persistence assumptions.
4. Add `npm --prefix bridge run discover`.
5. Update bridge and root documentation with safe usage.
6. Run bridge, web, and OpenSpec verification.

Rollback removes the discovery command, configuration keys, tests, and docs. No database rollback is needed because this design introduces no persistence.

## Open Questions

- Which exact VITO resource paths should be configured first? This is safely deferrable because discovery accepts configured paths and does not hardcode resource names.
