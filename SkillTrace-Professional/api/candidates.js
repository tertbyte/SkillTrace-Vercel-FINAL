function configured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function mapCandidate(row) {
  return {
    id: row.id,
    name: row.name || "",
    district: row.district || "",
    training: row.training || "",
    skills: Array.isArray(row.skills) ? row.skills : [],
    status: row.status || "Seeking",
    employer: row.employer || "—",
    role: row.role || "—",
    salary: Number(row.salary || 0),
    joined: row.joined || "",
    verified: Boolean(row.verified),
    retention: row.retention || "—",
    education: row.education || "",
    experience: Number(row.experience || 0),
  };
}

async function supabase(path, options = {}) {
  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = { message: text }; }
  if (!response.ok) throw new Error(body?.message || body?.hint || body?.details || "Database request failed.");
  return body;
}

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!configured()) {
    return res.status(503).json({
      configured: false,
      error: "Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.",
    });
  }
  try {
    if (req.method === "GET") {
      const rows = await supabase("candidates?select=*&order=created_at.desc");
      return res.status(200).json({ configured: true, candidates: rows.map(mapCandidate) });
    }
    const c = req.body?.candidate;
    if (!c?.name?.trim() || !c?.training?.trim()) {
      return res.status(400).json({ error: "Name and training are required." });
    }
    const record = {
      id: c.id || `ST-${Date.now().toString().slice(-8)}`,
      name: c.name.trim(), district: c.district || "", training: c.training.trim(),
      skills: Array.isArray(c.skills) ? c.skills : [], status: c.status || "Seeking",
      employer: c.employer || "—", role: c.role || "—", salary: Number(c.salary || 0),
      joined: c.joined || new Date().toISOString().slice(0, 10), verified: Boolean(c.verified),
      retention: c.retention || "—", education: c.education || "", experience: Number(c.experience || 0),
    };
    const rows = await supabase("candidates", { method: "POST", body: JSON.stringify(record) });
    return res.status(201).json({ configured: true, candidate: mapCandidate(rows[0]) });
  } catch (error) {
    console.error("Candidate API error:", error);
    return res.status(500).json({ error: error.message || "Candidate database operation failed." });
  }
}
