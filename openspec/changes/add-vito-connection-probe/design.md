## Context

See `proposal.md` for motivation. The current bridge foundation under `bridge/` provides:

- a dependency-free Node workspace;
- configuration validation for `VITO_BASE_URL` and `VITO_API_TOKEN`;
- `npm --prefix bridge run check`, which intentionally performs no network calls;
- tests proving the foundation check does not call VITO or synchronize data.

The next slice should preserve that no-network foundation check and add a separate explicit probe command for maintainers who intentionally provide real local VITO credentials.

## Goals / Non-Goals

**Goals:**

- Add a separate bridge command for real, read-only VITO connectivity evidence.
- Keep probe configuration explicit and local-only, including probe path and timeout.
- Classify common failure modes safely: missing config, authentication failure, unreachable endpoint, timeout, and unexpected non-success response.
- Keep all probe output safe to share in issues/PRs by redacting secrets and avoiding raw response payload dumps.
- Keep the change reviewable as a bridge-only slice.

**Non-Goals:**

- No replacement of the existing no-network foundation check.
- No VITO domain data import/export or response persistence.
- No changes under `web/` except documentation if absolutely necessary.
- No changes under `supabase/`: no migrations, RLS policies, seeds, Edge Functions, queues, schedules, or webhooks.
- No production deployment or managed secret integration.

## Decisions

### Decision: add a separate `probe` command instead of changing `check`

Keep `npm --prefix bridge run check` as the local no-network foundation validation and add a new command such as `npm --prefix bridge run probe` for intentional live connectivity.

- Rationale: maintainers need both behaviors. A safe local check should remain runnable without real credentials or network access, while the live probe should be explicit.
- Alternative considered: make `check` call VITO when credentials exist; rejected because it makes a previously safe command depend on network and real secrets.

### Decision: make the probe path configurable

Add a configuration key such as `VITO_PROBE_PATH` rather than hardcoding a VITO resource endpoint.

- Rationale: the exact VITO health/status endpoint is not confirmed. A configurable path allows the first implementation to use the least sensitive endpoint available.
- Alternative considered: hardcode `/health` or `/status`; rejected because guessing the endpoint could create false failures or accidentally target a domain-data route.

### Decision: use bounded network behavior with timeout

The probe should set a default timeout and allow local override, for example through `VITO_PROBE_TIMEOUT_MS`.

- Rationale: connection probes should fail quickly and predictably during local verification and CI-like scripts.
- Alternative considered: rely on platform default fetch timeout; rejected because defaults can hang too long and make failures harder to diagnose.

### Decision: classify output, do not dump payloads

Map network and HTTP outcomes to controlled result categories. Do not print tokens, authorization headers, raw stack traces, or raw VITO response bodies.

- Rationale: probe output may be copied into issues or PRs; it must be useful without leaking secrets or private VITO data.
- Alternative considered: print full response for debugging; rejected because the response may contain private data or implementation details.

### Decision: keep data ownership unchanged

The probe produces connectivity evidence only. It does not own, store, or transform Gift Management domain data or VITO domain data.

- Rationale: import/export mapping and persistence need their own OpenSpec change after connectivity is proven.
- Alternative considered: store the last probe result in Supabase; rejected because it adds schema and data-retention decisions not needed for connectivity validation.

## Risks / Trade-offs

- [Risk] VITO may not provide a dedicated status endpoint. → Mitigation: make the probe path configurable and document that maintainers should choose the least sensitive read-only endpoint.
- [Risk] Bearer-token authentication may not match VITO's final auth scheme. → Mitigation: centralize request construction so the auth scheme can change later without affecting the command contract.
- [Risk] A probe could accidentally hit a sensitive endpoint. → Mitigation: require explicit `VITO_PROBE_PATH`, document non-goals, and test that no response payload is persisted or dumped.
- [Risk] Network tests can be flaky. → Mitigation: unit-test request/result classification with injected fetch behavior; keep live probe execution as a manual/local verification command.

## Migration Plan

1. Extend bridge configuration documentation and safe examples with probe path and timeout placeholders.
2. Add probe request/result classification using injectable network behavior for tests.
3. Add the explicit bridge probe command and npm script.
4. Add unit tests for success, missing config, auth failure, timeout, unreachable endpoint, and non-success response handling.
5. Update documentation with safe local usage and evidence guidance.
6. Verify bridge tests, existing web checks, and OpenSpec validation.

Rollback is straightforward: remove the probe command, probe configuration keys, related tests, and documentation. No database rollback is needed because this design introduces no persistence or Supabase changes.

## Open Questions

- Which exact VITO endpoint should be used for the first real probe? This is safely deferrable because the implementation will support a configured probe path and should document how to choose the least sensitive read-only endpoint.
- Does VITO require bearer-token authentication or another scheme? This is safely deferrable if the first implementation keeps request construction isolated and updates documentation when real credentials reveal the required scheme.
