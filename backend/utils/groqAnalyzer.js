const Groq = require("groq-sdk");
require("dotenv").config();

/**
 * Preferred model order — the first one found in the account's available models will be used.
 * This avoids hardcoding a single model that may not be on every Groq plan.
 */
const PREFERRED_MODELS = [
  "llama3-70b-8192",
  "llama3-8b-8192",
  "llama-3.1-70b-versatile",
  "llama-3.1-8b-instant",
  "llama-3.3-70b-versatile",
  "mixtral-8x7b-32768",
  "gemma2-9b-it",
  "gemma-7b-it",
];

let _cachedModel = null;

/**
 * Resolves the best available model for the given Groq client.
 * Result is cached after the first call.
 */
async function resolveModel(groq) {
  if (_cachedModel) return _cachedModel;

  try {
    const { data: models } = await groq.models.list();
    const available = new Set(models.map((m) => m.id));
    console.log("Available Groq models:", [...available].join(", "));

    for (const preferred of PREFERRED_MODELS) {
      if (available.has(preferred)) {
        console.log(`Using Groq model: ${preferred}`);
        _cachedModel = preferred;
        return preferred;
      }
    }

    // Last resort — use whatever is first in the list
    if (models.length > 0) {
      const fallback = models[0].id;
      console.warn(`No preferred model found. Falling back to: ${fallback}`);
      _cachedModel = fallback;
      return fallback;
    }
  } catch (err) {
    console.warn("Could not fetch model list from Groq:", err.message);
  }

  throw new Error(
    "No Groq models are available on your account. Please check your API key at https://console.groq.com/keys"
  );
}

/**
 * Analyzes resume text using Groq LLM API with the key loaded from .env.
 */
async function analyzeResumeWithGroq(text) {
  const activeKey = process.env.GROQ_API_KEY
    ? process.env.GROQ_API_KEY.trim()
    : "";

  if (!activeKey || activeKey.startsWith("gsk_your_groq_api_key")) {
    throw new Error(
      "GROQ_API_KEY is not configured in backend/.env. Please set GROQ_API_KEY in backend/.env."
    );
  }

  const groq = new Groq({ apiKey: activeKey });
  const model = await resolveModel(groq);

  const prompt = `
Extract all technical skills, frameworks, programming languages, databases, cloud tools, and key technical competencies from this resume.
Categorize each skill and infer a proficiency level (Beginner, Intermediate, Advanced) based on years of experience, projects, or context in the resume. If unspecified, default to Intermediate.

Return a JSON object with this exact format:
{
  "summary": "1-2 sentence overview of the candidate's core technical profile",
  "skills": [
    { "name": "React", "level": "Advanced", "category": "Frontend" },
    { "name": "Node.js", "level": "Intermediate", "category": "Backend" }
  ]
}

Only return the JSON object, nothing else.

Resume text:
${text.slice(0, 15000)}
`;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an expert technical recruiter and ATS parser. Always reply with valid JSON containing technical skills.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    const parsed = JSON.parse(content);

    const skills = Array.isArray(parsed.skills)
      ? parsed.skills
          .filter((s) => s && s.name && typeof s.name === "string")
          .map((s) => ({
            name: s.name.trim(),
            level: ["Beginner", "Intermediate", "Advanced"].includes(s.level)
              ? s.level
              : "Intermediate",
            category: s.category || "General",
          }))
      : [];

    return {
      skills,
      summary: parsed.summary || "AI analysis completed.",
      isAiExtracted: true,
    };
  } catch (err) {
    // If the chosen model was rejected, clear cache so next request retries
    if (err.status === 404 || (err.message && err.message.includes("model_not_found"))) {
      _cachedModel = null;
    }
    console.error("Groq API error:", err.message);
    throw new Error("Groq AI analysis error: " + err.message);
  }
}

module.exports = { analyzeResumeWithGroq };
