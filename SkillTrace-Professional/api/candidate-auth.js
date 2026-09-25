import crypto from "node:crypto";
import {securityHeaders,sameOrigin,checkRateLimit} from "./_security.js";
const COOKIE="skilltrace_candidate",TTL=30*24*60*60*1000;
const secret=()=>process.env.SESSION_SECRET||"",sign=v=>crypto.createHmac("sha256",secret()).update(v).digest("base64url");
const b64=v=>Buffer.from(v).toString("base64url"),issue=(id,email)=>{const p=b64(JSON.stringify({id,email,role:"candidate",exp:Date.now()+TTL}));return p+"."+sign(p)};
const setCookie=(res,t)=>res.setHeader("Set-Cookie",COOKIE+"="+encodeURIComponent(t)+"; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age="+TTL/1000);
const hash=async(password,salt=crypto.randomBytes(16).toString("hex"))=>new Promise((resolve,reject)=>crypto.scrypt(password,salt,64,(e,b)=>e?reject(e):resolve({salt,hash:b.toString("hex")})));
const validEmail=e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
async function db(path,options={}){const r=await fetch(`${process.env.SUPABASE_URL}/rest/v1/${path}`,{...options,headers:{apikey:process.env.SUPABASE_SERVICE_ROLE_KEY,Authorization:"Bearer "+process.env.SUPABASE_SERVICE_ROLE_KEY,"Content-Type":"application/json",Prefer:"return=representation",...(options.headers||{})}});const t=await r.text();let b=null;try{b=t?JSON.parse(t):null}catch{b={message:t}}if(!r.ok)throw Error(b?.message||"Database error");return b}
export default async function handler(req,res){
 securityHeaders(res);if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});if(!sameOrigin(req))return res.status(403).json({error:"Origin not allowed."});
 const rate=checkRateLimit(req,"candidate-auth",10,15*60*1000);if(!rate.allowed){res.setHeader("Retry-After",rate.retryAfter);return res.status(429).json({error:"Too many attempts. Try again later."})}
 if(!process.env.SUPABASE_URL||!process.env.SUPABASE_SERVICE_ROLE_KEY||!secret())return res.status(503).json({error:"Candidate authentication is not configured."});
 const {action,email,password,name}=req.body||{},e=String(email||"").trim().toLowerCase(),p=String(password||"");
 if(!validEmail(e)||p.length<8)return res.status(400).json({error:"Use a valid email and a password of at least 8 characters."});
 try{
  if(action==="signup"){if(String(name||"").trim().length<2)return res.status(400).json({error:"Please enter your full name."});const existing=await db("candidate_accounts?select=id&email=eq."+encodeURIComponent(e)+"&limit=1");if(existing.length)return res.status(409).json({error:"An account with this email already exists."});const h=await hash(p),rows=await db("candidate_accounts",{method:"POST",body:JSON.stringify({email:e,name:String(name).trim().slice(0,120),password_hash:h.hash,password_salt:h.salt})}),a=rows[0];setCookie(res,issue(a.id,e));return res.status(201).json({authenticated:true,name:a.name})}
  if(action==="login"){const rows=await db("candidate_accounts?select=id,name,password_hash,password_salt&email=eq."+encodeURIComponent(e)+"&limit=1");if(!rows.length)return res.status(401).json({error:"Email or password is incorrect."});const a=rows[0],h=await hash(p,a.password_salt);if(!crypto.timingSafeEqual(Buffer.from(h.hash,"hex"),Buffer.from(a.password_hash,"hex")))return res.status(401).json({error:"Email or password is incorrect."});setCookie(res,issue(a.id,e));return res.status(200).json({authenticated:true,name:a.name})}
  return res.status(400).json({error:"Invalid authentication action."})
 }catch(err){console.error("Candidate auth error:",err);const msg=String(err?.message||"");if(/candidate_accounts|relation .* does not exist|permission denied/i.test(msg))return res.status(503).json({error:"Candidate account database is not ready. Run supabase/candidate-auth.sql in Supabase first."});return res.status(500).json({error:"Candidate authentication failed. Please try again."})}
}