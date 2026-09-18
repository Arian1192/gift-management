## Why

The VITO bridge foundation can validate local configuration, but maintainers still cannot prove that real VITO endpoint and credential settings can reach VITO safely. A small read-only connection probe is needed before planning any import/export behavior so later data work is grounded in real integration evidence.

## What Changes

- Add a VITO connection probe behavior under the bridge that performs one configured, read-only connectivity check against VITO.
- Extend bridge configuration planning to include a configurable probe path, timeout, and safe credential usage.
- Report clear success and failure outcomes for missing configuration, invalid credentials, unreachable endpoints, non-success responses, and timeouts.
- Document how maintainers run the probe locally with real credentials kept outside version control.
- Preserve the existing foundation health/check behavior as a no-network local validation command.

### Assumptions

- The exact VITO status endpoint is not confirmed yet, so the probe path will be configurable instead of hardcoded.
- The first implementation can use bearer-token style authentication unless VITO documentation or credentials show a different required scheme during apply.
- The probe is a maintainer/dev operation, not a user-facing web feature.

### Non-goals

- No gift, customer, order, inventory, or user data import.
- No data export to VITO.
- No persistence of VITO responses beyond console/log output needed for the command result.
- No Supabase schema, migration, RLS policy, seed data, or Edge Function changes.
- No web UI changes or route changes.
- No production scheduler, queue, webhook, or background job.
- No real credentials, tokens, private endpoints, or VITO response payloads committed to the repository.

### User-visible outcome and acceptance criteria

- Maintainers can run a documented bridge command to check real VITO connectivity from local configuration.
- The command clearly reports whether the configured VITO endpoint is reachable and authenticated.
- Failure output is actionable and safe to share: it names the failure class without printing secret values.
- The command does not synchronize domain data or mutate Gift Management or VITO state.

## Capabilities

### New Capabilities

- `vito-connection-probe`: Defines the maintainer-facing contract for a safe, read-only VITO connectivity check before data synchronization exists.

### Modified Capabilities

- None.

## Impact

- Affected code area: `bridge/`.
- Affected documentation/configuration: `bridge/README.md`, `bridge/env.example`, and possibly root `README.md` for the new probe command.
- Affected systems: real VITO endpoint is contacted only when a maintainer runs the probe with local credentials.
- Dependencies: may use built-in Node APIs first; add bridge-local dependencies only if required and justified.
- Security: credentials remain outside git; command output must redact tokens and avoid dumping raw VITO payloads.
