## Purpose

Dependency governance keeps third-party package changes visible and reviewable so the repository can update safely without relying on manual dependency checks.

## ADDED Requirements

### Requirement: Dependency updates are tracked through pull requests
The repository SHALL configure automated dependency tracking so supported package updates are surfaced as GitHub pull requests.

#### Scenario: npm dependency update is available
- **WHEN** a dependency update is available for the configured npm package ecosystem
- **THEN** GitHub Dependabot opens or updates a pull request describing the dependency change

### Requirement: Dependency update PRs target integration branch
Dependency update pull requests SHALL target the repository integration branch instead of production.

#### Scenario: Dependabot opens an npm update PR
- **WHEN** Dependabot creates an npm dependency update pull request
- **THEN** the pull request targets `dev`

### Requirement: Dependency update PRs are identifiable
Dependency update pull requests SHALL carry clear metadata so maintainers can distinguish them from product feature work.

#### Scenario: Dependabot PR is listed in GitHub
- **WHEN** a maintainer views repository pull requests
- **THEN** dependency update pull requests are identifiable by Dependabot authoring and dependency-specific labels

### Requirement: Dependency update cadence is bounded
The repository SHALL define a predictable update schedule to avoid surprise dependency churn.

#### Scenario: Scheduled dependency scan runs
- **WHEN** the configured update schedule occurs
- **THEN** Dependabot checks for supported dependency updates according to that schedule

### Requirement: Dependency governance avoids automatic production changes
The repository SHALL NOT automatically merge dependency changes into production as part of the first Dependabot setup.

#### Scenario: Dependabot opens an update PR
- **WHEN** Dependabot opens a dependency update pull request
- **THEN** the update requires normal review and merge before it can reach `dev` or `main`
