import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { roles } from "../data/rolesMock";

const STATS = [
  { value: "2,400+", label: "Engineers onboarded" },
  { value: "98%",    label: "Match accuracy"      },
  { value: "340+",   label: "Role templates"      },
];

const STEPS = [
  {
    num: "01",
    title: "Build your inventory",
    desc: "Add your skills with proficiency levels — Beginner, Intermediate, or Advanced.",
    path: "/profile",
  },
  {
    num: "02",
    title: "Pick a target role",
    desc: "Choose from 340+ curated role templates or paste a live job description.",
    path: "/analyzer",
  },
  {
    num: "03",
    title: "Close the gap",
    desc: "Get a precision score, matched skills, missing skills, and a full learning roadmap.",
    path: "/analyzer",
  },
];

const FEATURES = [
  {
    tag: "AI-Powered",
    tagColor: "from-blue-600 to-cyan-500",
    title: "Job Description Analyzer",
    desc: "Paste any real job post and instantly extract required competencies, calculate your match score, and get personalized learning recommendations.",
    cta: "Try JD Analyzer",
    path: "/jd",
  },
  {
    tag: "Progress Tracking",
    tagColor: "from-violet-600 to-blue-600",
    title: "Track your growth",
    desc: "Improve 1–2 skills, re-run analysis, and watch your score climb step-by-step. Your profile evolves as you do.",
    cta: "Update my skills",
    path: "/profile",
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const quickRoles = useMemo(() => roles.slice(0, 6), []);

  return (
    <div className="animate-in space-y-20 pb-24">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="glass-card neon-hover relative overflow-hidden">
        {/* Ambient orbs — very subtle, won't bleed into text */}
        <div className="pointer-events-none absolute -top-40 -right-40 w-[500px] h-[500px]
                        rounded-full blur-[140px]"
             style={{ background: "rgba(59,130,246,0.06)" }} />
        <div className="pointer-events-none absolute -bottom-40 -left-40 w-[400px] h-[400px]
                        rounded-full blur-[120px]"
             style={{ background: "rgba(124,58,237,0.05)" }} />

        {/* 12-col grid: text cols 1-7, illustration cols 8-12 */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 items-center gap-10 p-8 md:p-12 lg:p-16">

          {/* ── Left copy — cols 1-7 ── */}
          <div className="lg:col-span-7 space-y-7 min-w-0">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                            text-[10px] font-black uppercase tracking-[0.18em]"
                 style={{
                   border: "1px solid rgba(59,130,246,0.25)",
                   background: "rgba(59,130,246,0.08)",
                   color: "var(--tx-accent)",
                 }}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              v2.0 — Performance Update
            </div>

            {/* H1 — var(--tx-primary): #0F172A light / #FFFFFF dark */}
            <h1 className="text-[2.6rem] md:text-[3.6rem] lg:text-[4rem]"
                style={{ color: "var(--tx-primary)" }}>
              Master Your{" "}
              <span className="neon-text">Career</span>
              <br />Roadmap.
            </h1>

            {/* Body — var(--tx-secondary): #475569 light / #CBD5E1 dark */}
            <p className="text-base md:text-lg max-w-lg"
               style={{ color: "var(--tx-secondary)" }}>
              Identify skill gaps with precision. Compare your profile against
              industry standards and bridge the distance to your dream role with
              AI-assisted learning paths.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button onClick={() => navigate("/profile")}
                      className="btn-primary px-7 py-3 rounded-xl">
                Build Inventory →
              </button>
              <button onClick={() => navigate("/analyzer")}
                      className="btn-ghost px-7 py-3 rounded-xl">
                Role Analysis
              </button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 pt-5"
                 style={{ borderTop: "1px solid var(--bd-subtle)" }}>
              <div className="flex -space-x-2.5">
                {[11, 12, 13, 14].map((i) => (
                  <img key={i} src={`https://i.pravatar.cc/80?img=${i}`} alt="user"
                       className="w-8 h-8 rounded-full object-cover"
                       style={{ border: "2px solid var(--bg-main)" }} />
                ))}
              </div>
              <p className="text-xs font-medium" style={{ color: "var(--tx-muted)" }}>
                Joined by{" "}
                <span style={{ color: "var(--tx-secondary)", fontWeight: 600 }}>
                  2,000+ engineers
                </span>{" "}
                this week
              </p>
            </div>
          </div>

          {/* ── Illustration — cols 8-12 ── */}
          <div className="lg:col-span-5 w-full relative group flex items-center justify-center">
            {/* Ambient glow behind the card */}
            <div className="absolute inset-0 rounded-full blur-[100px] scale-90
                            group-hover:scale-105 transition-transform duration-700"
                 style={{ background: "rgba(59,130,246,0.10)" }} />
            <div className="relative w-full max-w-lg mx-auto rounded-3xl overflow-hidden
                            transition-transform duration-500 hover:scale-[1.02] drop-shadow-2xl"
                 style={{
                   background: "var(--bg-card)",
                   border: "1px solid var(--bd-default)",
                 }}>
              {/* Top bar — OS window chrome */}
              <div className="flex items-center gap-2 px-5 py-3.5"
                   style={{ borderBottom: "1px solid var(--bd-default)", background: "var(--bg-surface)" }}>
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs font-medium" style={{ color: "var(--tx-muted)" }}>
                  skillnova — role_analyzer.tsx
                </span>
              </div>

              {/* Dashboard content */}
              <div className="p-6 space-y-5">

                {/* Match score ring + label */}
                <div className="flex items-center gap-5">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                      <circle cx="40" cy="40" r="32" fill="none"
                              stroke="var(--bd-default)" strokeWidth="7" />
                      <circle cx="40" cy="40" r="32" fill="none"
                              stroke="url(#scoreGrad)" strokeWidth="7"
                              strokeLinecap="round"
                              strokeDasharray="201" strokeDashoffset="50" />
                      <defs>
                        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-black neon-text">75%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest mb-1"
                         style={{ color: "var(--tx-muted)" }}>Match Score</div>
                    <div className="text-base font-bold" style={{ color: "var(--tx-primary)" }}>
                      Frontend Developer
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--tx-secondary)" }}>
                      8 / 10 skills matched
                    </div>
                  </div>
                </div>

                {/* Skill bars */}
                {[
                  { skill: "React",      pct: 95, color: "#3b82f6" },
                  { skill: "TypeScript", pct: 78, color: "#8b5cf6" },
                  { skill: "Node.js",    pct: 60, color: "#06b6d4" },
                  { skill: "GraphQL",    pct: 35, color: "#f59e0b" },
                ].map(({ skill, pct, color }) => (
                  <div key={skill}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-medium" style={{ color: "var(--tx-primary)" }}>{skill}</span>
                      <span className="font-bold" style={{ color: "var(--tx-muted)" }}>{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden"
                         style={{ background: "var(--bg-surface)" }}>
                      <div className="h-full rounded-full transition-all duration-700"
                           style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                ))}

                {/* Missing skill chips */}
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest mb-2"
                       style={{ color: "var(--tx-muted)" }}>Missing Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {["Docker", "AWS"].map((s) => (
                      <span key={s}
                            className="text-xs font-bold px-3 py-1 rounded-full"
                            style={{
                              background: "rgba(239,68,68,0.08)",
                              border: "1px solid rgba(239,68,68,0.2)",
                              color: "#ef4444",
                            }}>
                        + {s}
                      </span>
                    ))}
                    {["React", "CSS", "Git"].map((s) => (
                      <span key={s}
                            className="text-xs font-bold px-3 py-1 rounded-full"
                            style={{
                              background: "rgba(16,185,129,0.08)",
                              border: "1px solid rgba(16,185,129,0.2)",
                              color: "#10b981",
                            }}>
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative grid grid-cols-3"
             style={{ borderTop: "1px solid var(--bd-subtle)" }}>
          {STATS.map(({ value, label }, i) => (
            <div key={label} className="py-5 px-6 text-center"
                 style={{ borderRight: i < 2 ? "1px solid var(--bd-subtle)" : "none" }}>
              <div className="text-xl md:text-2xl font-black tracking-tighter neon-text">
                {value}
              </div>
              <div className="mt-0.5 text-xs font-medium"
                   style={{ color: "var(--tx-muted)" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section>
        <div className="mb-10 text-center space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.22em]"
             style={{ color: "var(--tx-accent)" }}>
            How it works
          </p>
          {/* h2 inherits var(--tx-primary) from global h2 rule */}
          <h2 className="text-3xl md:text-4xl">Three steps to clarity</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map(({ num, title, desc, path }) => (
            <button key={num} onClick={() => navigate(path)}
                    className="group text-left glass-card neon-hover rounded-2xl p-6
                               cursor-pointer transition-all duration-300 hover:-translate-y-1">
              {/* Step number — faded neon */}
              <div className="text-[2.25rem] font-black tracking-tighter neon-text
                              opacity-25 group-hover:opacity-55 transition-opacity leading-none mb-4">
                {num}
              </div>
              {/* Title — var(--tx-primary) */}
              <div className="font-bold text-sm mb-2 flex items-center justify-between"
                   style={{ color: "var(--tx-primary)" }}>
                {title}
                <span className="transition-all duration-200 group-hover:translate-x-1"
                      style={{ color: "var(--tx-muted)" }}>→</span>
              </div>
              {/* Desc — var(--tx-secondary) */}
              <p className="text-sm leading-relaxed m-0"
                 style={{ color: "var(--tx-secondary)" }}>
                {desc}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* ── POPULAR ROLES ────────────────────────────────────── */}
      <section className="glass-card p-8 md:p-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center
                        justify-between gap-4 mb-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] mb-1"
               style={{ color: "var(--tx-accent)" }}>
              Explore
            </p>
            {/* h2 inherits var(--tx-primary) */}
            <h2 className="text-2xl md:text-3xl">Popular roles</h2>
          </div>
          <button onClick={() => navigate("/jobs")}
                  className="btn-ghost px-5 py-2.5 rounded-xl text-sm flex-shrink-0">
            View all →
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickRoles.map((r) => (
            <button key={r.id} onClick={() => navigate("/analyzer")}
                    className="group text-left rounded-xl p-5 cursor-pointer neon-hover
                               transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background: "var(--bg-surface)",
                      border: "1px solid var(--bd-default)",
                    }}>
              {/* Title — var(--tx-primary) flips correctly */}
              <div className="font-bold text-sm mb-2 transition-colors duration-200"
                   style={{ color: "var(--tx-primary)" }}>
                {r.title}
              </div>
              {/* Meta — var(--tx-secondary) */}
              <div className="flex items-center gap-1.5 text-xs"
                   style={{ color: "var(--tx-secondary)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                {r.skills.length} core skills
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── FEATURE CARDS ────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2">
        {FEATURES.map(({ tag, tagColor, title, desc, cta, path }) => (
          <div key={title}
               className="glass-card neon-hover p-8 md:p-10 flex flex-col gap-5
                          transition-all duration-300 hover:-translate-y-0.5">
            <span className={`self-start px-3 py-1 rounded-full text-[10px] font-black
                              uppercase tracking-[0.15em] text-white bg-gradient-to-r ${tagColor}`}>
              {tag}
            </span>
            <div>
              {/* h3 inherits var(--tx-primary) */}
              <h3 className="text-xl mb-2">{title}</h3>
              <p className="text-sm leading-relaxed m-0"
                 style={{ color: "var(--tx-secondary)" }}>
                {desc}
              </p>
            </div>
            <button onClick={() => navigate(path)}
                    className="btn-primary self-start px-6 py-2.5 rounded-xl text-sm mt-auto">
              {cta} →
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
