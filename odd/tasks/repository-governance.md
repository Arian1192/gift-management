# Repository Governance Bootstrap

## Scope
Install/use the GitHub Repository Bootstrap package and configure repository governance for `Arian1192/gift-management` safely.

## Tasks
- [x] Install or make available the `github-repository-bootstrap` Pi package from the reviewed repository.
- [x] Discover current GitHub repository governance state and local repository binding.
- [x] Create a reviewed governance manifest for labels, issue forms, and pull request template.
- [x] Run a read-only bootstrap plan and capture the exact authorization value.
- [x] Apply only the exact authorized plan after explicit approval.
- [x] Verify resulting local files and GitHub governance state.

## Safety
- Do not delete GitHub resources.
- Do not overwrite existing unmanaged labels/milestones/files.
- Do not apply without exact authorization from the plan.
- Do not commit or push governance files unless separately authorized.

## Evidence
- Installed `git:github.com/egdev6/github-repository-bootstrap@v1.1.0` after `Arian1192/github-repository-bootstrap@v1.1.0` was unavailable because the fork has no tag.
- Discovery found `Arian1192/gift-management`, public, default branch `main`, issues/projects enabled, 10 existing default labels, no milestones, and no existing `.github/` templates.
- Created `governance.json` with managed labels `kind:bug` and `kind:feature`, fixed bug/feature issue forms, and pull request template in `ensure` mode.
- Plan authorization value: `APPLY_GITHUB_PROJECT_BOOTSTRAP:80c0aaa7529356be43ac931b64b40105d1e1d3bf96ce20cf21ef62d779fcec0a`.
- User explicitly authorized applying that exact value.
- Apply completed successfully: created two GitHub labels and four local template files under `.github/`.
- Verification confirmed labels `kind:bug` (`D73A4A`) and `kind:feature` (`1D76DB`) exist on GitHub.
- Verification confirmed local files: `.github/ISSUE_TEMPLATE/config.yml`, `.github/ISSUE_TEMPLATE/bug_report.yml`, `.github/ISSUE_TEMPLATE/feature_request.yml`, `.github/pull_request_template.md`.
