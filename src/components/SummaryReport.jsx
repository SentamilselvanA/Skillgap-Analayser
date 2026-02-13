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

  // strongest = top 2 by weight, fallback by name
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
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-slate-400">Skill Gap Summary</div>
          <div className="text-xl font-bold">
            You match <span className="text-white">{score}%</span> of this job
          </div>
        </div>

        <span className="text-xs px-2 py-1 rounded-full border border-slate-800 bg-slate-900/40 text-slate-200">
          {earned} / {total} pts
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <div className="font-semibold">Your strongest areas</div>
          <div className="mt-2 text-sm text-slate-300">
            {strongest.length ? (
              <div className="flex flex-wrap gap-2">
                {strongest.map((s) => (
                  <span
                    key={s}
                    className="text-xs px-3 py-1.5 rounded-full border border-emerald-900 bg-emerald-950/40 text-emerald-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-slate-400">No matched skills yet.</div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <div className="font-semibold">Focus next</div>
          <div className="mt-2 text-sm text-slate-300">
            {focusNext.length ? (
              <div className="flex flex-wrap gap-2">
                {focusNext.map((s) => (
                  <span
                    key={s}
                    className="text-xs px-3 py-1.5 rounded-full border border-rose-900 bg-rose-950/40 text-rose-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-slate-400">You already match everything 🎉</div>
            )}
          </div>

          {focusNext.length > 0 && (
            <div className="mt-3 text-xs text-slate-500">
              If you learn these{" "}
              <span className="text-slate-200 font-semibold">{focusNext.length}</span>{" "}
              skills at{" "}
              <span className="text-slate-200 font-semibold">Intermediate</span> level,
              your match can reach ~{" "}
              <span className="text-slate-200 font-semibold">{est}%</span>.
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-slate-500">
        Tip: Improve 1–2 skills, then re-run analysis to track progress.
      </div>
    </div>
  );
}
