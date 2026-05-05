import { useMemo, useState } from "react";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const LEVEL_COLORS = {
  Beginner:     { bg: "rgba(59,130,246,0.08)",  border: "rgba(59,130,246,0.25)",  color: "#3b82f6" },
  Intermediate: { bg: "rgba(124,58,237,0.08)",  border: "rgba(124,58,237,0.25)", color: "#7c3aed" },
  Advanced:     { bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.25)", color: "#10b981" },
};

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
    <div className="space-y-5">
      {/* Input row */}
      <form onSubmit={handleAdd} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          placeholder="Type a skill (e.g., React, SQL, Node.js)"
          className="flex-1 rounded-xl px-4 py-3 text-sm outline-none transition-all
                     focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--bd-default)",
            color: "var(--tx-primary)",
          }}
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="rounded-xl px-4 py-3 text-sm outline-none transition-all
                     focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--bd-default)",
            color: "var(--tx-primary)",
          }}
        >
          {LEVELS.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        <button
          type="submit"
          disabled={!canAdd}
          className="btn-primary rounded-xl px-6 py-3 text-sm
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </form>

      {/* Skill tags */}
      <div className="flex flex-wrap gap-2 min-h-[2rem]">
        {skills.length === 0 ? (
          <div className="text-sm italic" style={{ color: "var(--tx-muted)" }}>
            No skills added yet. Add a few to start comparing.
          </div>
        ) : (
          skills.map((s) => {
            const lc = LEVEL_COLORS[s.level] || LEVEL_COLORS.Intermediate;
            return (
              <span
                key={s.name}
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm
                           transition-all duration-200"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--bd-default)",
                }}
              >
                <span className="font-medium" style={{ color: "var(--tx-primary)" }}>
                  {s.name}
                </span>
                {/* Level badge */}
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: lc.bg, border: `1px solid ${lc.border}`, color: lc.color }}>
                  {s.level}
                </span>
                <button
                  onClick={() => onRemove(s.name)}
                  className="w-4 h-4 grid place-items-center rounded-full transition-all
                             hover:bg-rose-100 hover:text-rose-500"
                  style={{ color: "var(--tx-muted)" }}
                  aria-label={`Remove ${s.name}`}
                  title="Remove"
                >
                  ✕
                </button>
              </span>
            );
          })
        )}
      </div>

      {/* Counter */}
      <div className="text-xs font-medium" style={{ color: "var(--tx-muted)" }}>
        {skills.length} / {max} skills added
      </div>
    </div>
  );
}
