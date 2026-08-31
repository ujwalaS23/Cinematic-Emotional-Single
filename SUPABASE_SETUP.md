# Supabase visitor tracking setup

The birthday site now uses Supabase Auth for Google sign-in and a private
Supabase `public.visitors` table for visitor tracking. No Gmail scope is used.

## 1. Configure the Supabase project

1. Create or open a Supabase project.
2. Find the project URL in **Project Settings → API → Project URL**.
3. Find the public/anon key in **Project Settings → API → Project API keys**.
4. Open **Authentication → Providers → Google** and enable Google.
5. In Google Cloud Console, create a **Web application** OAuth client.
6. In Supabase's Google provider screen, copy the displayed **Callback URL** and add it to Google Cloud under **Authorized redirect URIs**. This is Supabase's callback URL, not the birthday site's callback.
7. Paste the Google Client ID and Client Secret into Supabase's Google provider settings.
8. In **Authentication → URL Configuration**, add the birthday site's published origin to the redirect allow list. The app callback path is:

   `https://YOUR-PUBLISHED-DOMAIN/api/auth/google/callback`

   For local development, also allow the origin used by the local preview.

## 2. Create the table and RLS policy

Run [`artifacts/api-server/supabase/visitors.sql`](artifacts/api-server/supabase/visitors.sql)
in **Supabase Dashboard → SQL Editor**.

The policy intentionally denies browser `anon` and `authenticated` roles.
The API server is the only component that reads the complete visitor list.

## 3. Configure Replit

The attached Supabase integration is already available to the API server.
For the server-side auth flow, add these values through Replit Secrets:

- `SUPABASE_URL`: the Supabase Project URL
- `SUPABASE_ANON_KEY`: the Supabase public/anon key
- `SUPABASE_SERVICE_ROLE_KEY`: the Supabase service-role key, server-side only
- `ADMIN_EMAIL`: the exact email address of the Google account that may open `/admin/visitors`

Never add the service-role key to frontend variables or client code.

## 4. Test

1. Open the birthday page.
2. Click **Continue with Google**.
3. Complete Google's consent screen.
4. Confirm the page returns to the existing birthday content.
5. Sign in with the account matching `ADMIN_EMAIL`.
6. Open `/admin/visitors`.
7. Confirm totals, recent visitors, search, sorting, refresh, and logout.
8. Try the dashboard with a different Google account and confirm it receives no visitor data.

If Google sign-in is cancelled or configuration is incomplete, the birthday page
shows a friendly error and still offers anonymous continuation.