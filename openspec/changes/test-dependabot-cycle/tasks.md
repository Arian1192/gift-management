## 1. Select Test Dependency

- [x] 1.1 Inspect `web/package.json` and select one low-risk direct dependency with a newer version available, then record the selected package and target downgrade version.
- [x] 1.2 Confirm the dependency is not security-critical for the short test window and verify no broad dependency set is selected.

## 2. Create Controlled Drift

- [x] 2.1 Change only the selected dependency version in `web/package.json` and verify no unrelated manifest edits are present.
- [x] 2.2 Regenerate `web/package-lock.json` and verify the lockfile reflects only the selected dependency change and transitive changes required by npm.
- [x] 2.3 Add or update apply evidence explaining this is temporary drift for Dependabot cycle verification.

## 3. Verify Before PR

- [x] 3.1 Run `npm --prefix web test` and verify tests pass.
- [x] 3.2 Run `npm --prefix web run build` and verify the production build passes.
- [x] 3.3 Run `npx --yes openspec validate test-dependabot-cycle --strict` and verify OpenSpec passes.
- [x] 3.4 Confirm no production branch changes, no auto-merge changes, and no dependency other than the selected test target was intentionally downgraded.

## 4. Observe Dependabot

- [ ] 4.1 After merge to `dev`, observe whether Dependabot opens a PR targeting `dev` for the selected dependency.
- [ ] 4.2 Record the Dependabot PR link or record evidence explaining why no PR appeared during the observation window.

## Review Workload Forecast

- Estimated changed lines: 20-120 depending on lockfile impact.
- 250-line budget risk: Low to Medium.
- Chained PRs recommended: No.
- Decision needed before apply: Yes; maintainer must approve the specific dependency selected for intentional downgrade before merge to `dev`.
