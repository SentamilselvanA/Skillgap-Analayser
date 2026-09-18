import { useState } from "react";
import { useSkills } from "../context/SkillsContext";
import { useAuth } from "../context/AuthContext";
import { api, isLoggedIn } from "../utils/api";
import { compareSkills } from "../utils/compareSkills";
import { extractSkillsFromJD } from "../utils/extractSkills";
import ProgressBar from "../components/ProgressBar.jsx";
import SkillList from "../components/SkillList.jsx";
import Roadmap from "../components/Roadmap.jsx";
import SummaryReport from "../components/SummaryReport.jsx";

function normalize(s) {
  return String(s || "").toLowerCase().trim();
}

export default function JDAnalyzer() {
  const { user } = useAuth();
  const { skills: userSkills, addSkill, removeSkill, loading: skillsLoading } = useSkills();
  const [jdText, setJdText] = useState("");
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [selectedMissing, setSelectedMissing] = useState([]);
  const [addLevel, setAddLevel] = useState("Intermediate");

  function analyzeJD() {
    const extracted = extractSkillsFromJD(jdText);
    const r = compareSkills(userSkills, extracted);
    setResult({ ...r, extractedSkills: extracted, title: "Job Description", total: extracted.length });
    setSelectedMissing([]);
    setSaveStatus(null);
  }

  function toggleMissing(skill) {
    setSelectedMissing((prev) => {
      const key = normalize(skill);
      const exists = prev.some((x) => normalize(x) === key);
      if (exists) return prev.filter((x) => normalize(x) !== key);
      return [...prev, skill];
    });
  }

  async function addSelectedToMySkills() {
    if (!result || selectedMissing.length === 0) return;
    const existing = new Set(userSkills.map((s) => normalize(s.name)));
    const newOnes = selectedMissing
      .filter((s) => !existing.has(normalize(s)))
      .map((s) => ({ name: s, level: addLevel }));
    for (const s of newOnes) await addSkill(s);
    setSelectedMissing([]);
  }

  async function handleSaveAnalysis() {
    if (!result || !isLoggedIn()) return;
    setSaving(true);
    try {
      await api.analysis.save({
        role_id: "jd-custom",
        role_title: "Custom JD Analysis",
        score: result.score,
        matched_count: result.earned,
        total_count: result.total,
        missing_skills: result.missing,
        // Bug fix: matchedDetailed is now [{skill, level}] objects
        matched_skills: result.matchedDetailed.map(m => m.skill),
      });
      setSaveStatus("success");
    } catch (err) {
      console.error("Save failed:", err);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl">Job Description Analyzer</h2>
        <p className="text-sm mt-1" style={{ color: "var(--tx-secondary)" }}>
          Paste any job description and we'll extract skills, calculate your match, and generate a roadmap.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT */}
        <div className="lg:col-span-1 p-6 space-y-4 shadow-sm"
             style={{ background: "var(--bg-card)", border: "1px solid var(--bd-default)", borderRadius: "1.5rem" }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-medium" style={{ color: "var(--tx-secondary)" }}>My skills</div>
              <div className="text-2xl font-bold" style={{ color: "var(--tx-primary)" }}>{userSkills.length}</div>
            </div>
          </div>

          <div className="rounded-2xl p-4"
               style={{ background: "var(--bg-surface)", border: "1px solid var(--bd-default)" }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--tx-muted)" }}>Quick remove</div>
            <div className="flex flex-wrap gap-2">
              {userSkills.length === 0 ? (
                <div className="text-sm italic" style={{ color: "var(--tx-muted)" }}>No skills yet. Add from Profile.</div>
              ) : (
                userSkills.map((s) => (
                  <span key={s.name}
                        className="group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-all"
                        style={{ border: "1px solid var(--bd-default)", background: "var(--bg-card)" }}>
                    <span style={{ color: "var(--tx-primary)", fontWeight: 500 }}>
                      {s.name}
                      <span className="ml-1 text-xs" style={{ color: "var(--tx-muted)" }}>({s.level})</span>
                    </span>
                    <button onClick={() => removeSkill(s.name)}
                            className="h-5 w-5 grid place-items-center rounded-full transition hover:bg-rose-50 hover:text-rose-600"
                            style={{ border: "1px solid var(--bd-default)", background: "var(--bg-surface)", color: "var(--tx-muted)" }}
                            title="Remove">×</button>
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold ml-1" style={{ color: "var(--tx-secondary)" }}>Paste job description</label>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              rows={10}
              placeholder="Paste the job description here..."
              className="mt-2 w-full rounded-2xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all resize-none shadow-inner"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--bd-default)", color: "var(--tx-primary)" }}
            />
          </div>

          <button onClick={analyzeJD} disabled={jdText.trim().length < 20}
                  className="btn-primary w-full rounded-xl py-3.5 text-sm justify-center disabled:opacity-40 disabled:cursor-not-allowed">
            Analyze job description
          </button>

          {jdText.trim().length > 0 && jdText.trim().length < 20 && (
            <div className="text-xs text-rose-500 text-center font-medium">Paste more text for detection.</div>
          )}
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2 p-6 shadow-sm transition-colors duration-300"
             style={{ background: "var(--bg-card)", border: "1px solid var(--bd-default)", borderRadius: "1.5rem" }}>
          {!result ? (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full flex items-center justify-center mb-4"
                   style={{ background: "var(--bg-surface)" }}>
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     style={{ color: "var(--tx-muted)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-lg font-medium" style={{ color: "var(--tx-secondary)" }}>Ready for extraction</p>
              <p className="text-sm" style={{ color: "var(--tx-muted)" }}>
                Paste a JD and click <span className="font-bold" style={{ color: "var(--tx-primary)" }}>Analyze</span>.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6"
                   style={{ borderBottom: "1px solid var(--bd-subtle)" }}>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--tx-muted)" }}>Results</div>
                  <div className="text-2xl font-black leading-tight" style={{ color: "var(--tx-primary)" }}>{result.total} Skills Found</div>
                </div>

                <div className="flex items-center gap-3">
                  {isLoggedIn() && (
                    <button onClick={handleSaveAnalysis} disabled={saving || saveStatus === "success"}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                              saveStatus === "success"
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                : "btn-primary"
                            }`}>
                      {saving ? <span className="animate-pulse">Saving...</span>
                        : saveStatus === "success" ? (
                          <><svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>Saved</>
                        ) : (
                          <><svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>Save Result</>
                        )}
                    </button>
                  )}
                  <div className="px-4 py-2 rounded-2xl text-sm font-bold"
                       style={{ background: "var(--bg-surface)", border: "1px solid var(--bd-default)", color: "var(--tx-secondary)" }}>
                    Match Score: <span style={{ color: "#3b82f6" }}>{result.score}%</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-3 items-center">
                <div className="sm:col-span-1 flex flex-col items-center sm:items-start">
                  <div className="text-4xl font-black neon-text">{result.score}%</div>
                  <div className="text-sm font-bold uppercase tracking-tighter" style={{ color: "var(--tx-muted)" }}>Profile Match</div>
                </div>
                <div className="sm:col-span-2 space-y-3">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest" style={{ color: "var(--tx-muted)" }}>
                    <span>Score: {result.earned}/{result.total}</span>
                  </div>
                  <ProgressBar value={result.score} />
                </div>
              </div>

              <div className="pt-2">
                <SummaryReport
                  score={result.score}
                  earned={result.earned}
                  total={result.total}
                  matchedDetailed={result.matchedDetailed}
                  missing={result.missing}
                />
              </div>

              <SkillList title="Skills found in JD" items={result.extractedSkills} variant="neutral" />

              <div className="grid gap-6 sm:grid-cols-2">
                <SkillList title="Matched skills (with level)" items={result.matchedDetailed} variant="good" />

                <div className="rounded-3xl p-5"
                     style={{ background: "var(--bg-surface)", border: "1px solid var(--bd-default)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold" style={{ color: "var(--tx-primary)" }}>Missing skills</h3>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                      {result.missing.length} Gaps
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {result.missing.length === 0 ? (
                      <div className="text-sm italic" style={{ color: "var(--tx-muted)" }}>None found. You're a perfect match!</div>
                    ) : (
                      result.missing.map((s) => {
                        const active = selectedMissing.some((x) => normalize(x) === normalize(s));
                        return (
                          <button key={s} onClick={() => toggleMissing(s)}
                                  className={`text-xs font-bold px-3 py-2 rounded-xl border transition-all duration-200 ${
                                    active ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20" : ""
                                  }`}
                                  style={active ? {} : { background: "var(--bg-card)", border: "1px solid var(--bd-default)", color: "var(--tx-secondary)" }}>
                            {s}
                          </button>
                        );
                      })
                    )}
                  </div>

                  {result.missing.length > 0 && (
                    <div className="mt-6 pt-5 space-y-4" style={{ borderTop: "1px solid var(--bd-default)" }}>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: "var(--tx-muted)" }}>Assign Level</label>
                          <select value={addLevel} onChange={(e) => setAddLevel(e.target.value)}
                                  className="w-full rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                                  style={{ background: "var(--bg-card)", border: "1px solid var(--bd-default)", color: "var(--tx-primary)" }}>
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button onClick={addSelectedToMySkills} disabled={selectedMissing.length === 0}
                                  className="btn-primary w-full rounded-xl py-2 text-xs justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                            Update Profile
                          </button>
                        </div>
                      </div>
                      {selectedMissing.length > 0 && (
                        <div className="text-[10px] font-bold italic text-center" style={{ color: "var(--tx-muted)" }}>
                          Adding {selectedMissing.length} skills as {addLevel}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <Roadmap missingSkills={result.missing} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
