const Groq = require("groq-sdk");
const { SKILL_ALIASES } = require("./extractSkills");
require("dotenv").config();

// Build reverse lookup: alias -> canonical name
const ALIAS_TO_CANONICAL = {};
for (const [canonical, aliases] of Object.entries(SKILL_ALIASES)) {
  for (const alias of aliases) {
    ALIAS_TO_CANONICAL[alias.toLowerCase()] = canonical;
  }
}

function normalizeSkillName(name) {
  const lower = name.toLowerCase().trim();
  return ALIAS_TO_CANONICAL[lower] || name.trim();
}

const CHAT_MODEL_PREFERENCE = [
  "llama-3.3-70b-versatile",
  "llama-3.1-70b-versatile",
  "llama-3.1-8b-instant",
  "llama3-70b-8192",
  "llama3-8b-8192",
  "mixtral-8x7b-32768",
  "gemma2-9b-it",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b",
  "qwen/qwen3.6-27b",
];

const NON_CHAT_MODEL_BLOCKLIST = new Set([
  "whisper-large-v3-turbo",
  "whisper-large-v3",
  "whisper-large-v3-en",
  "distil-whisper-large-v3-en",
  "allam-2-7b",
  "canopylabs/orpheus-v1-english",
  "canopylabs/orpheus-arabic-saudi",
  "meta-llama/llama-prompt-guard-2-86m",
  "meta-llama/llama-prompt-guard-2-22m",
  "groq/compound",
  "groq/compound-mini",
  "openai/gpt-oss-safeguard-20b",
]);

const JSON_MODE_SUPPORTED = new Set([
  "llama-3.3-70b-versatile",
  "llama-3.1-70b-versatile",
  "llama-3.1-8b-instant",
  "llama3-70b-8192",
  "llama3-8b-8192",
  "mixtral-8x7b-32768",
  "gemma2-9b-it",
]);

let _cachedChatModel = null;

function extractJSON(raw) {
  if (!raw || typeof raw !== "string") throw new Error("Empty response from AI model.");
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const jsonStr = fenceMatch ? fenceMatch[1].trim() : raw.trim();
  const start = jsonStr.indexOf("{");
  const end = jsonStr.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object found in response.");
  return JSON.parse(jsonStr.slice(start, end + 1));
}

async function resolveChatModel(groq) {
  if (_cachedChatModel) return _cachedChatModel;
  try {
    const { data: models } = await groq.models.list();
    const available = new Set(
      models.map((m) => m.id).filter((id) => !NON_CHAT_MODEL_BLOCKLIST.has(id))
    );
    console.log("[Groq] Available chat-capable models:", [...available].join(", "));
    for (const preferred of CHAT_MODEL_PREFERENCE) {
      if (available.has(preferred)) {
        console.log(`[Groq] Selected model: ${preferred}`);
        _cachedChatModel = preferred;
        return preferred;
      }
    }
    for (const model of models) {
      if (!NON_CHAT_MODEL_BLOCKLIST.has(model.id)) {
        console.warn(`[Groq] No preferred model found. Using: ${model.id}`);
        _cachedChatModel = model.id;
        return model.id;
      }
    }
  } catch (err) {
    console.warn("[Groq] Could not fetch model list, using default:", err.message);
    _cachedChatModel = CHAT_MODEL_PREFERENCE[0];
    return _cachedChatModel;
  }
  throw new Error("No suitable chat model available on your Groq account.");
}

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.trim() : "";
  if (!apiKey || apiKey.startsWith("gsk_your_groq_api_key")) {
    throw new Error("GROQ_API_KEY is not configured. Add it to backend/.env");
  }
  return new Groq({ apiKey });
}

// ─── Resume Skill Extraction ──────────────────────────────────────────────────

async function analyzeResumeWithGroq(text) {
  const groq = getGroqClient();
  const model = await resolveChatModel(groq);
  const useJsonMode = JSON_MODE_SUPPORTED.has(model);

  const systemPrompt =
    "You are an expert technical recruiter and ATS parser. " +
    "Always reply with a single valid JSON object — no markdown, no explanation, no extra text.";

  const userPrompt = `
Extract all technical skills, frameworks, programming languages, databases, cloud tools,
and key technical competencies from the resume below.

For each skill, infer a proficiency level (Beginner, Intermediate, Advanced) from context.
Default to Intermediate if unspecified.

Return ONLY this exact JSON structure with no other text:
{
  "summary": "1-2 sentence overview of the candidate's core technical profile",
  "skills": [
    { "name": "React", "level": "Advanced", "category": "Frontend" },
    { "name": "Node.js", "level": "Intermediate", "category": "Backend" }
  ]
}

Rules:
- skill "name" must be a plain skill name only (e.g. "React", "Python", "Docker")
- "level" must be exactly one of: Beginner, Intermediate, Advanced
- Do NOT include level or proficiency inside the name field
- Do NOT repeat duplicate skills
- Output valid JSON only

Resume:
${text.slice(0, 12000)}
`.trim();

  const requestParams = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.1,
    max_tokens: 2048,
  };

  if (useJsonMode) {
    requestParams.response_format = { type: "json_object" };
  }

  try {
    const response = await groq.chat.completions.create(requestParams);
    const raw = response.choices[0]?.message?.content || "";
    const parsed = extractJSON(raw);

    const skills = Array.isArray(parsed.skills)
      ? parsed.skills
          .filter((s) => s && typeof s.name === "string" && s.name.trim())
          .map((s) => ({
            name: normalizeSkillName(s.name),
            level: ["Beginner", "Intermediate", "Advanced"].includes(s.level)
              ? s.level
              : "Intermediate",
            category: s.category || "General",
          }))
          .filter((s, idx, arr) =>
            arr.findIndex((x) => x.name.toLowerCase() === s.name.toLowerCase()) === idx
          )
      : [];

    return {
      skills,
      summary: parsed.summary || "AI analysis completed.",
      isAiExtracted: true,
      modelUsed: model,
    };
  } catch (err) {
    const isModelError =
      err.status === 404 ||
      (err.message &&
        (err.message.includes("model_not_found") ||
          err.message.includes("does not support chat completions")));
    if (isModelError) {
      console.warn("[Groq] Model rejected, clearing cache:", model);
      _cachedChatModel = null;
    }
    console.error("[Groq] AI error:", { status: err.status, message: err.message, model });
    throw new Error("Groq AI analysis error: " + err.message);
  }
}

// ─── Role Gap Analysis + Roadmap Generation ───────────────────────────────────

/**
 * Uses Groq AI to:
 * 1. Analyze the gap between user skills and a target role
 * 2. Generate a personalized learning roadmap for each missing skill
 *
 * @param {string} roleTitle - e.g. "Frontend Developer"
 * @param {string[]} roleSkills - required skills for the role
 * @param {{name:string, level:string}[]} userSkills - user's current skills
 * @returns {Promise<{analysis: object, roadmap: object[]}>}
 */
async function analyzeRoleWithGroq(roleTitle, roleSkills, userSkills) {
  const groq = getGroqClient();
  const model = await resolveChatModel(groq);
  const useJsonMode = JSON_MODE_SUPPORTED.has(model);

  const userSkillNames = userSkills.map((s) => `${s.name} (${s.level})`).join(", ") || "None";
  const missingSkills = roleSkills.filter(
    (rs) => !userSkills.some((us) => us.name.toLowerCase().trim() === rs.toLowerCase().trim())
  );

  if (missingSkills.length === 0) {
    return {
      analysis: {
        summary: `You already have all the required skills for ${roleTitle}. Focus on deepening your expertise.`,
        strengths: userSkills.slice(0, 3).map((s) => s.name),
        priorityGaps: [],
        estimatedWeeks: 0,
      },
      roadmap: [],
      modelUsed: model,
    };
  }

  const systemPrompt =
    "You are a senior software engineering career coach. " +
    "Respond with a single valid JSON object only — no markdown, no explanation.";

  const userPrompt = `
You are helping a developer prepare for the role: "${roleTitle}".

Their current skills: ${userSkillNames}

Required skills for this role: ${roleSkills.join(", ")}

Missing skills they need to learn: ${missingSkills.join(", ")}

Generate a JSON response with this exact structure:
{
  "analysis": {
    "summary": "2-3 sentence personalized assessment of their readiness for this role",
    "strengths": ["skill1", "skill2", "skill3"],
    "priorityGaps": ["most important missing skill", "second most important"],
    "estimatedWeeks": 12
  },
  "roadmap": [
    {
      "skill": "JavaScript",
      "priority": 1,
      "estimatedDays": 14,
      "why": "One sentence explaining why this skill matters for the role",
      "tip": "One practical learning tip specific to this skill",
      "miniProject": "A concrete hands-on project idea to practice this skill",
      "resources": [
        { "name": "MDN Web Docs", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
        { "name": "JavaScript.info", "url": "https://javascript.info/" },
        { "name": "freeCodeCamp JS", "url": "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" }
      ]
    }
  ]
}

Rules:
- roadmap array must contain one entry per missing skill, ordered by learning priority (fundamentals first)
- priority is a number starting from 1 (most important first)
- estimatedDays is a realistic number of days to reach working proficiency
- resources must have exactly 3 items with real, working URLs
- Output valid JSON only, no extra text
`.trim();

  const requestParams = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.3,
    max_tokens: 4096,
  };

  if (useJsonMode) {
    requestParams.response_format = { type: "json_object" };
  }

  try {
    const response = await groq.chat.completions.create(requestParams);
    const raw = response.choices[0]?.message?.content || "";
    const parsed = extractJSON(raw);

    // Validate and sanitize roadmap
    const roadmap = Array.isArray(parsed.roadmap)
      ? parsed.roadmap
          .filter((item) => item && typeof item.skill === "string")
          .map((item, idx) => ({
            skill: item.skill.trim(),
            priority: item.priority || idx + 1,
            estimatedDays: item.estimatedDays || 14,
            why: item.why || `Essential skill for ${roleTitle}.`,
            tip: item.tip || "Focus on fundamentals before advanced topics.",
            miniProject: item.miniProject || "Build a small project applying this skill.",
            resources: Array.isArray(item.resources)
              ? item.resources.slice(0, 3).map((r) => ({
                  name: r.name || "Resource",
                  url: r.url || "https://www.google.com",
                }))
              : [
                  { name: "freeCodeCamp", url: "https://www.freecodecamp.org/" },
                  { name: "MDN Web Docs", url: "https://developer.mozilla.org/" },
                  { name: "YouTube", url: "https://www.youtube.com/" },
                ],
          }))
      : [];

    const analysis = parsed.analysis || {};

    return {
      analysis: {
        summary: analysis.summary || `Gap analysis for ${roleTitle} completed.`,
        strengths: Array.isArray(analysis.strengths) ? analysis.strengths : [],
        priorityGaps: Array.isArray(analysis.priorityGaps) ? analysis.priorityGaps : missingSkills.slice(0, 2),
        estimatedWeeks: analysis.estimatedWeeks || Math.ceil((roadmap.reduce((a, r) => a + r.estimatedDays, 0)) / 7),
      },
      roadmap,
      modelUsed: model,
    };
  } catch (err) {
    const isModelError =
      err.status === 404 ||
      (err.message &&
        (err.message.includes("model_not_found") ||
          err.message.includes("does not support chat completions")));
    if (isModelError) {
      console.warn("[Groq] Model rejected, clearing cache:", model);
      _cachedChatModel = null;
    }
    console.error("[Groq] Role analysis error:", { status: err.status, message: err.message, model });
    throw new Error("Groq AI role analysis error: " + err.message);
  }
}

module.exports = {
  analyzeResumeWithGroq,
  analyzeRoleWithGroq,
  CHAT_MODEL_PREFERENCE,
};
