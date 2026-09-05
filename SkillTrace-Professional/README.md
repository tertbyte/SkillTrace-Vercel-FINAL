# SkillTrace — Workforce Intelligence

A professional SIH-ready prototype for tracking the journey from **training → certification → employment/self-employment → verification → retention → wage progression → skill intelligence**.

## What's in this build
- Executive government-style command center
- Candidate outcome registry with search and filters
- Candidate profile + outcome timeline
- Add candidate workflow
- Training impact analytics
- Employment outcome funnel
- Demand vs supply skills intelligence
- Executive analytics
- AI skill-gap analysis through a secure Express backend
- Responsive mobile layout
- Demo-environment data governance notice

## Run
```bash
npm install
```

Create `.env`:
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
```

Run frontend and backend:
```bash
npm run dev
npm run server
```

Or install `concurrently` and use:
```bash
npm run dev:full
```

## Important
The starter candidate records are synthetic demo data. Candidate records added in the UI are currently session-only frontend state; refresh will reset them. For a production deployment, connect the registry to an authenticated database (Firebase/Supabase/PostgreSQL), add role-based access, audit logs, consent/retention controls, employer verification, encryption, and secure deployment.

Never expose `OPENAI_API_KEY` in frontend code or commit `.env`.

## Suggested production architecture
React/Vite → API gateway → authenticated application API → PostgreSQL/Firebase → AI service → analytics layer.

AI should provide decision support, not make final eligibility or employment decisions without human review.
