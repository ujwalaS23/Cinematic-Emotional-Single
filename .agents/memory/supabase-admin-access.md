---
name: Supabase admin reads
description: Durable guidance for reading the existing Supabase visitor table from the host dashboard.
---

The Replit Supabase connector can appear connected while its REST proxy returns an invalid-URL configuration error. The host's authenticated Supabase access token is a reliable fallback for server-side visitor reads when the database RLS policy permits the host account to select rows.

**Why:** The visitor dashboard previously returned a generic 503 even though Google login and visitor inserts worked; the connector failure was only visible in server-side diagnostics.

**How to apply:** Keep the token server-side in the signed session cookie, enforce the configured admin email before querying, and log the upstream Supabase status without exposing it to normal visitors.