import crypto from "node:crypto";

const COOKIE = "skilltrace_session";
const TTL = 8 * 60 * 60 * 1000;
const buckets = new Map();

function b64(value) { return Buffer.from(value).toString("base64url"); }
function unb64(value) { return Buffer.from(value, "base64url").toString("utf8"); }
function secret() { return process.env.SESSION_SECRET || ""; }
function sign(value) { return crypto.createHmac("sha256", secret()).update(value).digest("base64url"); }

export function configured() {
  return Boolean(process.env.SESSION_SECRET && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);
}

export function issueSession(email) {
  const payload = b64(JSON.stringify({ email, role: "admin", exp: Date.now() + TTL }));
  return `${payload}.${sign(payload)}`;
}

export function readSession(req) {
  if (!secret()) return null;
  const raw = req.headers.cookie || "";
  const match = raw.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!match) return null;
  const token = decodeURIComponent(match[1]);
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  try {
    if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
    const data = JSON.parse(unb64(payload));
    if (!data.exp || data.exp < Date.now()) return null;
    return data;
  } catch { return null; }
}

export function setSession(res, token) {
  res.setHeader("Set-Cookie", `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${TTL / 1000}`);
}
export function clearSession(res) {
  res.setHeader("Set-Cookie", `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
}

export function requireAuth(req, res) {
  const session = readSession(req);
  if (!session) {
    res.status(401).json({ error: "Authentication required." });
    return null;
  }
  return session;
}

export function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try { return new URL(origin).host === req.headers.host; } catch { return false; }
}

export function checkRateLimit(req, key, limit = 30, windowMs = 60_000) {
  const ip = String(req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || "unknown").split(",")[0].trim();
  const bucketKey = `${key}:${ip}`;
  const now = Date.now();
  const bucket = buckets.get(bucketKey) || { count: 0, reset: now + windowMs };
  if (bucket.reset <= now) { bucket.count = 0; bucket.reset = now + windowMs; }
  bucket.count += 1;
  buckets.set(bucketKey, bucket);
  return { allowed: bucket.count <= limit, retryAfter: Math.ceil((bucket.reset - now) / 1000) };
}

export function securityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Cache-Control", "no-store");
}

export async function audit(event, session, metadata = {}) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  try {
    await fetch(`${process.env.SUPABASE_URL}/rest/v1/audit_logs`, {
      method: "POST",
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ actor_email: session?.email || "system", role: session?.role || "system", event, metadata }),
    });
  } catch (error) { console.error("Audit log failed:", error.message); }
}

export function validateCandidate(c) {
  if (!c || typeof c !== "object") return "Candidate profile is required.";
  const text = ["name", "district", "training", "education", "employer", "role"];
  for (const key of text) if (c[key] != null && String(c[key]).length > 160) return `${key} is too long.`;
  if (!String(c.name || "").trim() || !String(c.training || "").trim()) return "Name and training are required.";
  if (!Array.isArray(c.skills) || c.skills.length > 30 || c.skills.some(s => typeof s !== "string" || s.length > 80)) return "Skills are invalid.";
  const experience = Number(c.experience || 0), salary = Number(c.salary || 0);
  if (!Number.isFinite(experience) || experience < 0 || experience > 60) return "Experience is invalid.";
  if (!Number.isFinite(salary) || salary < 0 || salary > 100000000) return "Salary is invalid.";
  if (!["Seeking", "Employed", "Self-employed"].includes(c.status || "Seeking")) return "Status is invalid.";
  return null;
}

export { COOKIE };
