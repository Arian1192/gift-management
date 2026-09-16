# Agent guide

This file is the map for agents working on **Gift Management**.

Read it after locating the repository. It explains the project structure, workflow, communication style, safety rules, and verification commands. It does not replace the canonical skill rules installed under `.pi/`.

## Start here

1. Read `README.md` for project purpose, local setup, and current scope.
2. Read `.github/pull_request_template.md` before opening or reviewing PRs.
3. Read `openspec/config.yaml` for SDD/OpenSpec conventions and review budget.
4. Read `odd/tasks/` for active ODD work if any.
5. Check `mem_context` and `mem_search` for recent project memory before starting substantial work.

## Communication style

This project uses the `i-have-adhd` skill for user-facing responses.

When the skill is active:

- Lead with the next action.
- Number multi-step tasks.
- End with one concrete next step.
- Restate state every turn.
- Suppress tangents.
- Give specific time estimates.
- Make wins visible.
- Use matter-of-fact tone for errors.
- Cap lists to 5 items.
- No preamble, no recap, no closing pleasantries.

Technical artifacts (code, specs, docs, commits) remain in English unless the user explicitly requests another language.

## Workflow

### Default workflow: ODD + OpenSpec

1. **Authorize** — clarify intent before mutating files.
2. **Explore** — read existing code and requirements first.
3. **Resolve uncertainty** — ask one focused question for real product decisions.
4. **Classify** — substantial work gets tracked in `odd/tasks/<feature>.md`.
5. **Track** — create/update task files and Engram mirrors before the first write.
6. **Implement task by task** — run verification after each task.
7. **Close** — report outcome, failures, and next steps.

### SDD/OpenSpec flow for product changes

For user-facing features, prefer:

```text
/opsx:propose <description>
```

Then:

1. Review the proposal with the user.
2. Apply with `/opsx:apply <change-name>` or user approval.
3. Verify before claiming done.
4. Commit and push only when authorized.

## GitHub workflow

- `main` is production. Do not push directly to `main`.
- `dev` is integration. Product PRs target `dev`.
- Feature branches start from `dev`: `feature/<name>`.
- Create a tracking issue for each feature using the issue templates.
- PRs must link an issue with `Closes #N`.
- Apply relevant labels: `kind:feature`, `kind:bug`, `dependencies`, `npm`, etc.
- User merges PRs; do not merge unless explicitly authorized.
- After merge, update local `dev`:
  ```bash
  git switch dev
  git pull --ff-only origin dev
  ```

## Repository map

| Area | Location | Purpose |
| --- | --- | --- |
| Web app | `web/` | React + Vite + Tailwind + shadcn/ui frontend |
| VITO bridge | `bridge/` | Reserved for future VITO integration |
| Backend config | `supabase/` | Local Supabase CLI configuration |
| Specs | `openspec/` | OpenSpec SDD artifacts |
| Tasks | `odd/tasks/` | ODD task tracking |
| Governance | `.github/` | Issue templates, PR template, Dependabot config |
| Pi config | `.pi/` | Pi package and agent model settings (local, not all committed) |
| Docs | `README.md`, `AGENTS.md` | Project documentation |

## Safety rules

- Do not commit secrets, tokens, or `.env` files.
- Do not commit local Pi runtime state (`.atl/`, `.env`, `.pi/git/`).
- Do not run destructive commands without explicit user approval.
- Do not merge PRs unless explicitly authorized.
- Do not edit files outside the authorized scope.
- Ask before adding new dependencies broadly.
- Preserve `main` as production; route all product work through `dev`.

## Verification commands

Run the smallest relevant checks and report exact results:

```bash
# Web app
npm --prefix web test
npm --prefix web run build

# Supabase local
supabase status

# OpenSpec
npx --yes openspec validate <change-name> --strict
npx --yes openspec status --change <change-name>

# Git state
git status --short
git log --oneline -5
```

For dependency-related changes, also verify:

```bash
git diff -- web/package.json web/package-lock.json
```

## AI Agora and public discussions

- Agents may comment on their own PRs and issues they authored.
- Agents must not comment on PRs they did not author.
- Agents may comment on issues only when explicitly asked or when the issue is part of an active task assigned to the agent.
- Keep one distinct proposal or observation per comment.
- Cite evidence and state uncertainty clearly.

## Source-of-truth rules

- `openspec/config.yaml` owns project context, rules, and operation guidance.
- `skills/i-have-adhd/SKILL.md` owns ADHD-friendly response style.
- OpenSpec change artifacts under `openspec/changes/<change-name>/` own the contract for each product slice.
- `README.md` owns local setup and current scope.
- Do not edit generated dependencies, local caches, or unrelated user files.
