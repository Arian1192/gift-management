## 1. Bridge Workspace Foundation

- [x] 1.1 Create an isolated `bridge/` Node workspace with package metadata, source/test folders, and scripts; verify `npm --prefix bridge test` can run in the bridge workspace.
- [x] 1.2 Add the bridge configuration module and safe example configuration guidance; verify committed examples contain placeholders only and local secret files are ignored.

## 2. Verification Behavior

- [x] 2.1 Implement the bridge health/check command that validates required configuration and reports readiness without network calls; verify the success path prints a clear ready result.
- [x] 2.2 Add tests for missing required configuration; verify failures name the missing configuration key and do not print secret values.
- [x] 2.3 Add tests or assertions proving the health/check command performs no VITO data synchronization or live VITO API calls.

## 3. Documentation and Repository Integration

- [x] 3.1 Update repository documentation with the bridge purpose, local configuration contract, and verification command; verify a maintainer can follow the documented command from a clean checkout.
- [x] 3.2 Confirm the slice does not add Supabase migrations, RLS policies, seed data, Edge Functions, or web runtime behavior changes; verify with `git diff --stat` and targeted inspection.

## 4. Final Verification

- [x] 4.1 Run `npm --prefix bridge test` and record the result.
- [x] 4.2 Run `npm --prefix web test` and `npm --prefix web run build` to confirm the existing app remains unaffected; record both results.
- [x] 4.3 Run `npx --yes openspec validate add-vito-bridge-foundation --strict` and `npx --yes openspec status --change add-vito-bridge-foundation`; record both results.
