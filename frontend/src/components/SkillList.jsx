export default function SkillList({ title, items, variant = "neutral" }) {
  const badge =
    variant === "good"
      ? { background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981" }
      : variant === "bad"
      ? { background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444" }
      : null;

  return (
    <div className="rounded-3xl p-5 shadow-sm transition-colors duration-300"
         style={{ background: "var(--bg-card)", border: "1px solid var(--bd-default)" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold" style={{ color: "var(--tx-primary)" }}>{title}</h3>
        <span className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter"
              style={badge || { background: "var(--bg-surface)", border: "1px solid var(--bd-default)", color: "var(--tx-secondary)" }}>
          {items.length} Units
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.length === 0 ? (
          <div className="text-sm italic py-2" style={{ color: "var(--tx-muted)" }}>No matching items found.</div>
        ) : (
          items.map((x) => {
            const label = typeof x === "object" && x !== null ? `${x.skill} (${x.level})` : x;
            const key   = typeof x === "object" && x !== null ? x.skill : x;
            return (
              <span key={key}
                    className="text-xs font-bold px-3 py-2 rounded-xl transition-all duration-300 hover:scale-[1.03]"
                    style={badge || { background: "var(--bg-surface)", border: "1px solid var(--bd-default)", color: "var(--tx-secondary)" }}>
                {label}
              </span>
            );
          })
        )}
      </div>
    </div>
  );
}
