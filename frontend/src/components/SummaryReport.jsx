const LEVEL_WEIGHT = { Beginner: 1, Intermediate: 2, Advanced: 3 };

function estimateScoreIfLearned({ total = 0, earned = 0, toLearnCount = 0, assumedLevel = "Intermediate" }) {
  const add = (LEVEL_WEIGHT[assumedLevel] || 0) / 3;
  const newEarned = earned + toLearnCount * add;
  return total === 0 ? 0 : Math.min(100, Math.round((newEarned / total) * 100));
}

export default function SummaryReport({ score = 0, earned = 0, total = 0, matchedDetailed = [], missing = [] }) {
  const parsed = matchedDetailed
    .filter((x) => x && typeof x === "object" && x.skill)
    .map((x) => ({ skill: x.skill, level: x.level, w: LEVEL_WEIGHT[x.level] || 0 }));

  const strongest = [...parsed]
    .sort((a, b) => b.w - a.w || a.skill.localeCompare(b.skill))
    .slice(0, 3)
    .map((x) => x.skill);

  const focusNext = (missing || []).slice(0, 2);
  const est = estimateScoreIfLearned({ total, earned, toLearnCount: focusNext.length, assumedLevel: "Intermediate" });

  if (total === 0) return null;

  return (
    <div className="rounded-3xl p-8 shadow-sm space-y-6 transition-all duration-300"
         style={{ background: "var(--bg-card)", border: "1px solid var(--bd-default)" }}>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-1"
               style={{ color: "var(--tx-muted)" }}>Analysis Snapshot</div>
          <h3 className="text-2xl font-black leading-tight" style={{ color: "var(--tx-primary)" }}>
            Match Score: <span style={{ color: "#3b82f6" }}>{score}%</span>
          </h3>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest"
             style={{ background: "var(--bg-surface)", border: "1px solid var(--bd-default)", color: "var(--tx-secondary)" }}>
          {earned} / {total} Skill points
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Top Assets */}
        <div className="rounded-2xl p-5 space-y-4"
             style={{ background: "var(--bg-surface)", border: "1px solid var(--bd-default)" }}>
          <div className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--tx-muted)" }}>Top Assets</div>
          <div className="space-y-3">
            {strongest.length ? (
              <div className="flex flex-wrap gap-2">
                {strongest.map((s) => (
                  <span key={s} className="text-[10px] font-bold px-3 py-1.5 rounded-lg"
                        style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981" }}>
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-xs italic" style={{ color: "var(--tx-muted)" }}>No validated skills yet.</div>
            )}
          </div>
        </div>

        {/* Growth Priority */}
        <div className="rounded-2xl p-5 space-y-4"
             style={{ background: "var(--bg-surface)", border: "1px solid var(--bd-default)" }}>
          <div className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--tx-muted)" }}>Growth Priority</div>
          <div className="space-y-3">
            {focusNext.length ? (
              <div className="flex flex-wrap gap-2">
                {focusNext.map((s) => (
                  <span key={s} className="text-[10px] font-bold px-3 py-1.5 rounded-lg"
                        style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444" }}>
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-xs font-bold" style={{ color: "#10b981" }}>100% Match Achieved! 🎉</div>
            )}
          </div>
          {focusNext.length > 0 && (
            <div className="text-[10px] leading-relaxed p-3 rounded-xl"
                 style={{ background: "var(--bg-card)", border: "1px solid var(--bd-default)", color: "var(--tx-muted)" }}>
              LEARNING ROI: Master these{" "}
              <span className="font-bold" style={{ color: "var(--tx-primary)" }}>{focusNext.length}</span> skills to reach ~
              <span className="font-bold" style={{ color: "#3b82f6" }}>{est}%</span> match.
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] pt-2"
           style={{ color: "var(--tx-muted)" }}>
        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Pro-Tip: Micro-learning 1 skill per week maximizes career agility.
      </div>
    </div>
  );
}
