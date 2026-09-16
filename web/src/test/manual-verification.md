# Manual authentication verification

Use these checks with Supabase running and `web/.env.local` populated from `.env.example`.

1. Run `npm --prefix web run dev` and open the local Vite URL.
2. Confirm the signed-out state shows sign-in and sign-up entry points.
3. Submit missing, malformed, or too-short credentials and confirm safe user-facing validation errors appear.
4. Create an account with an email and password, then confirm the app reports the resulting auth state.
5. Sign in with valid credentials and confirm the signed-in card shows the active user's email.
6. Reload the page and confirm the signed-in state is restored without re-entering credentials.
7. Choose **Sign out** and confirm the signed-out auth form returns.
8. Try incorrect credentials and confirm no tokens, secrets, stack traces, or raw JWT values are rendered.
