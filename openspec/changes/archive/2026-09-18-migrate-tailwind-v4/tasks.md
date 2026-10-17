## 1. Dependencies and build integration

- [x] 1.1 In `web/`, add `tailwindcss@^4` and `@tailwindcss/vite`; remove `autoprefixer` (and `postcss` if unused elsewhere) and regenerate `web/package-lock.json`.
- [x] 1.2 Add the `@tailwindcss/vite` plugin to `web/vite.config.ts`.
- [x] 1.3 Delete `web/postcss.config.js`.

## 2. CSS entry and theme

- [x] 2.1 Replace `@tailwind base/components/utilities` in `web/src/index.css` with `@import "tailwindcss";`.
- [x] 2.2 Define the theme in an `@theme` block using v4 token names, converting the current HSL-channel values (background, foreground, primary, secondary, muted, destructive, accent, card, popover, border, input, ring, radius, and all `sidebar-*` tokens) to OKLCH.
- [x] 2.3 Re-express dark mode with `@custom-variant dark` plus `.dark` token overrides, preserving the current light/dark values.
- [x] 2.4 Delete `web/tailwind.config.ts` and confirm no code imports it.
- [x] 2.5 Verify `@apply min-h-screen bg-background text-foreground antialiased` in `body` and the sidebar utilities still resolve. Also updated direct `hsl(var(--token))` refs (sidebar.tsx shadow arbitrary values, NavUser.tsx inline style) to `var(--token)` since tokens now hold complete OKLCH colors.
- [x] 2.6 Migrate v4 arbitrary CSS-variable syntax `<util>-[--var]` -> `<util>-(--var)` across `sidebar.tsx`, `dropdown-menu.tsx`, `tooltip.tsx`, `NavUser.tsx` (11 occurrences). In v4 the bare `[--var]` form no longer expands to `var(--var)`, which had collapsed the sidebar width and overlapped the content.

## 3. Verify

- [x] 3.1 Run `npm --prefix web run build` and verify it passes with no PostCSS/plugin error.
- [x] 3.2 Run `npm --prefix web test` and verify tests stay green.
- [x] 3.3 Start the dev server and visually check the sidebar, authentication pages, cards, and buttons in both light and dark mode; confirm no visual regression within color-conversion tolerance. Verified via headless-Chromium screenshots (home + profile, light/dark): sidebar width restored, no content overlap, cards/nav/footer render correctly. Dark mode keeps the pre-existing partial behavior (v3 `.dark` block only overrode sidebar tokens).
- [x] 3.4 Run `npx --yes openspec validate migrate-tailwind-v4 --strict` and verify it passes.
- [x] 3.5 Confirm `postcss.config.js`, `tailwind.config.ts`, and `autoprefixer` are gone and Tailwind loads via the Vite plugin.

## Review Workload Forecast

- Estimated changed lines: 80-160 (config removals, `index.css` theme block, lockfile).
- 250-line budget risk: Low.
- Chained PRs recommended: No.
- Decision needed before apply: Resolved — full v4-native migration via `@tailwindcss/vite` with OKLCH `@theme` tokens.
