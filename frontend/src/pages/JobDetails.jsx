import { useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { roles } from "../data/rolesMock";
import { ROLE_INSIGHTS } from "../data/roleInsights";
import Roadmap from "../components/Roadmap.jsx";

const card = { background: "var(--bg-card)", border: "1px solid var(--bd-default)", borderRadius: "1.5rem" };
const surface = { background: "var(--bg-surface)", border: "1px solid var(--bd-default)", borderRadius: "1rem" };

export default function JobDetails() {
  const { roleId } = useParams();
  const role = useMemo(() => roles.find((r) => r.id === roleId), [roleId]);
  const info = role ? ROLE_INSIGHTS[role.id] : null;

  if (!role) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="text-4xl font-black tracking-widest uppercase" style={{ color: "var(--tx-primary)" }}>404</div>
        <div className="text-xl font-bold" style={{ color: "var(--tx-secondary)" }}>Role not found</div>
        <Link to="/jobs"
              className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold transition-all shadow-sm"
              style={card}>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span style={{ color: "var(--tx-primary)" }}>Back to Jobs</span>
        </Link>
      </div>
    );
  }

  const demand = info?.demand || "Medium";
  const advantages = info?.advantages || ["Good career option with consistent opportunities."];
  const path = info?.path || role.skills;

  const demandStyle =
    demand === "High"
      ? { background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981" }
      : { background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", color: "#f59e0b" };

  return (
    <div className="space-y-10 pb-20 animate-in">

      {/* Hero */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between pb-10"
           style={{ borderBottom: "1px solid var(--bd-default)" }}>
        <div className="space-y-4">
          <Link to="/jobs"
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] hover:opacity-80 transition"
                style={{ color: "var(--tx-accent)" }}>
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Jobs Explorer
          </Link>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--tx-muted)" }}>
              Career Role
            </div>
            <h1 className="text-4xl font-black leading-tight" style={{ color: "var(--tx-primary)" }}>
              {role.title}
            </h1>
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest"
                    style={demandStyle}>
                <span className="h-1 w-1 rounded-full bg-current opacity-70" />
                Demand: {demand}
              </span>
              <span className="text-xs font-bold" style={{ color: "var(--tx-muted)" }}>
                Market Stability: High
              </span>
            </div>
          </div>
        </div>

        <button className="btn-primary rounded-2xl px-6 py-3 text-sm shadow-lg shadow-blue-600/20 active:scale-[0.98]">
          Subscribe to Alerts
        </button>
      </div>

      <div className="grid gap-10 lg:grid-cols-12">

        {/* Left sidebar */}
        <div className="lg:col-span-4 space-y-6">

          {/* Advantages */}
          <div className="p-8 space-y-6 shadow-sm" style={card}>
            <div className="flex items-center gap-2 font-bold" style={{ color: "var(--tx-primary)" }}>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                   style={{ color: "#f59e0b" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Career Advantages
            </div>
            <ul className="space-y-4">
              {advantages.map((a) => (
                <li key={a} className="flex gap-3 text-sm leading-relaxed italic" style={{ color: "var(--tx-secondary)" }}>
                  <span className="font-bold shrink-0" style={{ color: "#3b82f6" }}>•</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>

          {/* Core Skills */}
          <div className="p-8 space-y-6 shadow-sm" style={card}>
            <div className="flex items-center gap-2 font-bold" style={{ color: "var(--tx-primary)" }}>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                   style={{ color: "#6366f1" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Required Competencies
            </div>
            <div className="flex flex-wrap gap-2">
              {role.skills.map((s) => (
                <span key={s}
                      className="text-xs font-bold px-3 py-2 rounded-xl transition-all hover:border-blue-500/30"
                      style={{ background: "var(--bg-surface)", border: "1px solid var(--bd-default)", color: "var(--tx-secondary)" }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right content */}
        <div className="lg:col-span-8 space-y-8">

          {/* Learning path */}
          <div className="p-8 space-y-6 shadow-sm" style={card}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 font-bold" style={{ color: "var(--tx-primary)" }}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     style={{ color: "#10b981" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Recommended Learning Path
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--tx-muted)" }}>
                {path.length} Master Phases
              </div>
            </div>
            <div className="text-sm font-medium leading-relaxed p-6 rounded-2xl italic"
                 style={{ ...surface, color: "var(--tx-secondary)" }}>
              {path.join("  →  ")}
            </div>
          </div>

          {/* Roadmap */}
          <div className="space-y-4">
            <div className="text-sm font-black uppercase tracking-[0.2em] ml-2" style={{ color: "var(--tx-muted)" }}>
              Skill Acquisition Roadmap
            </div>
            <Roadmap missingSkills={path} />
          </div>
        </div>
      </div>
    </div>
  );
}
