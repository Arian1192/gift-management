# Apply Progress: add-sidebar-navigation

## Structured Status Consumed

- Schema: `gentle-ai.sdd-status` v2.
- Change: `add-sidebar-navigation`.
- Artifact store: `openspec` canonical, Engram mirror requested by session preflight when useful.
- Apply state consumed before edits: `ready`.
- Next recommended before edits: `apply`.
- Action context: repo-local workspace `/Users/arian/Documents/Dev/gift-management` with allowed edit root `/Users/arian/Documents/Dev/gift-management`.
- Native note: future work may target edit paths outside authorized roots, but current work unit is not blocked.

## Completed Tasks

- [x] 1.1 Added React Router dependency and verified the app builds.
- [x] 1.2 Added the full shadcn/ui base sidebar component under `web/src/components/ui/sidebar.tsx` using `npx shadcn add sidebar --overwrite`.
- [x] 1.3 Sidebar is collapsible to icons using `collapsible="icon"` and includes `SidebarTrigger` and `SidebarRail`.
- [x] 1.4 Added supporting shadcn components installed by the shadcn CLI: sheet, tooltip, separator, skeleton, and the `use-mobile` hook.
- [x] 1.5 Added `window.matchMedia` mock in test setup so `use-mobile` hook works in jsdom.
- [x] 2.1 Defined public `/login` and protected authenticated routes.
- [x] 2.2 Implemented session restoration loading, unauthenticated redirect, and authenticated rendering.
- [x] 2.3 Added authenticated 404 fallback for unknown routes.
- [x] 3.1 Added config-driven Home/Profile sidebar navigation with active route state.
- [x] 3.2 Added placeholder Home and Profile pages.
- [x] 3.3 Integrated sidebar into the authenticated layout.
- [x] 3.4 Added `SidebarFooter` with signed-in user info and a sign-out action inside a `DropdownMenu` (NavUser pattern).
- [x] 3.5 Centered navigation icons and the user avatar when the sidebar is collapsed.
- [x] 3.6 Repaired collapsed sidebar markup to remove custom centering wrappers and rely on the shadcn/ui base `SidebarMenuButton` collapsed styles.
- [x] 3.7 Wrapped the navigation menu in `SidebarGroup`/`SidebarGroupContent`; this restores the shadcn `p-2` group padding that centers 32px collapsed buttons inside the 48px icon rail.
- [x] 4.1 Updated sign-out to redirect to `/login` after successful sign-out.
- [x] 5.1 Added focused automated tests and updated manual verification checks.
- [x] 5.2 Ran required verification commands.
- [x] 5.3 Confirmed no Supabase schema changes, admin section, or role-based access were added.

## Files Changed

- `web/package.json`
- `web/package-lock.json`
- `web/src/App.tsx`
- `web/src/App.test.tsx`
- `web/src/main.tsx`
- `web/src/components/AppSidebar.tsx`
- `web/src/components/NavUser.tsx`
- `web/src/components/ui/avatar.tsx`
- `web/src/components/ui/dropdown-menu.tsx`
- `web/src/components/ui/sidebar.tsx`
- `web/src/pages/HomePage.tsx`
- `web/src/pages/ProfilePage.tsx`
- `web/src/pages/NotFoundPage.tsx`
- `web/src/test/manual-verification.md`
- `openspec/changes/add-sidebar-navigation/tasks.md`
- `openspec/changes/add-sidebar-navigation/apply-progress.md`

## TDD Cycle Evidence

| Cycle | RED evidence | GREEN evidence | Refactor/Triangulation evidence |
| --- | --- | --- | --- |
| Navigation/auth routes | Added `web/src/App.test.tsx` route tests first. `npm --prefix web test` failed because `react-router-dom` was not installed. | Installed React Router and implemented routes, protected layout, pages, sidebar, sign-out redirect. `npm --prefix web test` passed with 9 tests. | Fixed the sign-out redirect race with explicit signed-out state, then reran tests and build. |

## Verification Evidence

- `npm --prefix web test` → passed; 3 test files, 9 tests.
- `npm --prefix web run build` → passed; Vite emitted a chunk-size warning for a 524.13 kB JS chunk after adding routing/Supabase app code.
- `npx --yes openspec validate add-sidebar-navigation --strict` → passed; change is valid.

### Collapsed Sidebar Repair Verification

- `npm --prefix web test` → passed; 3 test files, 9 tests.
- `npm --prefix web run build` → passed; Vite emitted a chunk-size warning for a 652.46 kB JS chunk.
- `npx --yes openspec validate add-sidebar-navigation --strict` → passed; change is valid.
- `git status --short` → run after implementation; modified app/OpenSpec files plus pre-existing untracked `.pi/gentle-ai/models.json` visible.

## Deviations From Design

- Initially used a local shadcn-style sidebar implementation. After review, replaced it with the full shadcn/ui base sidebar via `npx shadcn add sidebar --overwrite` to get collapsible behavior, tooltips, and mobile sheet support.
- The sidebar footer now contains the user email and sign-out action inside a dropdown, following the shadcn/ui App Sidebar NavUser pattern.

## Remaining Tasks

None. All task checkboxes in `openspec/changes/add-sidebar-navigation/tasks.md` are marked complete.

## Workload / PR Boundary

- Session delivery strategy: `auto-chain`, `feature-branch-chain`, review budget target 250 changed lines.
- Implemented as one cohesive sidebar-navigation slice because the assigned scope was tightly coupled across dependency, route guard, layout, pages, and tests.
- Diff is likely above the 250-line target when including `package-lock.json` and generated-style sidebar/test code; recommend treating this branch as the first feature-chain PR boundary for the sidebar foundation.

## Produced Status

- Apply implementation complete.
- Verification evidence collected.
- Recommended next phase: archive, with optional human review of the completed diff before archive.
