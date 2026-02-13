export default function ProgressBar({ value }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="w-full rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
      <div
        className="h-3 bg-white"
        style={{ width: `${v}%` }}
        aria-label={`Match score ${v}%`}
      />
    </div>
  );
}
