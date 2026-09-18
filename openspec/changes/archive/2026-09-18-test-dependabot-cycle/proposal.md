## Why

Dependabot governance has been merged into `dev`, but the repository has not yet observed a Dependabot-generated pull request. This test change intentionally creates a safe, temporary dependency drift so the team can verify that Dependabot detects npm updates and opens PRs against `dev`.

## What Changes

- Temporarily pin one low-risk npm dependency in `web/package.json` to an older compatible version.
- Regenerate `web/package-lock.json` for that intentional downgrade.
- Merge the test branch into `dev` only, then wait for Dependabot to propose an update PR back to the current version.
- Track the observed Dependabot PR and use it as evidence that the dependency update cycle works.
- Revert or supersede the temporary drift through the Dependabot PR, not through manual production changes.

### Non-goals

- No changes to application behavior.
- No production promotion to `main` as part of this test.
- No weakening of tests or build checks.
- No auto-merge configuration.
- No broad dependency downgrade set; only one intentionally selected dependency.

## Capabilities

### New Capabilities

- `dependency-governance`: Observability of the Dependabot update cycle for npm dependencies.

### Modified Capabilities

- None.

## Impact

- Affected areas: `web/package.json`, `web/package-lock.json`, and tracking documentation/evidence.
- GitHub behavior: after merge to `dev`, Dependabot should detect the outdated dependency according to its configured schedule and open a PR targeting `dev`.
- Risk: temporary dependency drift exists on `dev` until Dependabot opens and the team reviews/merges the update PR.
