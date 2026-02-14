import { useEffect, useState } from "react";
import SkillTagInput from "../components/SkillTagInput";
import { loadSkills, saveSkills } from "../utils/storage";

export default function Profile() {
  const [skills, setSkills] = useState(() => loadSkills());

  useEffect(() => {
    saveSkills(skills);
  }, [skills]);

  function addSkill(skill) {
    setSkills((prev) => [...prev, skill]);
  }

  function removeSkill(name) {
    setSkills((prev) => prev.filter((s) => s.name !== name));
  }

  function clearAll() {
    setSkills([]);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Skills</h2>
          <p className="text-slate-400 text-sm">
            Add skills you already know. This is used for comparison.
          </p>
        </div>
        <button
          onClick={clearAll}
          className="text-sm px-4 py-2 rounded-xl border-2 border-slate-800 bg-slate-950 hover:bg-slate-900 transition"
        >
          Clear all
        </button>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
        <SkillTagInput skills={skills} onAdd={addSkill} onRemove={removeSkill} />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
        <div className="font-semibold">Tip</div>
        <div className="text-sm text-slate-400 mt-1">
          Keep skill names simple (e.g., <span className="text-slate-200">Node.js</span>,{" "}
          <span className="text-slate-200">MongoDB</span>,{" "}
          <span className="text-slate-200">React</span>).
        </div>
      </div>
    </div>
  );
}
