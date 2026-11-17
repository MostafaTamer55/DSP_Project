# Supabase setup

1. Create a Supabase project and copy its project URL and publishable (or anon) key into `.env.local` using `.env.example` as the template.
2. In the Supabase SQL Editor, run [`supabase/schema.sql`](supabase/schema.sql). The `user_data` table uses row-level security so each signed-in account can only access its own JSON records.
3. In Authentication settings, configure the site URL as the deployed app URL and allow the local Vite URL (usually `http://localhost:5173`). Enable email confirmations and configure SMTP before production use.
4. Add the deployed URL and local URL to the Authentication redirect URL allowlist. Password recovery redirects to `/reset-password` on the current site.
5. Restart Vite after changing `.env.local`.

Only the Supabase project URL and publishable/anon key belong in frontend environment variables. Never put the service-role key in this app. Existing mock accounts are no longer accepted; users must register in Supabase.

The app's progress service stores its signed-in user's progress as the `progress` JSON record in `user_data`. The `loadUserData` and `saveUserData` helpers in `src/lib/userData.js` can be used for other account-owned JSON records.