## Purpose

This delta verifies that repository dependency governance can be observed end-to-end by causing Dependabot to propose an npm update through the normal `dev` integration flow.

## ADDED Requirements

### Requirement: Maintainers can verify Dependabot update PR creation
The repository SHALL support a controlled test that makes an npm dependency update visible to Dependabot without changing production.

#### Scenario: Controlled dependency drift is merged to dev
- **WHEN** a maintainer merges a branch containing one intentional npm dependency downgrade into `dev`
- **THEN** the repository records which dependency was downgraded and why the downgrade is temporary

#### Scenario: Dependabot detects the outdated dependency
- **WHEN** Dependabot runs after the controlled drift exists on `dev`
- **THEN** Dependabot opens or updates a pull request targeting `dev` for the outdated dependency, or the team records evidence explaining why no PR was opened

### Requirement: Dependabot cycle test stays out of production
The repository SHALL keep the controlled dependency drift out of `main` until the test outcome is understood.

#### Scenario: Test drift exists on dev
- **WHEN** the temporary downgraded dependency is present on `dev`
- **THEN** maintainers do not promote `dev` to `main` because of this test until the drift is resolved or explicitly accepted

### Requirement: Test drift remains narrow and reversible
The repository SHALL limit the Dependabot cycle test to one selected dependency and preserve normal verification checks.

#### Scenario: Test branch is prepared
- **WHEN** the test branch is ready for review
- **THEN** it changes only the selected dependency manifest/lockfile and test evidence needed for the cycle check
