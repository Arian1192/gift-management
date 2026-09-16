## Context

The repository uses `main` as production, `dev` as integration, and feature branches for work. The web app now has npm dependencies under `web/`. There is no existing Dependabot configuration.

## Goals / Non-Goals

**Goals:**

- Configure Dependabot for the npm ecosystem in `web/`.
- Make dependency updates visible as PRs into `dev`.
- Keep dependency update PRs easy to identify and review.
- Document the dependency-update workflow.

**Non-Goals:**

- No auto-merge.
- No dependency upgrade performed by this setup change.
- No GitHub Actions dependency-review workflow in the first slice unless needed later.
- No branch protection changes.

## Decisions

### 1. Use GitHub Dependabot PRs as the tracking mechanism

Dependabot should track changes by opening pull requests instead of creating regular issues.

- **Rationale:** Dependabot's native workflow is PR-based; each PR contains the dependency diff and release metadata GitHub can provide.
- **Alternative considered:** Create issues manually for dependency updates. Rejected because it duplicates the PR tracking surface and adds manual overhead.

### 2. Target `dev` for dependency update PRs

Dependabot should open PRs against `dev`.

- **Rationale:** The project workflow treats `dev` as integration and `main` as production.
- **Alternative considered:** Target `main`. Rejected because dependency changes should be tested in integration before production promotion.

### 3. Start with npm updates under `/web`

Configure the `npm` package ecosystem with `directory: "/web"`.

- **Rationale:** The only current dependency manifest is `web/package.json`.
- **Alternative considered:** Configure root npm updates. Rejected because there is no root package manifest.

### 4. Use a weekly schedule and conservative PR limit

Run weekly and limit open Dependabot PRs.

- **Rationale:** This keeps maintenance visible without overwhelming the repo.
- **Alternative considered:** Daily updates. Rejected for the first slice because the project is still early and does not need daily dependency churn.

## Risks / Trade-offs

- **Dependabot may open a large lockfile PR** → Review it like any other PR and require build/tests before merge.
- **Security updates may need faster response** → GitHub security alerts can still surface urgent updates; a later slice can add stricter security policy.
- **Grouped updates can hide individual risk** → Keep groups conservative or defer grouping if maintainers prefer one dependency per PR.
- **Labels may not exist yet** → Either create missing labels separately through governance or use existing labels only.

## Migration Plan

1. Add `.github/dependabot.yml` targeting npm dependencies in `/web` and branch `dev`.
2. Document the expected review flow for Dependabot PRs.
3. Verify configuration syntax and repository state.
4. Observe the first Dependabot PR before adding auto-merge, dependency-review actions, or security-specific policies.
