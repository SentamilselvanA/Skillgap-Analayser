import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSkills } from "../context/SkillsContext";
import SkillTagInput from "../components/SkillTagInput.jsx";
import ResumeUploadCard from "../components/ResumeUploadCard.jsx";
import { api, isLoggedIn } from "../utils/api";

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

export default function Profile() {
  const { skills, addSkill, addMultipleSkills, removeSkill, clearAll, loading } = useSkills();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      setLoadingHistory(true);
      api.analysis.getHistory()
        .then(setHistory)
        .catch(console.error)
        .finally(() => setLoadingHistory(false));
    }
  }, []);

  async function deleteRecord(id) {
    try {
      await api.analysis.delete(id);
      setHistory((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm font-bold uppercase tracking-widest animate-pulse"
           style={{ color: "var(--tx-muted)" }}>
        Synchronizing Inventory…
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 animate-in">

      {/* ── Skills Input ─────────────────────────────────────── */}
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl">Your Skills</h2>
            <p className="text-sm mt-1" style={{ color: "var(--tx-secondary)" }}>
              Upload your resume to automatically detect skills or add them manually below.
            </p>
          </div>
          {isLoggedIn() && (
            <button onClick={clearAll} className="btn-ghost px-5 py-2.5 rounded-xl text-sm">
              Clear all
            </button>
          )}
        </div>

        {isLoggedIn() ? (
          <div className="space-y-6">
            {/* AI Resume Upload Card */}
            <ResumeUploadCard
              userSkills={skills}
              onSkillsAdded={addMultipleSkills}
            />

            {/* Manual Skills Editor */}
            <div style={card} className="p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold" style={{ color: "var(--tx-primary)" }}>
                  Current Skills Inventory ({skills.length})
                </h3>
              </div>
              <SkillTagInput skills={skills} onAdd={addSkill} onRemove={removeSkill} />
            </div>
          </div>
        ) : (
          /* ── Guest gate ── */
          <div className="rounded-3xl p-10 text-center space-y-5" style={card}>
            {/* Lock icon */}
            <div className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center"
                 style={{ background: "var(--bg-surface)", border: "1px solid var(--bd-default)" }}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                   style={{ color: "var(--tx-muted)" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-1" style={{ color: "var(--tx-primary)" }}>
                Sign in to manage your skills
              </h3>
              <p className="text-sm max-w-sm mx-auto" style={{ color: "var(--tx-secondary)" }}>
                Create a free account to build your skill inventory, track progress,
                and save analysis results across sessions.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                onClick={() => navigate("/login")}
                className="btn-ghost px-6 py-2.5 rounded-xl text-sm"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate("/register")}
                className="btn-primary px-6 py-2.5 rounded-xl text-sm"
              >
                Create free account →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Analysis History ─────────────────────────────────── */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl">Analysis History</h3>
          <p className="text-sm mt-1" style={{ color: "var(--tx-secondary)" }}>
            Your saved role comparisons and JD scores.
          </p>
        </div>

        {isLoggedIn() ? (
          loadingHistory ? (
            <div className="py-10 text-center text-sm italic"
                 style={{ color: "var(--tx-muted)" }}>
              Loading history…
            </div>
          ) : history.length === 0 ? (
            <div className="p-12 text-center rounded-3xl"
                 style={{
                   border: "2px dashed var(--bd-default)",
                   color: "var(--tx-muted)",
                 }}>
              No saved analysis yet. Run an analysis and click "Save Result".
            </div>
          ) : (
            <div className="grid gap-4">
              {history.map((h) => (
                <div key={h.id}
                     className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6
                                transition-all hover:shadow-md neon-hover"
                     style={card}>
                  <div className="space-y-1">
                    <div className="text-lg font-bold" style={{ color: "var(--tx-primary)" }}>
                      {h.role_title}
                    </div>
                    <div className="text-xs font-medium uppercase tracking-widest"
                         style={{ color: "var(--tx-muted)" }}>
                      {new Date(h.created_at).toLocaleDateString()} • {h.matched_count}/{h.total_count} Skills
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-2xl font-black neon-text">{h.score}%</div>
                      <div className="text-[10px] font-black uppercase tracking-tighter"
                           style={{ color: "var(--tx-muted)" }}>
                        Match
                      </div>
                    </div>
                    <button
                      onClick={() => deleteRecord(h.id)}
                      className="p-2.5 rounded-xl transition-all
                                 hover:bg-rose-50 hover:text-rose-600"
                      style={{
                        border: "1px solid var(--bd-default)",
                        color: "var(--tx-muted)",
                      }}
                      title="Delete Record"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* "Login to save" box — uses var(--bg-surface) not harsh white */
          <div className="rounded-3xl p-8 text-center" style={surface}>
            <p className="text-sm mb-4" style={{ color: "var(--tx-secondary)" }}>
              Login to save and track your analysis history.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="btn-primary px-6 py-2.5 rounded-xl text-sm"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
