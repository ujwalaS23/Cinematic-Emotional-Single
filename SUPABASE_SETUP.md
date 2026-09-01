# Supabase Google sign-in setup

The birthday site uses the existing Supabase project and the existing
`public.visitors` table. The app does not create a second table.

## Required existing table columns

The server inserts only these columns:

- `email`
- `name`
- `visited_at`
- `user_agent`

Your existing RLS INSERT policy must allow the `authenticated` role to insert
these columns. No service-role key is needed for the visitor insert flow.

## Replit configuration

Add these values through Replit Secrets:

- `SUPABASE_URL`: the Supabase Project URL
- `SUPABASE_ANON_KEY`: the Supabase public/anon key

The app reads both values on the server. Neither value is hard-coded into the
frontend, and no Google password or service-role key is collected.

## Supabase and Google redirect settings

1. In **Supabase → Authentication → Providers → Google**, confirm Google is
   enabled and the Google Client ID and Client Secret are saved.
2. In Google Cloud Console, keep the Supabase-provided Google callback URL from
   the Google provider page under **Authorized redirect URIs**.
3. In **Supabase → Authentication → URL Configuration**, add the published
   birthday site origin or this callback path to the redirect allow list:

   `https://YOUR-PUBLISHED-DOMAIN/api/auth/google/callback`

4. If testing through a local preview, add that local preview origin as well.

## Test the visitor insert

1. Open the birthday page.
2. Click **Continue with Google**.
3. Complete Google's consent screen.
4. Confirm the site returns to the existing birthday content.
5. Open **Supabase → Table Editor → visitors**.
6. Confirm a new row contains the authenticated Google email, display name,
   visit timestamp, and browser user-agent string.
7. Cancel Google sign-in once and confirm the site shows a friendly error while
   still allowing anonymous continuation.

The private dashboard route from the existing project remains protected
server-side. It requires the project's configured admin access settings and a
server-side privileged Supabase connection to read the complete table; normal
visitors never receive the visitor list.