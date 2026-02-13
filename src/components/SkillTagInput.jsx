import { useMemo, useState } from "react";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function SkillTagInput({ skills, onAdd, onRemove, max = 50 }) {
  const [skillName, setSkillName] = useState("");
  const [level, setLevel] = useState("Intermediate");

  const normalized = useMemo(
    () => new Set(skills.map((s) => s.name.toLowerCase().trim())),
    [skills]
  );

  const canAdd =
    skillName.trim().length > 0 &&
    !normalized.has(skillName.toLowerCase().trim()) &&
    skills.length < max;

  function handleAdd(e) {
    e.preventDefault();
    if (!canAdd) return;
    onAdd({ name: skillName.trim(), level });
    setSkillName("");
    setLevel("Intermediate");
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleAdd} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          placeholder="Type a skill (e.g., React, SQL, Node.js)"
          className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm outline-none focus:border-slate-600"
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm outline-none focus:border-slate-600"
        >
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={!canAdd}
          className="rounded-xl px-4 py-3 text-sm font-semibold bg-white text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
        >
          Add
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {skills.length === 0 ? (
          <div className="text-sm text-slate-400">
            No skills added yet. Add a few to start comparing.
          </div>
        ) : (
          skills.map((s) => (
            <span
              key={s.name}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 border border-slate-800 px-3 py-1.5 text-sm"
            >
              <span className="font-medium">{s.name}</span>
              <span className="text-xs text-slate-400">{s.level}</span>
              <button
                onClick={() => onRemove(s.name)}
                className="ml-1 text-slate-400 hover:text-white"
                aria-label={`Remove ${s.name}`}
                title="Remove"
              >
                ✕
              </button>
            </span>
          ))
        )}
      </div>

      <div className="text-xs text-slate-500">
        {skills.length}/{max} skills
      </div>
    </div>
  );
}
