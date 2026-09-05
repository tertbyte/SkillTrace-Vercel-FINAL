# SkillTrace security setup

The application now protects candidate and AI APIs with server-side authentication, secure HttpOnly cookies, same-origin checks, rate limiting, validation, audit logging and production security headers.

## Required Vercel Production variables

Keep the existing:
- OPENAI_API_KEY
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY

Add:
- ADMIN_EMAIL — the administrator login email
- ADMIN_PASSWORD — a long unique password; never commit it
- SESSION_SECRET — a random secret of at least 32 characters; never commit it

## Database

Run `supabase/schema.sql` in the Supabase SQL Editor after pulling this version. It adds `audit_logs` and keeps Row Level Security enabled.

## Important

Never put the service-role key, OpenAI key, ADMIN_PASSWORD or SESSION_SECRET in React code or GitHub. Never share them in chat.

For a larger government deployment, replace the single-admin credential with an identity provider and role-based access control (candidate, training centre, employer, district officer, state admin), plus centralized rate limiting and security monitoring.
