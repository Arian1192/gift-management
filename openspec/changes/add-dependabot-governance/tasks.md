## 1. Dependabot Configuration

- [x] 1.1 Add `.github/dependabot.yml` for the npm ecosystem in `web/` and verify it targets `dev`.
- [x] 1.2 Configure a weekly schedule and conservative open PR limit, then verify the YAML is valid.
- [x] 1.3 Add clear Dependabot PR labels using existing labels where possible and verify missing labels are documented or created through governance.

## 2. Documentation

- [x] 2.1 Document the dependency-update workflow in the README or repository governance notes and verify it states that Dependabot tracks updates through PRs, not regular issues.
- [x] 2.2 Document that Dependabot PRs target `dev` first and production promotion remains `dev` to `main`.

## 3. Verification

- [x] 3.1 Verify the repository still has no dependency upgrade changes in this setup slice.
- [x] 3.2 Run OpenSpec validation and record the result.
- [x] 3.3 Confirm the implementation stays limited to Dependabot governance: no auto-merge, no branch protection changes, and no package upgrades.

## Review Workload Forecast

- Estimated changed lines: 40-120.
- 250-line budget risk: Low.
- Chained PRs recommended: No.
- Decision needed before apply: No.
