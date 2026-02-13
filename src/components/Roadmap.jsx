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
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 space-y-4">
      <div>
        <h3 className="text-xl font-bold">Roadmap: Learn Next</h3>
        <p className="text-sm text-slate-400">
          Follow the order below (prerequisites first). Each skill includes popular
          learning resources, a tip, and a mini project.
        </p>
      </div>

      <div className="space-y-4">
        {ordered.map((skill) => {
          const resources = SKILL_RESOURCES[skill] || DEFAULT_RESOURCES;
          const meta = SKILL_META[skill];

          return (
            <div
              key={skill}
              className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-lg font-semibold">{skill}</div>
                <div className="text-xs text-slate-500">
                  Suggested resources (popular)
                </div>
              </div>

              <ul className="grid gap-3 sm:grid-cols-3">
                {resources.slice(0, 3).map((r) => (
                  <li
                    key={r.url}
                    className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/40 p-4
                               transition-all duration-300 ease-out
                               hover:-translate-y-2 hover:scale-[1.02]
                               hover:border-blue-500/70 hover:bg-slate-900
                               hover:shadow-2xl hover:shadow-blue-500/20"
                  >
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-white transition-colors duration-300 group-hover:text-blue-400"
                    >
                      {r.name}
                    </a>
                    <div className="text-xs text-slate-400 mt-1 break-all">
                      {r.url}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="text-sm text-slate-300">
                <span className="font-semibold text-slate-100">Tip:</span>{" "}
                {meta?.tip ||
                  "Follow basics → practice → build a mini project → add to profile."}
              </div>

              {meta?.miniProject && (
                <div className="text-sm text-slate-300">
                  <span className="font-semibold text-slate-100">
                    Mini project:
                  </span>{" "}
                  {meta.miniProject}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
