import OpenAI from "openai";
import {sameOrigin,checkRateLimit,securityHeaders} from "./_security.js";
const clean=(v,max=160)=>String(v??"").replace(/[\u0000-\u001F\u007F]/g," ").slice(0,max);
export default async function handler(req,res){
 securityHeaders(res);
 if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
 if(!sameOrigin(req))return res.status(403).json({error:"Origin not allowed."});
 const rate=checkRateLimit(req,"user-ai",5,60*60*1000);if(!rate.allowed){res.setHeader("Retry-After",rate.retryAfter);return res.status(429).json({error:"Analysis limit reached. Try again later."})}
 if(!process.env.OPENAI_API_KEY)return res.status(503).json({error:"AI service is not configured."});
 const c=req.body?.candidate;if(!c||typeof c!=="object")return res.status(400).json({error:"Profile is required."});
 const skills=Array.isArray(c.skills)?c.skills.slice(0,20).map(s=>clean(s,60)):[];
 try{
  const openai=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
  const prompt=`You are SkillTrace AI, a career guidance assistant. Analyze only these candidate facts. Do not invent facts or make hiring, eligibility, protected-trait, or sensitive-personal decisions.
Name: ${clean(c.name)}
Training: ${clean(c.training)}
Education: ${clean(c.education)}
Skills: ${skills.join(", ")}
Career goal: ${clean(c.role)}
Return exactly six short levels:
LEVEL 1 — PROFILE CHECK
• one short observation
LEVEL 2 — MATCH STRENGTH
• one short observation
LEVEL 3 — SKILL GAPS
• up to 2 gaps
LEVEL 4 — NEXT 3 SKILLS
• exactly 3 skills
LEVEL 5 — CAREER DIRECTION
• one direction
LEVEL 6 — NEXT MISSION
• one practical action
Keep it simple, encouraging and concise. No tables, scores, or long paragraphs.`;
  const r=await openai.responses.create({model:"gpt-5.6-luna",input:prompt,max_output_tokens:500});
  return res.status(200).json({result:r.output_text});
 }catch(e){console.error("Candidate AI error:",e);return res.status(500).json({error:"AI analysis failed."})}
}