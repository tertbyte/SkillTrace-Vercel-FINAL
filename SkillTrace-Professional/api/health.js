import { configured as authConfigured, securityHeaders } from "./_security.js";
export default function handler(req, res) {
  securityHeaders(res);
  return res.status(200).json({ ok: true, aiConfigured: Boolean(process.env.OPENAI_API_KEY), databaseConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY), authConfigured: authConfigured() });
}
