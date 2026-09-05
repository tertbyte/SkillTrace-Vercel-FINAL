import { clearSession, securityHeaders } from "./_security.js";
export default function handler(req, res) {
  securityHeaders(res);
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  clearSession(res);
  return res.status(200).json({ authenticated: false });
}
