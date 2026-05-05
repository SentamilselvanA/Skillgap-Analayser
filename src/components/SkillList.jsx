export default function SkillList({ title, items, variant = "neutral" }) {
  const badge =
    variant === "good"
      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-200"
      : variant === "bad"
      ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-200"
      : "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300";

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 shadow-sm dark:shadow-none transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800 dark:text-slate-100">{title}</h3>
        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${badge} uppercase tracking-tighter`}>
          {items.length} Units
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.length === 0 ? (
          <div className="text-sm text-slate-400 italic py-2">No matching items found.</div>
        ) : (
          items.map((x) => (
            <span
              key={x}
              className={`text-xs font-bold px-3 py-2 rounded-xl border ${badge} transition-all duration-300 hover:scale-[1.03]`}
            >
              {x}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

