## 1. Web App Foundation

- [ ] 1.1 Scaffold a minimal React app inside `web/` and verify the app starts with the chosen local dev command.
- [ ] 1.2 Configure Tailwind CSS for the React app and verify styles are applied in the running app.
- [ ] 1.3 Initialize shadcn/ui with the minimum project configuration and verify generated component paths/configuration are present.
- [ ] 1.4 Add only the shadcn/ui components needed for the auth screen and verify no unrelated component set is generated.
- [ ] 1.5 Add Supabase client dependency/configuration and verify the app reads Supabase URL and anon key from environment variables without hard-coded secrets.
- [ ] 1.6 Update `.env.example` and README setup notes for the web auth environment variables and verify no real secret values are committed.

## 2. Authentication UI and State

- [ ] 2.1 Add sign-up and sign-in UI for email + password using shadcn/ui components and verify invalid inputs show user-facing errors.
- [ ] 2.2 Implement Supabase sign-up/sign-in actions and verify successful credentials produce the signed-in state locally.
- [ ] 2.3 Implement session restoration and auth state listening and verify reloading the app preserves a valid signed-in session.
- [ ] 2.4 Implement sign-out and verify the UI returns to the signed-out state.

## 3. Verification

- [ ] 3.1 Add focused tests or documented manual verification for sign-up, sign-in, reload persistence, sign-out, and auth error display.
- [ ] 3.2 Run the web verification commands plus `supabase status` and record exact results in the apply evidence.
- [ ] 3.3 Confirm the implementation stayed within this slice: no gift tables, no bridge work, no OAuth, no password reset, and no profile management.

## Review Workload Forecast

- Estimated changed lines: 350-650 depending on React scaffold, Tailwind/shadcn setup, and test coverage.
- 250-line budget risk: High.
- Chained PRs recommended: Yes if implementation includes full scaffold, shadcn/Tailwind setup, auth UI, and tests in one pass.
- Decision needed before apply: Yes; with the current `auto-chain` delivery preference, split automatically if the apply forecast confirms this size risk.
