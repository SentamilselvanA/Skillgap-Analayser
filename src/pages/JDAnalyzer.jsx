import { useState } from "react";
import { loadSkills, saveSkills } from "../utils/storage";
import { compareSkills } from "../utils/compareSkills";
import { extractSkillsFromJD } from "../utils/extractSkills";
import ProgressBar from "../components/ProgressBar";
import SkillList from "../components/SkillList";
import Roadmap from "../components/Roadmap";
import SummaryReport from "../components/SummaryReport";


function normalize(s) {
  return String(s || "").toLowerCase().trim();
}

export default function JDAnalyzer() {
  const [jdText, setJdText] = useState("");
  const [userSkills, setUserSkills] = useState(() => loadSkills());
  const [result, setResult] = useState(null);

  const [selectedMissing, setSelectedMissing] = useState([]);
  const [addLevel, setAddLevel] = useState("Intermediate");

  function analyzeJD() {
    const extracted = extractSkillsFromJD(jdText);

    // compareSkills expects roleSkills array
    const r = compareSkills(userSkills, extracted);

    setResult({
      ...r,
      extractedSkills: extracted,
      title: "Job Description",
      total: extracted.length,
    });

    setSelectedMissing([]);
  }

  function toggleMissing(skill) {
    setSelectedMissing((prev) => {
      const key = normalize(skill);
      const exists = prev.some((x) => normalize(x) === key);
      if (exists) return prev.filter((x) => normalize(x) !== key);
      return [...prev, skill];
    });
  }

  function addSelectedToMySkills() {
    if (!result || selectedMissing.length === 0) return;

    const existing = new Set(userSkills.map((s) => normalize(s.name)));

    const newOnes = selectedMissing
      .filter((s) => !existing.has(normalize(s)))
      .map((s) => ({ name: s, level: addLevel }));

    const updated = [...userSkills, ...newOnes];

    setUserSkills(updated);
    saveSkills(updated);

    // rerun analysis after adding
    const r2 = compareSkills(updated, result.extractedSkills || []);
    setResult({
      ...r2,
      extractedSkills: result.extractedSkills || [],
      title: "Job Description",
      total: (result.extractedSkills || []).length,
    });

    setSelectedMissing([]);
  }

  function removeMySkill(skillName) {
    const updated = userSkills.filter((s) => normalize(s.name) !== normalize(skillName));
    setUserSkills(updated);
    saveSkills(updated);

    if (result?.extractedSkills) {
      const r2 = compareSkills(updated, result.extractedSkills);
      setResult({
        ...r2,
        extractedSkills: result.extractedSkills,
        title: "Job Description",
        total: result.extractedSkills.length,
      });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Job Description Analyzer</h2>
        <p className="text-sm text-slate-400">
          Paste any job description and we’ll extract skills, calculate your match, and generate a roadmap.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* LEFT */}
        <div className="lg:col-span-1 rounded-3xl border border-slate-800 bg-slate-950 p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm text-slate-400">My skills</div>
              <div className="text-xl font-semibold">{userSkills.length}</div>
            </div>
          </div>

          {/* My Skills quick remove */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <div className="text-sm text-slate-400 mb-3">Quick remove</div>
            <div className="flex flex-wrap gap-2">
              {userSkills.length === 0 ? (
                <div className="text-sm text-slate-400">No skills yet. Add from Profile or from missing skills.</div>
              ) : (
                userSkills.map((s) => (
                  <span
                    key={s.name}
                    className="group inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-sm"
                  >
                    <span className="text-slate-200">
                      {s.name}
                      <span className="text-slate-400"> ({s.level})</span>
                    </span>
                    <button
                      onClick={() => removeMySkill(s.name)}
                      className="h-5 w-5 grid place-items-center rounded-full border border-slate-700 bg-slate-950 text-slate-300
                                 hover:bg-rose-950/50 hover:border-rose-700 hover:text-rose-200 transition"
                      title="Remove from my skills"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-300">Paste job description</label>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              rows={10}
              placeholder="Paste the job description here..."
              className="mt-2 w-full rounded-2xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm outline-none focus:border-slate-600 resize-none"
            />
          </div>

          <button
            onClick={analyzeJD}
            disabled={jdText.trim().length < 20}
            className="w-full rounded-xl px-4 py-3 text-sm font-semibold bg-white text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
          >
            Analyze job description
          </button>

          {jdText.trim().length > 0 && jdText.trim().length < 20 && (
            <div className="text-xs text-slate-500">Paste a bit more text for better detection.</div>
          )}
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-950 p-6">
          {!result ? (
            <div className="text-slate-400">
              Paste a JD and click <span className="text-slate-200 font-semibold">Analyze job description</span>.
            </div>
          ) : (
            <div className="space-y-6">
              {/* extracted summary */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm text-slate-400">Extracted skills</div>
                  <div className="text-xl font-bold">{result.total}</div>
                </div>
                <div className="text-sm text-slate-300">
                  Match: <span className="font-semibold text-white">{result.score}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-slate-300">Match score</div>
                  <div className="font-semibold">{result.score}%</div>
                </div>
                <div className="text-xs text-slate-500">
                  Weighted points:{" "}
                  <span className="text-slate-200 font-semibold">{result.earned}</span> /{" "}
                  <span className="text-slate-200 font-semibold">{result.total}</span>
                </div>
                <ProgressBar value={result.score} />
                <div className="mt-4">
  <SummaryReport
    score={result.score}
    earned={result.earned}
    total={result.total}
    matchedDetailed={result.matchedDetailed}
    missing={result.missing}
  />
</div>

              </div>

              {/* extracted skills list */}
              <SkillList title="Skills found in JD" items={result.extractedSkills} variant="neutral" />

              <div className="grid gap-4 sm:grid-cols-2">
                <SkillList title="Matched skills (with level)" items={result.matchedDetailed} variant="good" />

                {/* Interactive Missing */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Missing skills</h3>
                    <span className="text-xs px-2 py-1 rounded-full border bg-rose-950/40 border-rose-900 text-rose-200">
                      {result.missing.length}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.missing.length === 0 ? (
                      <div className="text-sm text-slate-400">None</div>
                    ) : (
                      result.missing.map((s) => {
                        const active = selectedMissing.some((x) => normalize(x) === normalize(s));
                        return (
                          <button
                            key={s}
                            onClick={() => toggleMissing(s)}
                            className={[
                              "text-sm px-3 py-1.5 rounded-full border transition",
                              active
                                ? "bg-white text-slate-950 border-white"
                                : "bg-rose-950/40 border-rose-900 text-rose-200 hover:bg-rose-950/60",
                            ].join(" ")}
                            title="Click to select"
                          >
                            {s}
                          </button>
                        );
                      })
                    )}
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3 sm:items-end">
                    <div className="sm:col-span-1">
                      <label className="text-xs text-slate-400">Your current level</label>
                      <select
                        value={addLevel}
                        onChange={(e) => setAddLevel(e.target.value)}
                        className="mt-2 w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-sm outline-none focus:border-slate-600"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>

                    <button
                      onClick={addSelectedToMySkills}
                      disabled={selectedMissing.length === 0}
                      className="sm:col-span-1 rounded-xl px-4 py-2 text-sm font-semibold bg-white text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
                    >
                      Add to my skills
                    </button>

                    <button
                      onClick={() => setSelectedMissing([])}
                      disabled={selectedMissing.length === 0}
                      className="sm:col-span-1 rounded-xl px-4 py-2 text-sm border border-slate-800 bg-slate-950 hover:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      Clear selection
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Roadmap missingSkills={result.missing} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
