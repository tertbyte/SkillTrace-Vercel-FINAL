import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "OPENAI_API_KEY is not configured in Vercel.",
    });
  }

  try {
    const candidate = req.body?.candidate;

    if (!candidate) {
      return res.status(400).json({
        error: "Candidate profile is required.",
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
You are SkillTrace AI, a workforce intelligence assistant.

Analyze this candidate profile for employability and upskilling. Do not invent facts.

Candidate: ${candidate.name}
District: ${candidate.district}
Training: ${candidate.training}
Education: ${candidate.education}
Experience: ${candidate.experience} years
Skills: ${(candidate.skills || []).join(", ")}
Current status: ${candidate.status}
Current role: ${candidate.role}
Current employer: ${candidate.employer}

Return concise sections:
MATCH STRENGTH
SKILL GAPS
NEXT 3 SKILLS
JOB DIRECTION
TRAINING RECOMMENDATION
RISKS / FOLLOW-UP

Use plain language suitable for a government skills officer.
`;

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",
      input: prompt,
    });

    return res.status(200).json({
      result: response.output_text,
    });
  } catch (error) {
    console.error("SkillTrace AI error:", error);

    return res.status(500).json({
      error: "AI analysis failed.",
    });
  }
}
