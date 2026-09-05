import { authConfigured, requireAuth, sameOrigin, checkRateLimit, securityHeaders, audit, validateCandidate } from "./_security.js";

function databaseConfigured() { return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY); }
function mapCandidate(row) {
  return { id: row.id, name: row.name || "", district: row.district || "", training: row.training || "", skills: Array.isArray(row.skills) ? row.skills : [], status: row.status || "Seeking", employer: row.employer || "—", role: row.role || "—", salary: Number(row.salary || 0), joined: row.joined || "", verified: Boolean(row.verified), retention: row.retention || "—", education: row.education || "", experience: Number(row.experience || 0) };
}
async function supabase(path, options = {}) {
  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${path}`, { ...options, headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation", ...(options.headers || {}) } });
  const text = await response.text(); let body = null; try { body = text ? JSON.parse(text) : null; } catch { body = { message: text }; }
  if (!response.ok) {
    console.error("Supabase candidates request failed", { status: response.status, statusText: response.statusText, path, body });
    throw new Error("Database request failed.");
  }
  return body;
}
export default async function handler(req, res) {
  securityHeaders(res);
  if (req.method !== "GET" && req.method !== "POST") { res.setHeader("Allow", "GET, POST"); return res.status(405).json({ error: "Method not allowed" }); }
  if (!databaseConfigured()) return res.status(503).json({ configured: false, error: "Database is not configured." });
  if (!authConfigured()) return res.status(503).json({ error: "Authentication is not configured." });
  if (!sameOrigin(req)) return res.status(403).json({ error: "Origin not allowed." });
  const session = requireAuth(req, res); if (!session) return;
  const rate = checkRateLimit(req, "candidates", 60, 60_000); if (!rate.allowed) { res.setHeader("Retry-After", rate.retryAfter); return res.status(429).json({ error: "Too many requests." }); }
  try {
    if (req.method === "GET") {
      const rows = await supabase("candidates?select=*&order=created_at.desc");
      await audit("candidate.list", session, { count: rows.length });
      return res.status(200).json({ configured: true, candidates: rows.map(mapCandidate) });
    }
    const c = req.body?.candidate; const validation = validateCandidate(c); if (validation) return res.status(400).json({ error: validation });
    const record = { id: c.id || `ST-${Date.now().toString().slice(-8)}`, name: c.name.trim(), district: String(c.district || "").trim(), training: c.training.trim(), skills: c.skills, status: c.status || "Seeking", employer: String(c.employer || "—").trim(), role: String(c.role || "—").trim(), salary: Number(c.salary || 0), joined: c.joined || new Date().toISOString().slice(0, 10), verified: Boolean(c.verified), retention: String(c.retention || "—").trim(), education: String(c.education || "").trim(), experience: Number(c.experience || 0) };
    const rows = await supabase("candidates", { method: "POST", body: JSON.stringify(record) });
    await audit("candidate.create", session, { candidate_id: record.id });
    return res.status(201).json({ configured: true, candidate: mapCandidate(rows[0]) });
  } catch (error) { console.error("Candidate API error:", error); return res.status(500).json({ error: "Candidate database operation failed." }); }
}
