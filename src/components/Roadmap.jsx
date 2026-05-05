import { SKILL_RESOURCES } from "../data/skillResources";
import { SKILL_META } from "../data/skillRoadmapMeta";

const DEFAULT_RESOURCES = [
  { name: "freeCodeCamp", url: "https://www.freecodecamp.org/" },
  { name: "MDN Web Docs", url: "https://developer.mozilla.org/" },
  { name: "YouTube", url: "https://www.youtube.com/" },
];

// Builds a learning path using prerequisites (only considers skills that are missing)
function buildLearningPath(missingSkills) {
  const missingLower = new Set(missingSkills.map((s) => s.toLowerCase()));
  const visited = new Set();
  const path = [];

  function dfs(skill) {
    const key = skill.toLowerCase();
    if (visited.has(key)) return;
    visited.add(key);

    const meta = SKILL_META[skill];
    const prereq = meta?.prerequisites || [];

    // visit prerequisites first (only if that prerequisite is also missing)
    for (const p of prereq) {
      const pk = p.toLowerCase();
      if (missingLower.has(pk)) {
        // find the original-cased missing skill name
        const original = missingSkills.find((x) => x.toLowerCase() === pk);
        if (original) dfs(original);
      }
    }

    path.push(skill);
  }

  for (const s of missingSkills) dfs(s);

  // remove duplicates while keeping order (safe)
  const seen = new Set();
  return path.filter((s) => {
    const k = s.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export default function Roadmap({ missingSkills }) {
  if (!missingSkills || missingSkills.length === 0) return null;

  const ordered = buildLearningPath(missingSkills);

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-sm dark:shadow-none space-y-8 transition-colors duration-300">
      <div className="space-y-2">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Roadmap: Master Your Path</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
          Follow this optimized sequence (prerequisites first). Each module contains vetted resources, 
          strategic advice, and a practical mini-project.
        </p>
      </div>

      <div className="space-y-6">
        {ordered.map((skill, idx) => {
          const resources = SKILL_RESOURCES[skill] || DEFAULT_RESOURCES;
          const meta = SKILL_META[skill];

          return (
            <div
              key={skill}
              className="relative group rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-6 space-y-6 transition-all hover:bg-white dark:hover:bg-slate-900 hover:border-blue-500/20"
            >
              {/* Step Number Badge */}
              <div className="absolute -left-3 top-6 h-8 w-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center text-xs font-black shadow-lg">
                {idx + 1}
              </div>

              <div className="pl-6 space-y-6">
                 <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">{skill}</h4>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                       Learn Now
                    </div>
                 </div>

                 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {resources.slice(0, 3).map((r) => (
                      <a
                        key={r.url}
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 transition-all hover:border-blue-500/50 hover:shadow-md group/link"
                      >
                         <div className="text-sm font-bold text-slate-800 dark:text-white group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400 transition-colors">
                           {r.name}
                         </div>
                         <div className="text-[10px] text-slate-400 truncate mt-1">
                           {new URL(r.url).hostname}
                         </div>
                      </a>
                    ))}
                 </div>

                 <div className="grid gap-4 sm:grid-cols-2 pt-2">
                    <div className="space-y-2">
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Strategic Tip</div>
                       <div className="text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed">
                          "{meta?.tip || "Focus on fundamental concepts before moving to complex implementation."}"
                       </div>
                    </div>

                    <div className="space-y-2 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/30">
                       <div className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest">Mini Project</div>
                       <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {meta?.miniProject || "Build a small CLI or web tool to apply this skill."}
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

