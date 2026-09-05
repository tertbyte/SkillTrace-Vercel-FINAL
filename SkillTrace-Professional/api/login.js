import { configured, issueSession, setSession, checkRateLimit, sameOrigin, securityHeaders } from "./_security.js";

export default function handler(req, res) {
  securityHeaders(res);
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!sameOrigin(req)) return res.status(403).json({ error: "Origin not allowed." });
  const rate = checkRateLimit(req, "login", 8, 10 * 60 * 1000);
  if (!rate.allowed) { res.setHeader("Retry-After", rate.retryAfter); return res.status(429).json({ error: "Too many login attempts. Try again later." }); }
  if (!configured()) return res.status(503).json({ error: "Authentication is not configured." });
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  if (email !== String(process.env.ADMIN_EMAIL).trim().toLowerCase() || password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: "Invalid email or password." });
  setSession(res, issueSession(email));
  return res.status(200).json({ authenticated: true, user: { email, role: "admin" } });
}
