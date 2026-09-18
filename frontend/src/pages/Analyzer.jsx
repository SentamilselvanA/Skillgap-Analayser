import { useMemo, useState } from "react";
import { roles } from "../data/rolesMock";
import { useSkills } from "../context/SkillsContext";
import { useAuth } from "../context/AuthContext";
import { api, isLoggedIn } from "../utils/api";
import { compareSkills } from "../utils/compareSkills";
import ProgressBar from "../components/ProgressBar.jsx";
import SkillList from "../components/SkillList.jsx";
import Roadmap from "../components/Roadmap.jsx";

function normalize(s) {
  return String(s || "").toLowerCase().trim();
}

const card = {
  background: "var(--bg-card)",
  border: "1px solid var(--bd-default)",
  borderRadius: "1.5rem",
};

const surface = {
  background: "var(--bg-surface)",
  border: "1px solid var(--bd-default)",
  borderRadius: "1rem",
};

const inputCls =
  "w-full rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all " +
  "focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500";

export default function Analyzer() {
  const { user } = useAuth();
  const { skills: userSkills, addSkill, removeSkill, clearAll } = useSkills();
  const [roleId, setRoleId] = useState(roles[0]?.id || "");
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [selectedMissing, setSelectedMissing] = useState([]);
  const [addLevel, setAddLevel] = useState("Intermediate");

  // AI state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRoadmap, setAiRoadmap] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiError, setAiError] = useState("");

  const selectedRole = useMemo(() => roles.find((r) => r.id === roleId), [roleId]);

  function analyze() {
    const roleSkills = selectedRole?.skills || [];
    const r = compareSkills(userSkills, roleSkills);
    setResult({ ...r, roleTitle: selectedRole?.title || "Unknown role", total: roleSkills.length });
    setSaveStatus(null);
    // Reset AI results when re-analyzing
    setAiRoadmap(null);
    setAiAnalysis(null);
    setAiError("");
  }

  async function handleGroqAnalyze() {
    if (!result || !selectedRole) return;
    setAiLoading(true);
    setAiError("");
    setAiRoadmap(null);
    setAiAnalysis(null);
    try {
      const data = await api.analysis.groqAnalyze({
        roleId: selectedRole.id,
        roleTitle: selectedRole.title,
        roleSkills: selectedRole.skills,
        userSkills: userSkills.map((s) => ({ name: s.name, level: s.level })),
      });
      setAiRoadmap(data.roadmap || []);
      setAiAnalysis(data.analysis || null);
    } catch (err) {
      console.error("Analyze failed:", err);
      setAiError(err.message || "AI analysis failed. Please try again.");
    } finally {
      setAiLoading(false);
    }
  }

  const hasSkills = userSkills.length > 0;

  function toggleMissing(skill) {
    setSelectedMissing((prev) => {
      const key = normalize(skill);
      return prev.some((x) => normalize(x) === key)
        ? prev.filter((x) => normalize(x) !== key)
        : [...prev, skill];
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
        role_id: roleId,
        role_title: result.roleTitle,
        score: result.score,
        matched_count: result.earned,
        total_count: result.total,
        missing_skills: result.missing,
        matched_skills: result.matchedDetailed.map((m) => m.skill),
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
    <div className="space-y-6 animate-in">
      <div>
        <h2 className="text-2xl">Role Analyzer</h2>
        <p className="text-sm mt-1" style={{ color: "var(--tx-secondary)" }}>
          Select a role, compare your skills, then generate an AI-powered roadmap.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* ── LEFT PANEL ───────────────────────────────────── */}
        <div className="lg:col-span-1 p-6 space-y-4 shadow-sm" style={card}>

          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-medium" style={{ color: "var(--tx-secondary)" }}>My skills</div>
              <div className="text-2xl font-bold" style={{ color: "var(--tx-primary)" }}>{userSkills.length}</div>
            </div>
            <button onClick={clearAll} disabled={userSkills.length === 0}
                    className="btn-ghost text-xs px-3 py-2 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed">
              Clear all
            </button>
          </div>

          <div className="p-4" style={surface}>
            <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--tx-muted)" }}>
              Quick remove
            </div>
            <div className="flex flex-wrap gap-2">
              {userSkills.length === 0 ? (
                <div className="text-sm italic" style={{ color: "var(--tx-muted)" }}>
                  No skills yet. Add from Profile.
                </div>
              ) : (
                userSkills.map((s) => (
                  <span key={s.name} className="group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm"
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
            <label className="text-sm font-bold ml-1" style={{ color: "var(--tx-secondary)" }}>Target role</label>
            <select value={roleId}
                    onChange={(e) => { setRoleId(e.target.value); setResult(null); setSelectedMissing([]); setAiRoadmap(null); setAiAnalysis(null); }}
                    className={inputCls}
                    style={{ background: "var(--bg-surface)", border: "1px solid var(--bd-default)", color: "var(--tx-primary)" }}>
              {roles.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
            </select>
          </div>

          <button onClick={analyze} disabled={!hasSkills}
                  className="btn-primary w-full rounded-xl py-3.5 text-sm justify-center disabled:opacity-40 disabled:cursor-not-allowed">
            Compare now
          </button>

          {!hasSkills && (
            <div className="text-xs text-center font-medium text-rose-500">
              Add your skills in the Profile page first.
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL ──────────────────────────────────── */}
        <div className="lg:col-span-2 p-6 shadow-sm transition-colors duration-300" style={card}>
          {!result ? (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full flex items-center justify-center mb-4"
                   style={{ background: "var(--bg-surface)" }}>
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     style={{ color: "var(--tx-muted)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-lg font-medium" style={{ color: "var(--tx-secondary)" }}>Ready for analysis</p>
              <p className="text-sm mt-1" style={{ color: "var(--tx-muted)" }}>
                Click <span className="font-bold" style={{ color: "var(--tx-primary)" }}>Compare now</span> to see how you match up.
              </p>
            </div>
          ) : (
            <div className="space-y-8">

              {/* Header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6"
                   style={{ borderBottom: "1px solid var(--bd-subtle)" }}>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--tx-muted)" }}>
                    Target Analysis
                  </div>
                  <div className="text-2xl font-black" style={{ color: "var(--tx-primary)" }}>{result.roleTitle}</div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {isLoggedIn() && (
                    <button onClick={handleSaveAnalysis} disabled={saving || saveStatus === "success"}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                              saveStatus === "success"
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                : "btn-primary"
                            }`}>
                      {saving ? <span className="animate-pulse">Saving…</span>
                        : saveStatus === "success" ? (
                          <><svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>Saved</>
                        ) : (
                          <><svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>Save Result</>
                        )}
                    </button>
                  )}
                  <div className="px-4 py-2 rounded-2xl text-sm font-bold"
                       style={{ background: "var(--bg-surface)", border: "1px solid var(--bd-default)", color: "var(--tx-secondary)" }}>
                    {result.total} Skills Required
                  </div>
                </div>
              </div>

              {/* Score */}
              <div className="grid gap-6 sm:grid-cols-3 items-center">
                <div className="sm:col-span-1 flex flex-col items-center sm:items-start">
                  <div className="text-4xl font-black neon-text">{result.score}%</div>
                  <div className="text-sm font-bold uppercase tracking-tighter" style={{ color: "var(--tx-muted)" }}>
                    Match Score
                  </div>
                </div>
                <div className="sm:col-span-2 space-y-3">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest" style={{ color: "var(--tx-muted)" }}>
                    <span>Earned {result.earned} pts</span>
                    <span>Goal {result.total} pts</span>
                  </div>
                  <ProgressBar value={result.score} />
                </div>
              </div>

              {/* Matched + Missing */}
              <div className="grid gap-6 sm:grid-cols-2">
                <SkillList title="Matched skills (with level)" items={result.matchedDetailed} variant="good" />

                <div className="p-5 rounded-3xl" style={surface}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold" style={{ color: "var(--tx-primary)" }}>Missing skills</h3>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                      {result.missing.length} Left
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {result.missing.length === 0 ? (
                      <div className="text-sm italic" style={{ color: "var(--tx-muted)" }}>No missing skills. Great job!</div>
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
                          <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: "var(--tx-muted)" }}>
                            Assign Level
                          </label>
                          <select value={addLevel} onChange={(e) => setAddLevel(e.target.value)}
                                  className={inputCls + " text-xs font-bold"}
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

              {/* ── Groq AI Roadmap Section ─────────────────── */}
              {result.missing.length > 0 && (
                <div className="pt-2 space-y-4">
                  {/* Generate button */}
                  {!aiRoadmap && !aiLoading && (
                    <div className="flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl"
                         style={{ background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.15)" }}>
                      <div className="flex-1">
                        <div className="text-sm font-bold" style={{ color: "var(--tx-primary)" }}>
                          Generate AI-Powered Roadmap
                        </div>
                        <div className="text-xs mt-1" style={{ color: "var(--tx-secondary)" }}>
                          Let Groq AI create a personalized learning path with resources, tips, and projects for your {result.missing.length} missing skills.
                        </div>
                      </div>
                      <button onClick={handleGroqAnalyze}
                              className="btn-primary rounded-xl px-6 py-3 text-sm flex items-center gap-2 shrink-0 shadow-lg shadow-violet-500/20">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Generate with AI
                      </button>
                    </div>
                  )}

                  {/* Loading state */}
                  {aiLoading && (
                    <div className="flex items-center justify-center gap-3 p-8 rounded-2xl"
                         style={{ background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.15)" }}>
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span className="text-sm font-medium" style={{ color: "var(--tx-secondary)" }}>
                         AI is generating your personalized roadmap…
                      </span>
                    </div>
                  )}

                  {/* Error */}
                  {aiError && (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center justify-between gap-3">
                      <span>{aiError}</span>
                      <button onClick={handleGroqAnalyze} className="font-bold underline shrink-0">Retry</button>
                    </div>
                  )}

                  {/* AI Roadmap */}
                  <Roadmap missingSkills={result.missing} aiRoadmap={aiRoadmap} aiAnalysis={aiAnalysis} />
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
