# Manual authentication and navigation verification

Use these checks with Supabase running and `web/.env.local` populated from `.env.example`.

1. Run `npm --prefix web run dev` and open the local Vite URL.
2. Confirm signed-out visits to `/` and `/profile` redirect to `/login` and show sign-in and sign-up entry points.
3. Submit missing, malformed, or too-short credentials and confirm safe user-facing validation errors appear.
4. Create an account with an email and password, then confirm authenticated routes show the sidebar.
5. Confirm the sidebar contains Home and Profile and the active item changes when visiting `/` and `/profile`.
6. Reload `/profile` while signed in and confirm the session restoration message appears before the page renders.
7. Visit `/unknown-route` while signed in and confirm the authenticated layout shows the Page not found fallback.
8. Choose **Sign out** and confirm the app redirects to `/login`.
9. Try incorrect credentials and confirm no tokens, secrets, stack traces, or raw JWT values are rendered.
