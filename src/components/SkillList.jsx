export default function SkillList({ title, items, variant = "neutral" }) {
  const badge =
    variant === "good"
      ? "bg-emerald-950/40 border-emerald-900 text-emerald-200"
      : variant === "bad"
      ? "bg-rose-950/40 border-rose-900 text-rose-200"
      : "bg-slate-900 border-slate-800 text-slate-200";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full border ${badge}`}>
          {items.length}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {items.length === 0 ? (
          <div className="text-sm text-slate-400">None</div>
        ) : (
          items.map((x) => (
            <span
              key={x}
              className={`text-sm px-3 py-1.5 rounded-full border ${badge}`}
            >
              {x}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
