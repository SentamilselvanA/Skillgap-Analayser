import { useMemo, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { roles } from "../data/rolesMock";
import { ROLE_INSIGHTS } from "../data/roleInsights";
import Roadmap from "../components/Roadmap.jsx";

export default function JobDetails() {
  const { roleId } = useParams();
  const [searchParams] = useSearchParams();
  const focus = searchParams.get("focus"); // skill name

  const role = useMemo(() => roles.find((r) => r.id === roleId), [roleId]);
  const info = role ? ROLE_INSIGHTS[role.id] : null;

  useEffect(() => {
    if (!focus) return;
    const id = `skill-${focus.toLowerCase().replace(/\s+/g, "-")}`;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [focus]);

  if (!role) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="text-4xl font-black text-slate-900 dark:text-white tracking-widest uppercase">
          404
        </div>
        <div className="text-xl font-bold text-slate-500 dark:text-slate-400">
          Role not found
        </div>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-3 text-sm font-bold text-slate-950 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-all shadow-sm"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Jobs
        </Link>
      </div>
    );
  }

  const demand = info?.demand || "Medium";
  const advantages = info?.advantages || [
    "Good career option with consistent opportunities.",
  ];
  const path = info?.path || role.skills;
  const learnList = path;

  const badge =
    demand === "High"
      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-200"
      : "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-200";

  return (
    <div className="space-y-10 pb-20">
      {/* Hero Section */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-slate-100 dark:border-slate-900 pb-10">
        <div className="space-y-4">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] hover:opacity-80 transition"
          >
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Jobs Explorer
          </Link>
          <div>
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
              Career Role
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">
              {role.title}
            </h1>
            <div className="mt-4 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full border ${badge} uppercase tracking-widest`}
              >
                <span className="h-1 w-1 rounded-full bg-current opacity-70"></span>
                Demand: {demand}
              </span>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 ml-2">
                Market Stability: High
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="rounded-2xl bg-blue-600 text-white px-6 py-3 text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 active:scale-[0.98]">
            Subscribe to Alerts
          </button>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-8">
          {/* Advantages */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-sm dark:shadow-none space-y-6">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <svg
                className="h-5 w-5 text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Career Advantages
            </div>
            <ul className="space-y-4">
              {advantages.map((a) => (
                <li
                  key={a}
                  className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic"
                >
                  <span className="text-blue-500 font-bold shrink-0">•</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>

          {/* Core Skills */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-sm dark:shadow-none space-y-6">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <svg
                className="h-5 w-5 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              Required Competencies
            </div>
            <div className="flex flex-wrap gap-2">
              {role.skills.map((s) => (
                <span
                  key={s}
                  className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-200 transition-all hover:bg-white dark:hover:bg-slate-900 hover:border-blue-500/30"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-10">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-sm dark:shadow-none space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <svg
                  className="h-5 w-5 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                Recommended Learning Path
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {path.length} Master Phases
              </div>
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-900 italic">
              {path.join("  →  ")}
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">
              Skill Acquisition Roadmap
            </div>
            <Roadmap missingSkills={learnList} />
          </div>
        </div>
      </div>
    </div>
  );
}
