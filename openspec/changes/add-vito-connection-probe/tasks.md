## 1. Configuration and Command Surface

- [ ] 1.1 Extend bridge configuration with probe path and timeout settings; verify config tests cover missing `VITO_PROBE_PATH` and safe default/override behavior for timeout.
- [ ] 1.2 Add a dedicated `probe` npm script while preserving the existing no-network `check` script; verify `npm --prefix bridge run check` still performs no network call.

## 2. Probe Implementation

- [ ] 2.1 Implement request construction for the configured VITO probe path with credential redaction; verify tests prove tokens and authorization values are not printed.
- [ ] 2.2 Implement successful read-only probe handling; verify a mocked success response reports connectivity without dumping the response payload.
- [ ] 2.3 Implement missing-config, authentication, network, timeout, and unexpected-response classifications; verify unit tests cover each failure class with safe output.
- [ ] 2.4 Ensure the probe does not import, export, persist, or mutate domain data; verify by tests/inspection that no Supabase files, jobs, queues, webhooks, or data writes are introduced.

## 3. Documentation

- [ ] 3.1 Update `bridge/env.example` and bridge documentation with probe configuration placeholders and safe local usage; verify examples contain no real credentials or private endpoints.
- [ ] 3.2 Update root documentation only if needed to mention the new probe command; verify documentation distinguishes no-network `check` from live `probe`.

## 4. Final Verification

- [ ] 4.1 Run `npm --prefix bridge test`, `npm --prefix bridge run check`, and the documented probe test path with mocked/local-safe evidence; record results.
- [ ] 4.2 Run `npm --prefix web test` and `npm --prefix web run build` to confirm existing app behavior remains unaffected; record results.
- [ ] 4.3 Run `npx --yes openspec validate add-vito-connection-probe --strict` and `npx --yes openspec status --change add-vito-connection-probe`; record results.
