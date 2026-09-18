## Why

The web app is pinned to Tailwind CSS v3 (`tailwindcss ^3.4.19`) with the classic PostCSS + `autoprefixer` pipeline, `@tailwind base/components/utilities` directives, and a JavaScript `tailwind.config.ts`. Dependabot proposed the v3 → v4 major (PR #11), which fails the build because Tailwind v4 moves its PostCSS plugin to a separate package and changes the CSS entry contract. Staying on v3 means declining a supported major and carrying a bump Dependabot will keep re-proposing. Migrating now, while the styling surface is still small, keeps the cost low and unblocks future dependency updates.

## What Changes

- Adopt Tailwind CSS v4 through the official `@tailwindcss/vite` plugin instead of the PostCSS pipeline.
- Remove `postcss.config.js` and `autoprefixer` (vendor prefixing is built into v4).
- Replace `@tailwind base/components/utilities` in `web/src/index.css` with `@import "tailwindcss";`.
- Migrate the theme to a CSS-first, v4-native definition using `@theme` (shadcn v4 token style with OKLCH color values) and remove the JavaScript `tailwind.config.ts`.
- Re-express dark mode using the v4 mechanism (`@custom-variant dark`) instead of the JS `darkMode: ['class']` option, preserving the existing `.dark` class behavior.
- Preserve the existing visual appearance and dark-mode behavior of all current surfaces (sidebar, auth pages, cards, buttons) with no intended visual regression.

### Non-goals

- No redesign, no new components, and no new color palette beyond translating existing tokens.
- No change to application logic, routing, or data flows.
- No upgrade of unrelated dependencies.

## Capabilities

### New Capabilities

- `frontend-styling`: The web app's styling system contract — how Tailwind is integrated into the build and the guarantee that the existing theme and dark mode are preserved across the v4 migration.

### Modified Capabilities

- None.

## Impact

- Affected files: `web/package.json`, `web/package-lock.json`, `web/vite.config.ts`, `web/src/index.css`, removal of `web/postcss.config.js` and `web/tailwind.config.ts`.
- Dependencies: add `tailwindcss@^4` and `@tailwindcss/vite`; remove `autoprefixer` and (if unused elsewhere) `postcss`.
- Build: `npm --prefix web run build` must pass; `npm --prefix web test` must stay green.
- Risk: visual regressions from token/engine changes; mitigated by translating existing tokens 1:1 and verifying key surfaces in the browser.
