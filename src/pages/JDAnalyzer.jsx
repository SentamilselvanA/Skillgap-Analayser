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
    setResult({
      ...r,
      extractedSkills: extracted,
      title: "Job Description",
      total: extracted.length,
    });
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

    for (const s of newOnes) {
      await addSkill(s);
    }

    setSelectedMissing([]);
    // Result will be re-analyzed reactively if we trigger it or rely on deps
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
        matched_skills: result.matchedDetailed.map(m => m.skill)
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
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Job Description Analyzer</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Paste any job description and we’ll extract skills, calculate your match, and generate a roadmap.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT */}
        <div className="lg:col-span-1 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 space-y-4 shadow-sm dark:shadow-none">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">My skills</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{userSkills.length}</div>
            </div>
          </div>

          {/* My Skills quick remove */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Quick remove</div>
            <div className="flex flex-wrap gap-2">
              {userSkills.length === 0 ? (
                <div className="text-sm text-slate-400 italic">No skills yet. Add from Profile or from missing skills.</div>
              ) : (
                userSkills.map((s) => (
                  <span
                    key={s.name}
                    className="group inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 px-3 py-1.5 text-sm transition-all"
                  >
                    <span className="text-slate-700 dark:text-slate-200 font-medium">
                      {s.name}
                      <span className="text-slate-400 dark:text-slate-500 ml-1 text-xs">({s.level})</span>
                    </span>
                        <button
                          onClick={() => removeSkill(s.name)}
                          className="h-5 w-5 grid place-items-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-400
                                     hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:border-rose-200 dark:hover:border-rose-700 hover:text-rose-600 dark:hover:text-rose-200 transition"
                          title="Remove from my skills"
                        >
                          ×
                        </button>

                  </span>
                ))
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Paste job description</label>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              rows={10}
              placeholder="Paste the job description here..."
              className="mt-2 w-full rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all resize-none shadow-inner"
            />
          </div>

          <button
            onClick={analyzeJD}
            disabled={jdText.trim().length < 20}
            className="w-full rounded-xl px-4 py-3.5 text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-slate-950/10 dark:shadow-white/5"
          >
            Analyze job description
          </button>

          {jdText.trim().length > 0 && jdText.trim().length < 20 && (
            <div className="text-xs text-rose-600 dark:text-rose-400 text-center font-medium">Paste more text for detection.</div>
          )}
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm dark:shadow-none transition-colors duration-300">
          {!result ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-4">
                 <svg className="h-8 w-8 text-slate-300 dark:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                 </svg>
              </div>
              <p className="text-lg font-medium text-slate-500 dark:text-slate-400 ml-1">Ready for extraction</p>
              <p className="text-sm">Paste a JD and click <span className="text-slate-900 dark:text-white font-bold">Analyze</span>.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* extracted summary */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-900 pb-6">
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Results</div>
                      <div className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{result.total} Skills Found</div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {isLoggedIn() && (
                        <button
                          onClick={handleSaveAnalysis}
                          disabled={saving || saveStatus === "success"}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                            saveStatus === "success" 
                              ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800"
                              : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                          }`}
                        >
                          {saving ? (
                            <span className="animate-pulse">Saving...</span>
                          ) : saveStatus === "success" ? (
                            <>
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                              Saved
                            </>
                          ) : (
                            <>
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                              Save Result
                            </>
                          )}
                        </button>
                      )}
                      
                      <div className="px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300">
                        Match Score: <span className="text-blue-600 dark:text-blue-400">{result.score}%</span>
                      </div>
                    </div>
                  </div>


              <div className="grid gap-6 sm:grid-cols-3 items-center">
                 <div className="sm:col-span-1 flex flex-col items-center sm:items-start">
                    <div className="text-4xl font-black text-blue-600 dark:text-blue-400">{result.score}%</div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-tighter">Profile Match</div>
                 </div>
                 <div className="sm:col-span-2 space-y-3">
                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
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

              {/* extracted skills list */}
              <SkillList title="Skills found in JD" items={result.extractedSkills} variant="neutral" />

              <div className="grid gap-6 sm:grid-cols-2">
                <SkillList title="Matched skills (with level)" items={result.matchedDetailed} variant="good" />

                {/* Interactive Missing */}
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900 dark:text-white">Missing skills</h3>
                    <span className="text-xs font-bold px-3 py-1 rounded-full border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-200">
                      {result.missing.length} Gaps
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {result.missing.length === 0 ? (
                      <div className="text-sm text-slate-400 italic">None found. You're a perfect match!</div>
                    ) : (
                      result.missing.map((s) => {
                        const active = selectedMissing.some((x) => normalize(x) === normalize(s));
                        return (
                          <button
                            key={s}
                            onClick={() => toggleMissing(s)}
                            className={[
                              "text-xs font-bold px-3 py-2 rounded-xl border transition-all duration-200",
                              active
                                ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
                                : "bg-white dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-400 dark:hover:border-blue-700",
                            ].join(" ")}
                          >
                            {s}
                          </button>
                        );
                      })
                    )}
                  </div>

                  {result.missing.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign Level</label>
                          <select
                            value={addLevel}
                            onChange={(e) => setAddLevel(e.target.value)}
                            className="w-full rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-medium"
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
                            className="w-full rounded-xl py-2 text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-950 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-md"
                          >
                            Update Profile
                          </button>
                        </div>
                      </div>
                      {selectedMissing.length > 0 && (
                         <div className="text-[10px] text-slate-400 font-bold italic text-center">
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
