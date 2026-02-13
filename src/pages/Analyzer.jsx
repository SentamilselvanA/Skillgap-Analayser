import { useMemo, useState } from "react";
import { roles } from "../data/rolesMock";
import { loadSkills, saveSkills } from "../utils/storage";
import { compareSkills } from "../utils/compareSkills";
import ProgressBar from "../components/ProgressBar";
import SkillList from "../components/SkillList";
import Roadmap from "../components/Roadmap";

function normalize(s) {
  return String(s || "").toLowerCase().trim();
}

export default function Analyzer() {
  // ✅ reactive userSkills so UI updates immediately
  const [userSkills, setUserSkills] = useState(() => loadSkills());
  const [roleId, setRoleId] = useState(roles[0]?.id || "");
  const [result, setResult] = useState(null);

  // ✅ missing skills selection
  const [selectedMissing, setSelectedMissing] = useState([]);

  // ✅ level asked before adding
  const [addLevel, setAddLevel] = useState("Intermediate");

  const selectedRole = useMemo(() => roles.find((r) => r.id === roleId), [roleId]);

  function analyze(skillsOverride = userSkills) {
    const roleSkills = selectedRole?.skills || [];
    const r = compareSkills(skillsOverride, roleSkills);
    setResult({
      ...r,
      roleTitle: selectedRole?.title || "Unknown role",
      total: roleSkills.length,
    });
  }

  const hasSkills = userSkills.length > 0;

  function toggleMissing(skill) {
    setSelectedMissing((prev) => {
      const key = normalize(skill);
      const exists = prev.some((x) => normalize(x) === key);
      if (exists) return prev.filter((x) => normalize(x) !== key);
      return [...prev, skill];
    });
  }

  function addSelectedToMySkills() {
    if (!result || selectedMissing.length === 0) return;

    const existing = new Set(userSkills.map((s) => normalize(s.name)));

    const newOnes = selectedMissing
      .filter((s) => !existing.has(normalize(s)))
      .map((s) => ({
        name: s,
        level: addLevel, // ✅ chosen by user
      }));

    const updated = [...userSkills, ...newOnes];

    setUserSkills(updated);
    saveSkills(updated); // ✅ persist

    setSelectedMissing([]);
    analyze(updated); // ✅ auto re-compare
  }

  function removeMySkill(skillName) {
    const updated = userSkills.filter((s) => normalize(s.name) !== normalize(skillName));
    setUserSkills(updated);
    saveSkills(updated);

    // ✅ if user already analyzed, re-run instantly
    if (result) analyze(updated);
  }

  function clearAllSkills() {
    const updated = [];
    setUserSkills(updated);
    saveSkills(updated);
    setResult(null);
    setSelectedMissing([]);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Role Analyzer</h2>
        <p className="text-sm text-slate-400">
          Select a role and compare it with your current skills.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* LEFT PANEL */}
        <div className="lg:col-span-1 rounded-3xl border border-slate-800 bg-slate-950 p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm text-slate-400">My skills</div>
              <div className="text-xl font-semibold">{userSkills.length}</div>
            </div>

            <button
              onClick={clearAllSkills}
              disabled={userSkills.length === 0}
              className="text-xs px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Clear all
            </button>
          </div>

          {/* ✅ My skills list with remove */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <div className="text-sm text-slate-400 mb-3">Quick remove</div>

            <div className="flex flex-wrap gap-2">
              {userSkills.length === 0 ? (
                <div className="text-sm text-slate-400">
                  No skills yet. Add from Profile page or add missing skills here.
                </div>
              ) : (
                userSkills.map((s) => (
                  <span
                    key={s.name}
                    className="group inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-sm"
                  >
                    <span className="text-slate-200">
                      {s.name}
                      <span className="text-slate-400"> ({s.level})</span>
                    </span>

                    <button
                      onClick={() => removeMySkill(s.name)}
                      className="h-5 w-5 grid place-items-center rounded-full border border-slate-700 bg-slate-950 text-slate-300
                                 hover:bg-rose-950/50 hover:border-rose-700 hover:text-rose-200 transition"
                      title="Remove from my skills"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-300">Target role</label>
            <select
              value={roleId}
              onChange={(e) => {
                setRoleId(e.target.value);
                setResult(null);
                setSelectedMissing([]);
              }}
              className="mt-2 w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm outline-none focus:border-slate-600"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => analyze()}
            disabled={!hasSkills}
            className="w-full rounded-xl px-4 py-3 text-sm font-semibold bg-white text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
          >
            Compare now
          </button>

          {!hasSkills && (
            <div className="text-sm text-rose-300">
              Add your skills in the Profile page first, or add from missing skills.
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-950 p-6">
          {!result ? (
            <div className="text-slate-400">
              Click{" "}
              <span className="text-slate-200 font-semibold">Compare now</span>{" "}
              to see matched and missing skills.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm text-slate-400">Role</div>
                  <div className="text-xl font-bold">{result.roleTitle}</div>
                </div>
                <div className="text-sm text-slate-300">
                  Total required skills:{" "}
                  <span className="font-semibold text-white">{result.total}</span>
                </div>
              </div>

              {/* Score */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-slate-300">Match score</div>
                  <div className="font-semibold">{result.score}%</div>
                </div>

                <div className="text-xs text-slate-500">
                  Weighted points:{" "}
                  <span className="text-slate-200 font-semibold">
                    {result.earned}
                  </span>{" "}
                  /{" "}
                  <span className="text-slate-200 font-semibold">
                    {result.total}
                  </span>
                </div>

                <ProgressBar value={result.score} />
              </div>

              {/* Matched + Missing */}
              <div className="grid gap-4 sm:grid-cols-2">
                <SkillList
                  title="Matched skills (with level)"
                  items={result.matchedDetailed}
                  variant="good"
                />

                {/* ✅ Interactive Missing Skills + Ask Level */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Missing skills</h3>
                    <span className="text-xs px-2 py-1 rounded-full border bg-rose-950/40 border-rose-900 text-rose-200">
                      {result.missing.length}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.missing.length === 0 ? (
                      <div className="text-sm text-slate-400">None</div>
                    ) : (
                      result.missing.map((s) => {
                        const active = selectedMissing.some(
                          (x) => normalize(x) === normalize(s)
                        );

                        return (
                          <button
                            key={s}
                            onClick={() => toggleMissing(s)}
                            className={[
                              "text-sm px-3 py-1.5 rounded-full border transition",
                              active
                                ? "bg-white text-slate-950 border-white"
                                : "bg-rose-950/40 border-rose-900 text-rose-200 hover:bg-rose-950/60",
                            ].join(" ")}
                            title="Click to select"
                          >
                            {s}
                          </button>
                        );
                      })
                    )}
                  </div>

                  {/* ✅ ask level + add */}
                  <div className="mt-4 grid gap-3 sm:grid-cols-3 sm:items-end">
                    <div className="sm:col-span-1">
                      <label className="text-xs text-slate-400">
                        Your current level
                      </label>
                      <select
                        value={addLevel}
                        onChange={(e) => setAddLevel(e.target.value)}
                        className="mt-2 w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-sm outline-none focus:border-slate-600"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>

                    <button
                      onClick={addSelectedToMySkills}
                      disabled={selectedMissing.length === 0}
                      className="sm:col-span-1 rounded-xl px-4 py-2 text-sm font-semibold bg-white text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
                    >
                      Add to my skills
                    </button>

                    <button
                      onClick={() => setSelectedMissing([])}
                      disabled={selectedMissing.length === 0}
                      className="sm:col-span-1 rounded-xl px-4 py-2 text-sm border border-slate-800 bg-slate-950 hover:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      Clear selection
                    </button>
                  </div>

                  {selectedMissing.length > 0 && (
                    <div className="mt-3 text-xs text-slate-400">
                      Selected:{" "}
                      <span className="text-slate-200 font-semibold">
                        {selectedMissing.length}
                      </span>
                      {"  "}• will be added as{" "}
                      <span className="text-slate-200 font-semibold">
                        {addLevel}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Roadmap Full Width */}
              <div className="pt-2">
                <Roadmap missingSkills={result.missing} />
              </div>

              {/* Next Steps */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <div className="font-semibold">Next steps</div>
                <ul className="mt-2 text-sm text-slate-300 list-disc pl-5 space-y-1">
                  <li>Start with 1–2 missing skills and build a small project.</li>
                  <li>Add those skills to your profile once you practice them.</li>
                  <li>Repeat analysis until you reach 80%+ match.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}










// import { useMemo, useState } from "react";
// import { roles } from "../data/rolesMock";
// import { loadSkills } from "../utils/storage";
// import { compareSkills } from "../utils/compareSkills";
// import ProgressBar from "../components/ProgressBar";
// import SkillList from "../components/SkillList";
// import Roadmap from "../components/Roadmap";


// export default function Analyzer() {
//   const userSkills = useMemo(() => loadSkills(), []);
//   const [roleId, setRoleId] = useState(roles[0]?.id || "");
//   const [result, setResult] = useState(null);

//   const selectedRole = roles.find((r) => r.id === roleId);

//   function analyze() {
//     const roleSkills = selectedRole?.skills || [];
//     const r = compareSkills(userSkills, roleSkills);
//     setResult({
//       ...r,
//       roleTitle: selectedRole?.title || "Unknown role",
//       total: roleSkills.length,
//     });
//   }

//   const hasSkills = userSkills.length > 0;

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-2xl font-bold">Role Analyzer</h2>
//         <p className="text-sm text-slate-400">
//           Select a role and compare it with your current skills.
//         </p>
//       </div>

//       <div className="grid gap-4 lg:grid-cols-3">
//         <div className="lg:col-span-1 rounded-3xl border border-slate-800 bg-slate-950 p-6 space-y-4">
//           <div>
//             <div className="text-sm text-slate-400">Your skills</div>
//             <div className="text-xl font-semibold">{userSkills.length}</div>
//           </div>

//           <div>
//             <label className="text-sm text-slate-300">Target role</label>
//             <select
//               value={roleId}
//               onChange={(e) => setRoleId(e.target.value)}
//               className="mt-2 w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm outline-none focus:border-slate-600"
//             >
//               {roles.map((r) => (
//                 <option key={r.id} value={r.id}>
//                   {r.title}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <button
//             onClick={analyze}
//             disabled={!hasSkills}
//             className="w-full rounded-xl px-4 py-3 text-sm font-semibold bg-white text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
//           >
//             Compare now
//           </button>

//           {!hasSkills && (
//             <div className="text-sm text-rose-300">
//               Add your skills in the Profile page first.
//             </div>
//           )}
//         </div>

//         <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-950 p-6">
//           {!result ? (
//             <div className="text-slate-400">
//               Click <span className="text-slate-200 font-semibold">Compare now</span> to
//               see matched and missing skills.
//             </div>
//           ) : (
//             <div className="space-y-5">
//               <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
//                 <div>
//                   <div className="text-sm text-slate-400">Role</div>
//                   <div className="text-xl font-bold">{result.roleTitle}</div>
//                 </div>
//                 <div className="text-sm text-slate-300">
//                   Total required skills:{" "}
//                   <span className="font-semibold text-white">{result.total}</span>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <div className="flex items-center justify-between text-sm">
//                   <div className="text-slate-300">Match score</div>
//                   <div className="font-semibold">{result.score}%</div>
//                 </div>
//                 <ProgressBar value={result.score} />
//               </div>

//               <div className="grid gap-4 sm:grid-cols-2">
//                 {/* <SkillList title="Matched skills" items={result.matched} variant="good" /> */}
//                 <SkillList title="Matched skills (with level)" items={result.matchedDetailed} variant="good" />
//                 <SkillList title="Missing skills" items={result.missing} variant="bad" />
                
//               </div>
//               <Roadmap missingSkills={result.missing} />


//               <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
//                 <div className="font-semibold">Next steps</div>
//                 <ul className="mt-2 text-sm text-slate-300 list-disc pl-5 space-y-1">
//                   <li>Start with 1–2 missing skills and build a small project.</li>
//                   <li>Add those skills to your profile once you practice them.</li>
//                   <li>Repeat analysis until you reach 80%+ match.</li>
//                 </ul>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
