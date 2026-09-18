## Why

The `bridge/` area is reserved for a future VITO integration, but it currently has no executable boundary, configuration contract, or verification path. A small foundation slice is needed now so later VITO data import/export work can be added behind a clear bridge boundary without mixing infrastructure setup with domain synchronization behavior.

## What Changes

- Introduce a VITO bridge foundation under `bridge/` with a minimal executable or library boundary that can be verified locally.
- Define safe configuration expectations for the bridge, including local examples/placeholders and explicit secret-handling rules.
- Add a health/check behavior so maintainers can confirm the bridge foundation starts or validates configuration without contacting a real VITO system.
- Document how the bridge will be run and verified during development.
- Keep the slice intentionally narrow: no gift data import, export, persistence, or live VITO API calls.

### Non-goals

- No synchronization of gift, customer, order, inventory, or user data.
- No Supabase schema changes, migrations, RLS policies, seed data, or Edge Functions.
- No production deployment pipeline for the bridge.
- No real VITO credentials, tokens, fixtures containing private data, or calls to a live VITO endpoint.
- No changes to the existing web authentication or navigation behavior.

### User-visible outcome and acceptance criteria

- Maintainers can inspect `bridge/` and see the intended VITO bridge entry point, configuration contract, and verification command.
- Running the bridge foundation verification confirms the bridge can load its safe local configuration or reports a clear configuration error.
- The implementation remains reviewable as a foundation slice and does not introduce data synchronization behavior.

## Capabilities

### New Capabilities

- `vito-bridge-foundation`: Defines the externally observable maintainer behavior for configuring and verifying the VITO bridge foundation before domain synchronization exists.

### Modified Capabilities

- None.

## Impact

- Affected code area: `bridge/`.
- Affected documentation/configuration: repository setup docs may reference the bridge verification command and safe local environment variables.
- Affected systems: future VITO integration boundary only; no live VITO API dependency in this slice.
- Dependencies: may add bridge-local tooling only if required by the chosen implementation approach, keeping dependency changes isolated from `web/`.
- Security: secrets must remain out of the repository; any VITO credential values must be represented only by documented environment variable names or ignored local files.
