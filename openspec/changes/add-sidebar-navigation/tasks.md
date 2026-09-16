## 1. Dependencies and shadcn Sidebar

- [ ] 1.1 Add React Router and the shadcn/ui base sidebar component if not already present, then verify the app still builds.
- [ ] 1.2 Create or update the sidebar component files under `web/src/components/ui/` following the shadcn base sidebar pattern.

## 2. Routing and Auth Guard

- [ ] 2.1 Define route structure with a public `/login` route and protected routes under an authenticated layout, then verify the route config compiles.
- [ ] 2.2 Implement an auth guard layout that shows a loading state during session restoration, redirects to `/login` when unauthenticated, and renders protected content when authenticated.
- [ ] 2.3 Add a 404 fallback route inside the authenticated layout and verify unknown paths render it.

## 3. Sidebar Navigation and Pages

- [ ] 3.1 Create config-driven sidebar navigation items for Home and Profile and verify active state matches the current route.
- [ ] 3.2 Create placeholder Home page and Profile page components.
- [ ] 3.3 Integrate the sidebar into the authenticated layout and verify it renders on protected routes.

## 4. Sign-out Redirect

- [ ] 4.1 Update the sign-out handler to redirect to `/login` after a successful sign-out and verify the redirect works.

## 5. Verification

- [ ] 5.1 Add focused tests or documented manual checks for: unauthenticated redirect, authenticated access, direct URL access, session restoration loading, sign-out redirect, active sidebar item, and 404 fallback.
- [ ] 5.2 Run `npm --prefix web test`, `npm --prefix web run build`, and `npx --yes openspec validate add-sidebar-navigation --strict`.
- [ ] 5.3 Confirm no Supabase schema changes, no admin section, and no role-based access were added.

## Review Workload Forecast

- Estimated changed lines: 250-500 depending on generated shadcn sidebar code and test coverage.
- 250-line budget risk: Medium to High.
- Chained PRs recommended: Consider splitting if scaffold/routing plus sidebar/pages exceed a comfortable review.
- Decision needed before apply: No for the first proposal, but review the route list before implementation starts.
