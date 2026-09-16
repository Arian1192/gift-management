## Why

The repository now has a React/Vite web app with npm dependencies, so dependency updates need to be visible, reviewable, and handled before they become security or maintenance debt. Dependabot can track dependency changes by opening pull requests; it does not normally create regular GitHub issues for each update.

## What Changes

- Add repository dependency-update governance using GitHub Dependabot.
- Configure Dependabot for the npm ecosystem used by `web/package.json` and `web/package-lock.json`.
- Group routine dependency updates where useful so review noise stays manageable.
- Label Dependabot PRs clearly so they are easy to find and review.
- Document the expected workflow for dependency-update PRs.
- Keep actual package upgrades out of this first setup slice.

### Non-goals

- No dependency upgrades in this change.
- No auto-merge configuration.
- No production deployment changes.
- No change to GitHub branch protection rules.
- No issue-per-dependency workflow unless a future policy explicitly requires it.

## Capabilities

### New Capabilities

- `dependency-governance`: Repository behavior for tracking dependency updates through Dependabot PRs.

### Modified Capabilities

- None.

## Impact

- Affected areas: `.github/dependabot.yml`, repository documentation, and optionally governance metadata such as labels.
- GitHub behavior: Dependabot will create PRs for configured dependency update opportunities.
- Review behavior: dependency changes become visible as PRs against the configured integration branch.
- Configuration: first slice should target `dev` as the integration branch, matching the repository workflow.
