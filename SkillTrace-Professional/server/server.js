import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app=express();
app.use(cors());
app.use(express.json({limit:"1mb"}));

const port=process.env.PORT||3001;
const client=process.env.OPENAI_API_KEY?new OpenAI({apiKey:process.env.OPENAI_API_KEY}):null;

app.get("/api/health",(req,res)=>res.json({ok:true,aiConfigured:Boolean(client)}));

app.post("/api/skill-gap",async(req,res)=>{
  try{
    const c=req.body?.candidate;
    if(!c) return res.status(400).json({error:"Candidate profile is required."});
    if(!client) return res.status(503).json({error:"AI is not configured. Add OPENAI_API_KEY to .env."});
    const prompt=`You are SkillTrace AI, a workforce intelligence assistant.
Analyze this candidate profile for employability and upskilling. Do not invent facts.
Candidate: ${c.name}
District: ${c.district}
Training: ${c.training}
Education: ${c.education}
Experience: ${c.experience} years
Skills: ${(c.skills||[]).join(", ")}
Current status: ${c.status}
Current role: ${c.role}
Current employer: ${c.employer}

Return concise sections:
MATCH STRENGTH
SKILL GAPS
NEXT 3 SKILLS
JOB DIRECTION
TRAINING RECOMMENDATION
RISKS / FOLLOW-UP
Use plain language suitable for a government skills officer.`;
    const r=await client.responses.create({model:"gpt-5.6-luna",input:prompt});
    res.json({result:r.output_text});
  }catch(e){console.error(e);res.status(500).json({error:"AI analysis failed."});}
});

app.listen(port,()=>console.log(`SkillTrace API running at http://localhost:${port}`));
