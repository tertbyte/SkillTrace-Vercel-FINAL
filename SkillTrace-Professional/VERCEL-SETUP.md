# Vercel deployment for SkillTrace

This version is prepared for Vercel.

## Vercel project settings
Root Directory:
`SkillTrace-Professional`

Build Command:
`npm run build`

Output Directory:
`dist`

## Environment variable
Add this in Vercel:

Key:
`OPENAI_API_KEY`

Value:
your OpenAI API key

Environment:
Production (Preview optional)

Do NOT add `PORT`.

## Test after deployment
Open:

`https://YOUR-DOMAIN/api/health`

Expected:

`{"ok":true,"aiConfigured":true}`

Then open the app and use **Analyze Skill Gap**.

The frontend calls `/api/skill-gap`, so it no longer depends on `localhost:3001`.

Never commit `.env` or expose the OpenAI API key in frontend code.
