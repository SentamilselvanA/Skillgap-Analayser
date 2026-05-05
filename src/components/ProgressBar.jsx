export default function ProgressBar({ value }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner">
      <div
        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-1000 ease-out shadow-lg shadow-blue-500/20"
        style={{ width: `${v}%` }}
        aria-label={`Match score ${v}%`}
      />
    </div>
  );
}

