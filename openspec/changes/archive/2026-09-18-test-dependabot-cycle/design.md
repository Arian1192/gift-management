## Context

Dependabot is configured for npm dependencies in `web/`, targets `dev`, and runs weekly. To verify the cycle without waiting for natural dependency drift, this change intentionally creates one controlled outdated dependency on `dev`.

## Goals / Non-Goals

**Goals:**

- Prove that Dependabot opens PRs against `dev` for npm updates in `web/`.
- Keep the test small, visible, and reversible.
- Preserve normal build/test validation.
- Keep `main` untouched during the test.

**Non-Goals:**

- No production release.
- No long-term downgrade.
- No auto-merge.
- No broad dependency maintenance sweep.

## Decisions

### 1. Downgrade one low-risk direct dependency

Select one direct dependency from `web/package.json` that has a newer version available and is unlikely to alter app behavior for the short verification window.

- **Rationale:** Dependabot reacts to manifest/lockfile drift. A single direct dependency gives a clear signal.
- **Alternative considered:** Wait for natural drift. Rejected because it may take an unknown amount of time.
- **Alternative considered:** Downgrade many dependencies. Rejected because it increases risk and review noise.

### 2. Merge the test only to `dev`

The test branch should target `dev`; `main` must not receive the temporary downgrade.

- **Rationale:** `dev` is the integration branch where dependency PRs are expected to appear.
- **Alternative considered:** Merge directly to `main`. Rejected because `main` is production.

### 3. Use the Dependabot PR as the resolution path

If Dependabot opens a PR, review and merge that PR to restore the dependency through the same governance flow.

- **Rationale:** This verifies both detection and remediation flow.
- **Alternative considered:** Manually restore the dependency immediately. Rejected because it would prevent observing Dependabot.

## Risks / Trade-offs

- **Temporary outdated dependency on `dev`** → Do not promote `dev` to `main` until resolved.
- **Dependabot may not run immediately** → Keep issue open and record observation window.
- **Selected dependency may not produce a PR** → Choose a direct dependency with a known newer version and document evidence if no PR appears.
- **Tests may fail after downgrade** → Pick a low-risk dependency and run `npm --prefix web test` plus `npm --prefix web run build` before merging.

## Migration Plan

1. Create a feature branch from updated `dev`.
2. Downgrade one selected dependency in `web/package.json` and regenerate `web/package-lock.json`.
3. Run tests/build.
4. Open PR to `dev` with clear warning that it is a Dependabot cycle test.
5. Merge to `dev` only.
6. Observe Dependabot PR creation or record failure evidence.
7. Resolve drift through the Dependabot PR when possible.
