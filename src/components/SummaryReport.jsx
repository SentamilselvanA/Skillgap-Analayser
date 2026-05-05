function norm(s) {
  return String(s || "").toLowerCase().trim();
}

const LEVEL_WEIGHT = { Beginner: 1, Intermediate: 2, Advanced: 3 };

function parseMatchedDetailed(matchedDetailed = []) {
  // matchedDetailed items look like: "React (Intermediate)"
  return matchedDetailed
    .map((item) => {
      const m = String(item).match(/^(.*)\s\((Beginner|Intermediate|Advanced)\)$/);
      if (!m) return null;
      return { skill: m[1].trim(), level: m[2], w: LEVEL_WEIGHT[m[2]] || 0 };
    })
    .filter(Boolean);
}

function estimateScoreIfLearned({
  total = 0,
  earned = 0,
  toLearnCount = 0,
  assumedLevel = "Intermediate",
}) {
  const add = (LEVEL_WEIGHT[assumedLevel] || 0) / 3; // Intermediate = 0.66
  const newEarned = earned + toLearnCount * add;
  return total === 0 ? 0 : Math.min(100, Math.round((newEarned / total) * 100));
}

export default function SummaryReport({
  score = 0,
  earned = 0,
  total = 0,
  matchedDetailed = [],
  missing = [],
}) {
  const parsed = parseMatchedDetailed(matchedDetailed);

  // strongest = top 3 by weight, fallback by name
  const strongest = [...parsed]
    .sort((a, b) => b.w - a.w || a.skill.localeCompare(b.skill))
    .slice(0, 3)
    .map((x) => x.skill);

  // focus next = first 2 missing skills
  const focusNext = (missing || []).slice(0, 2);

  const est = estimateScoreIfLearned({
    total,
    earned,
    toLearnCount: focusNext.length,
    assumedLevel: "Intermediate",
  });

  if (total === 0) return null;

  return (
    <div className="rounded-3xl border border-accent bg-card p-8 shadow-sm space-y-6 transition-all duration-300">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">Analysis Snapshot</div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
            Match Score: <span className="text-blue-600 dark:text-blue-400">{score}%</span>
          </h3>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">
           {earned} / {total} Skill points
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Strongest Areas */}
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-5 space-y-4">
          <div className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Top Assets</div>
          <div className="space-y-3">
            {strongest.length ? (
              <div className="flex flex-wrap gap-2">
                {strongest.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                  >
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic">No validated skills yet.</div>
            )}
          </div>
        </div>

        {/* Priority Gaps */}
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-5 space-y-4">
          <div className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Growth Priority</div>
          <div className="space-y-3">
            {focusNext.length ? (
              <div className="flex flex-wrap gap-2">
                {focusNext.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-rose-100 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400"
                  >
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">100% Match Achieved! 🎉</div>
            )}
          </div>

          {focusNext.length > 0 && (
            <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed bg-white/50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              LEARNING ROI: Master these <span className="text-slate-900 dark:text-white font-bold">{focusNext.length}</span> skills to reach ~<span className="text-blue-600 dark:text-blue-400 font-bold">{est}%</span> match.
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em] pt-2">
        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Pro-Tip: Micro-learning 1 skill per week maximizes career agility.
      </div>
    </div>
  );
}

