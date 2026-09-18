## Context

The web app (Vite + React) uses Tailwind v3 with:

- `web/postcss.config.js` loading `tailwindcss` and `autoprefixer`.
- `web/tailwind.config.ts` with `darkMode: ['class']`, content globs, and an extended `theme.colors` map where every semantic color reads a raw HSL-channel CSS variable (e.g. `border: 'hsl(var(--border))'`, with `--border: 240 5.9% 90%`), plus `borderRadius` from `--radius`.
- `web/src/index.css` with `@tailwind base/components/utilities`, a `@layer base` block defining the `:root` and `.dark` variables, and `@apply` in the `body`.

This is the standard shadcn/ui v3 token pattern. Tailwind v4 changes the entry contract, the plugin packaging, and the recommended token model, so a raw version bump breaks the build (confirmed on Dependabot PR #11).

## Goals / Non-Goals

**Goals:**

- Build the app with Tailwind v4 via `@tailwindcss/vite`.
- Move theme definition into CSS-first `@theme` tokens (shadcn v4 style) and delete the JS config.
- Preserve the current visual result and class-based dark mode.

**Non-Goals:**

- No visual redesign, no new tokens beyond translating the existing ones.
- No adoption of new Tailwind v4 features beyond what the migration requires.

## Decisions

### Integrate via `@tailwindcss/vite`, drop PostCSS and autoprefixer
Add `@tailwindcss/vite` to `web/vite.config.ts` plugins and remove `web/postcss.config.js`. v4 handles vendor prefixing internally, so `autoprefixer` (and `postcss`, if unused elsewhere) is removed. Alternative considered: keep the PostCSS pipeline with `@tailwindcss/postcss`. Rejected because the Vite plugin is the recommended, faster path for a Vite app and removes a config file.

### CSS entry becomes `@import "tailwindcss";`
Replace the three `@tailwind` directives in `web/src/index.css` with a single `@import "tailwindcss";` at the top, per the v4 contract.

### Theme moves to `@theme` with OKLCH tokens; JS config deleted
Define colors and radius in an `@theme` block using v4 token names (`--color-background`, `--color-sidebar-accent`, `--radius-lg`, etc.). Convert the current HSL-channel values to OKLCH so the theme is fully v4-native, keeping perceptual equivalence. Delete `web/tailwind.config.ts`. Content detection is automatic in v4, so the `content` globs are not re-declared. Alternative considered: keep `tailwind.config.ts` via `@config`. Rejected because the user chose the full v4-native path.

### Dark mode via `@custom-variant dark`
Replace `darkMode: ['class']` with `@custom-variant dark (&:where(.dark, .dark *));` in the CSS and provide dark token overrides under a `.dark` selector, preserving today's class-based toggling.

### Use the official upgrade tool as a starting point, then reconcile by hand
Run `npx @tailwindcss/upgrade` to bootstrap the mechanical parts, then manually verify the `@theme`/OKLCH tokens, dark variant, and `@apply` usages, since the tool does not always produce the shadcn v4 token shape.

## Risks / Trade-offs

- **Color drift from HSL→OKLCH conversion.** Mitigation: convert with a consistent method and compare key surfaces visually; accept only within normal conversion tolerance.
- **`@apply` in `body` and utility resolution changes.** Mitigation: confirm `bg-background text-foreground` and sidebar utilities still resolve after the token move; adjust token names to the ones utilities expect.
- **Hidden reliance on autoprefixer output.** Low risk given modern browser targets; v4's built-in prefixing covers current usage.
- **Verification is visual, not unit-tested.** Mitigation: the tasks require a browser check of sidebar, auth pages, cards, and buttons in both light and dark mode, in addition to `test` and `build`.
