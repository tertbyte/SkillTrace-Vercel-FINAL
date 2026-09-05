# SkillTrace — Supabase setup

Phase 1 adds a persistent PostgreSQL-backed candidate registry.

## 1. Create a Supabase project
Create a project at Supabase, then open **SQL Editor**.

## 2. Create the table
Copy and run `supabase/schema.sql` in the SQL Editor.

## 3. Add Vercel environment variables
In Vercel → SkillTrace → Settings → Environment Variables, add these for **Production**:

- `SUPABASE_URL` = your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service-role key

Keep the service-role key server-side. Never put it in React, GitHub source code, or a public browser variable.

## 4. Redeploy Production
After adding both variables, redeploy/promote the new deployment to Production.

## 5. Verify
Open `/api/health`. You should see `databaseConfigured: true` alongside the existing AI status.

The Candidates page then loads persisted records from `/api/candidates`, and Add Candidate writes to PostgreSQL. Synthetic starter records remain visible for demo continuity.
