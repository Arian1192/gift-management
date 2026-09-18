# frontend-styling Specification

## Purpose

Defines the web app's styling-system contract: how Tailwind CSS is integrated into the Vite build and the guarantee that the existing theme and dark-mode behavior are preserved when the styling engine changes.

## Requirements

### Requirement: Tailwind is integrated through the Vite plugin
The web app SHALL compile its styles with Tailwind CSS v4 via the official Vite plugin, without a standalone PostCSS configuration or a separate autoprefixer step.

#### Scenario: Production build succeeds
- **WHEN** a maintainer runs the production build for the web app
- **THEN** the build completes successfully and emits a stylesheet, with no error about `tailwindcss` being used directly as a PostCSS plugin

#### Scenario: No standalone PostCSS pipeline remains
- **WHEN** the styling integration is inspected after migration
- **THEN** there is no `postcss.config.js` and no `autoprefixer` dependency, and Tailwind is loaded through the Vite plugin

### Requirement: Visual theme is preserved across the migration
The web app SHALL preserve its existing color theme, radius, and component appearance after migrating the styling engine, with no intended visual regression on existing surfaces.

#### Scenario: Existing surfaces look unchanged
- **WHEN** a maintainer views the sidebar, authentication pages, cards, and buttons after the migration
- **THEN** their colors, spacing, and radii match the pre-migration appearance within normal color-conversion tolerance

#### Scenario: Theme tokens remain available as utilities
- **WHEN** components use semantic utilities such as `bg-background`, `text-foreground`, and the sidebar tokens
- **THEN** those utilities resolve to the same semantic colors they resolved to before the migration

### Requirement: Dark mode continues to work by class
The web app SHALL keep class-based dark mode, so applying the `dark` class switches the interface to its dark theme.

#### Scenario: Toggling the dark class switches the theme
- **WHEN** the `dark` class is present on the document root
- **THEN** the interface renders with the dark theme tokens, and removing the class restores the light theme
