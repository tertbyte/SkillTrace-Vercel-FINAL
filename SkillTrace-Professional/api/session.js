import { readSession, securityHeaders } from "./_security.js";
export default function handler(req, res) {
  securityHeaders(res);
  const session = readSession(req);
  return res.status(200).json({ authenticated: Boolean(session), user: session ? { email: session.email, role: session.role } : null });
}
