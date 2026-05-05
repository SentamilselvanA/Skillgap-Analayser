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
  const { skills: userSkills, addSkill, removeSkill, clearAll, loading: skillsLoading } = useSkills();
  const [roleId, setRoleId] = useState(roles[0]?.id || "");
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [selectedMissing, setSelectedMissing] = useState([]);
  const [addLevel, setAddLevel] = useState("Intermediate");

  const selectedRole = useMemo(() => roles.find((r) => r.id === roleId), [roleId]);

  function analyze() {
    const roleSkills = selectedRole?.skills || [];
    const r = compareSkills(userSkills, roleSkills);
    setResult({ ...r, roleTitle: selectedRole?.title || "Unknown role", total: roleSkills.length });
    setSaveStatus(null);
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
          Select a role and compare it with your current skills.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* ── LEFT PANEL ───────────────────────────────────── */}
        <div className="lg:col-span-1 p-6 space-y-4 shadow-sm" style={card}>

          {/* Skill count + clear */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-medium" style={{ color: "var(--tx-secondary)" }}>
                My skills
              </div>
              <div className="text-2xl font-bold" style={{ color: "var(--tx-primary)" }}>
                {userSkills.length}
              </div>
            </div>
            <button
              onClick={clearAll}
              disabled={userSkills.length === 0}
              className="btn-ghost text-xs px-3 py-2 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Clear all
            </button>
          </div>

          {/* Quick remove chips */}
          <div className="p-4" style={surface}>
            <div className="text-xs font-bold uppercase tracking-wider mb-3"
                 style={{ color: "var(--tx-muted)" }}>
              Quick remove
            </div>
            <div className="flex flex-wrap gap-2">
              {userSkills.length === 0 ? (
                <div className="text-sm italic" style={{ color: "var(--tx-muted)" }}>
                  No skills yet. Add from Profile or analyzer.
                </div>
              ) : (
                userSkills.map((s) => (
                  <span key={s.name}
                        className="group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm"
                        style={{ border: "1px solid var(--bd-default)", background: "var(--bg-card)" }}>
                    <span style={{ color: "var(--tx-primary)", fontWeight: 500 }}>
                      {s.name}
                      <span className="ml-1 text-xs" style={{ color: "var(--tx-muted)" }}>
                        ({s.level})
                      </span>
                    </span>
                    <button
                      onClick={() => removeSkill(s.name)}
                      className="h-5 w-5 grid place-items-center rounded-full transition
                                 hover:bg-rose-50 hover:text-rose-600"
                      style={{
                        border: "1px solid var(--bd-default)",
                        background: "var(--bg-surface)",
                        color: "var(--tx-muted)",
                      }}
                      title="Remove"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Role select */}
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1" style={{ color: "var(--tx-secondary)" }}>
              Target role
            </label>
            <select
              value={roleId}
              onChange={(e) => { setRoleId(e.target.value); setResult(null); setSelectedMissing([]); }}
              className={inputCls}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--bd-default)",
                color: "var(--tx-primary)",
              }}
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>{r.title}</option>
              ))}
            </select>
          </div>

          {/* Analyze button */}
          <button
            onClick={analyze}
            disabled={!hasSkills}
            className="btn-primary w-full rounded-xl py-3.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
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
            /* Empty state */
            <div className="h-full flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full flex items-center justify-center mb-4"
                   style={{ background: "var(--bg-surface)" }}>
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     style={{ color: "var(--tx-muted)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-lg font-medium" style={{ color: "var(--tx-secondary)" }}>
                Ready for analysis
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--tx-muted)" }}>
                Click{" "}
                <span className="font-bold" style={{ color: "var(--tx-primary)" }}>Compare now</span>
                {" "}to see how you match up.
              </p>
            </div>
          ) : (
            <div className="space-y-8">

              {/* Result header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6"
                   style={{ borderBottom: "1px solid var(--bd-subtle)" }}>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest mb-1"
                       style={{ color: "var(--tx-muted)" }}>
                    Target Analysis
                  </div>
                  <div className="text-2xl font-black" style={{ color: "var(--tx-primary)" }}>
                    {result.roleTitle}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isLoggedIn() && (
                    <button
                      onClick={handleSaveAnalysis}
                      disabled={saving || saveStatus === "success"}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        saveStatus === "success"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "btn-primary"
                      }`}
                    >
                      {saving ? (
                        <span className="animate-pulse">Saving…</span>
                      ) : saveStatus === "success" ? (
                        <>
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                          Saved
                        </>
                      ) : (
                        <>
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                          </svg>
                          Save Result
                        </>
                      )}
                    </button>
                  )}
                  <div className="px-4 py-2 rounded-2xl text-sm font-bold"
                       style={{
                         background: "var(--bg-surface)",
                         border: "1px solid var(--bd-default)",
                         color: "var(--tx-secondary)",
                       }}>
                    {result.total} Skills Required
                  </div>
                </div>
              </div>

              {/* Score */}
              <div className="grid gap-6 sm:grid-cols-3 items-center">
                <div className="sm:col-span-1 flex flex-col items-center sm:items-start">
                  <div className="text-4xl font-black neon-text">{result.score}%</div>
                  <div className="text-sm font-bold uppercase tracking-tighter"
                       style={{ color: "var(--tx-muted)" }}>
                    Match Score
                  </div>
                </div>
                <div className="sm:col-span-2 space-y-3">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest"
                       style={{ color: "var(--tx-muted)" }}>
                    <span>Earned {result.earned} pts</span>
                    <span>Goal {result.total} pts</span>
                  </div>
                  <ProgressBar value={result.score} />
                </div>
              </div>

              {/* Matched + Missing */}
              <div className="grid gap-6 sm:grid-cols-2">
                <SkillList title="Matched skills (with level)" items={result.matchedDetailed} variant="good" />

                {/* Missing skills */}
                <div className="p-5 rounded-3xl" style={surface}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold" style={{ color: "var(--tx-primary)" }}>Missing skills</h3>
                    <span className="text-xs font-bold px-3 py-1 rounded-full
                                     bg-rose-50 text-rose-600 border border-rose-200">
                      {result.missing.length} Left
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {result.missing.length === 0 ? (
                      <div className="text-sm italic" style={{ color: "var(--tx-muted)" }}>
                        No missing skills found. Great job!
                      </div>
                    ) : (
                      result.missing.map((s) => {
                        const active = selectedMissing.some((x) => normalize(x) === normalize(s));
                        return (
                          <button
                            key={s}
                            onClick={() => toggleMissing(s)}
                            className="text-xs font-bold px-3 py-2 rounded-xl border transition-all duration-200"
                            style={active ? {} : {
                              background: "var(--bg-card)",
                              border: "1px solid var(--bd-default)",
                              color: "var(--tx-secondary)",
                            }}
                            {...(active ? { className: "text-xs font-bold px-3 py-2 rounded-xl border transition-all duration-200 bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20" } : {})}
                          >
                            {s}
                          </button>
                        );
                      })
                    )}
                  </div>

                  {result.missing.length > 0 && (
                    <div className="mt-8 pt-6 space-y-4"
                         style={{ borderTop: "1px solid var(--bd-default)" }}>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest ml-1"
                                 style={{ color: "var(--tx-muted)" }}>
                            Assign Level
                          </label>
                          <select
                            value={addLevel}
                            onChange={(e) => setAddLevel(e.target.value)}
                            className={inputCls + " text-xs font-bold"}
                            style={{
                              background: "var(--bg-card)",
                              border: "1px solid var(--bd-default)",
                              color: "var(--tx-primary)",
                            }}
                          >
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={addSelectedToMySkills}
                            disabled={selectedMissing.length === 0}
                            className="btn-primary w-full rounded-xl py-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Update Profile
                          </button>
                        </div>
                      </div>
                      {selectedMissing.length > 0 && (
                        <div className="text-[10px] font-bold italic text-center"
                             style={{ color: "var(--tx-muted)" }}>
                          Adding {selectedMissing.length} skills as {addLevel}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Roadmap */}
              <div className="pt-4">
                <Roadmap missingSkills={result.missing} />
              </div>

              {/* Next Steps */}
              <div className="p-6 rounded-3xl" style={surface}>
                <div className="flex items-center gap-2 font-bold mb-3"
                     style={{ color: "var(--tx-primary)" }}>
                  <svg className="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                  Next Steps
                </div>
                <ul className="grid gap-3 text-sm" style={{ color: "var(--tx-secondary)" }}>
                  {[
                    "Focus on 1–2 key missing skills and start a hands-on project.",
                    "Update your profile periodically as you advance in levels.",
                    "Aim for an 80%+ match to be competitive for this role.",
                  ].map((tip, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="h-5 w-5 shrink-0 rounded-full flex items-center justify-center text-[10px] font-black"
                            style={{ background: "var(--bg-card)", border: "1px solid var(--bd-default)", color: "var(--tx-primary)" }}>
                        {i + 1}
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
