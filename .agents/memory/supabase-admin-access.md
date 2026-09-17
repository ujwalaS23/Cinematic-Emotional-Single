---
name: Supabase admin reads
description: Durable guidance for reading the existing Supabase visitor table from the host dashboard.
---

The Replit Supabase connector can appear connected while its REST proxy returns an invalid-URL configuration error. Complete host-dashboard reads and visitor writes require the server-side Supabase service-role key when the existing RLS policy does not grant the host user access to every visitor row. The host's authenticated Supabase access token remains a limited fallback.

**Why:** The connector failure was only visible in server-side diagnostics, and token-authenticated admin requests could return 200 while RLS still hid rows from the complete dashboard count.

**How to apply:** Keep both service-role access and user tokens server-side, enforce the configured admin email before querying, and log upstream Supabase status without exposing it to normal visitors. Never expose the service-role key to the browser.