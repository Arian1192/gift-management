# Sidebar Collapsed Repair

## Goal
Repair the collapsed sidebar UX using the official shadcn/ui base sidebar pattern.

## Tasks

- [ ] Review the official shadcn/ui sidebar docs and current implementation.
- [ ] Re-implement the app sidebar so collapsed navigation icons and footer avatar use the base `SidebarMenuButton` behavior.
- [ ] Remove custom centering hacks that fight the shadcn sidebar styles.
- [ ] Verify tests, build, and OpenSpec validation.
- [ ] Push the fix and update PR #8.

## Acceptance Criteria

- Collapsed sidebar icons are centered in the icon rail.
- Footer user/avatar area is not clipped when collapsed.
- Footer dropdown still opens and exposes Log out.
- Expanded sidebar still shows labels and user info.
- Existing route/auth tests pass.
