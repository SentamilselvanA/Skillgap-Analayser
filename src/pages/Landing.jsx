import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { roles } from "../data/rolesMock";

function FeatureCard({ title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group text-left rounded-2xl border border-slate-800 bg-slate-950 p-5
                 cursor-pointer
                 transition-all duration-300 ease-out
                 hover:-translate-y-1 hover:border-blue-500/60 hover:bg-slate-900
                 hover:shadow-xl hover:shadow-blue-500/10"
    >
      <div className="font-semibold text-slate-100 flex items-center justify-between">
        {title}
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </div>

      <div className="mt-1 text-sm text-slate-400">
        {desc}
      </div>
    </button>
  );
}


export default function Landing() {
  const navigate = useNavigate();

  const quickRoles = useMemo(() => roles.slice(0, 6), []);

  // ✅ White highlight moves between CTA buttons on hover
  const [activeAction, setActiveAction] = useState("profile");

  const ctaBase =
  "group rounded-xl px-5 py-3 text-sm font-semibold cursor-pointer " +
  "transition-all duration-300 ease-out active:scale-[0.98] flex items-center gap-2";

const ctaActive = "bg-white text-slate-950 hover:opacity-90";

const ctaInactive =
  "border border-slate-800/ bg-slate-950 text-slate-200 " +
  "hover:bg-slate-900 hover:border-blue-500/50";


  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900/60 p-8 md:p-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Find your skill gaps. Prepare for the right job role.
          </h1>
          <p className="mt-4 text-slate-300">
            Compare your skills with job requirements, find what’s missing, and
            follow a roadmap to learn next.
          </p>

          {/* CTA buttons (white moves on hover) */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onMouseEnter={() => setActiveAction("profile")}
              onFocus={() => setActiveAction("profile")}
              onClick={() => navigate("/profile")}
              className={`${ctaBase} ${
                activeAction === "profile" ? ctaActive : ctaInactive
              }`}
            >
              Add my skills
            </button>

            <button
              onMouseEnter={() => setActiveAction("analyzer")}
              onFocus={() => setActiveAction("analyzer")}
              onClick={() => navigate("/analyzer")}
              className={`${ctaBase} ${
                activeAction === "analyzer" ? ctaActive : ctaInactive
              }`}
            >
              Analyze a role
            </button>

            <button
              onMouseEnter={() => setActiveAction("jd")}
              onFocus={() => setActiveAction("jd")}
              onClick={() => navigate("/jd")}
              className={`${ctaBase} ${
                activeAction === "jd" ? ctaActive : ctaInactive
              }`}
            >
              Paste a job description
            </button>
          </div>

          <div className="mt-4 text-xs text-slate-500">
            Tip: Add 8–12 skills first → then analyze a role to see your match
            score.
          </div>
        </div>
      </div>

      {/* QUICK STEPS (Clickable cards) */}
      <div className="grid gap-4 md:grid-cols-3 ">
        <FeatureCard
          title="1) Add skills"
          desc="Create your skill profile with levels (Beginner/Intermediate/Advanced)."
          onClick={() => navigate("/profile")}
        />
        <FeatureCard
          title="2) Choose role"
          desc="Pick a target role and compare with your current skills."
          onClick={() => navigate("/analyzer")}
        />
        <FeatureCard
          title="3) See gaps"
          desc="Matched + missing skills, score, and roadmap with learning resources."
          onClick={() => navigate("/analyzer")}
        />
      </div>

      {/* POPULAR ROLES */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xl font-bold">Popular roles</div>
            <div className="text-sm text-slate-400">
              Start with a role that matches your interest.
            </div>
          </div>

          <button
            onClick={() => navigate("/jobs")}
            className="text-left rounded-2xl border border-slate-800 bg-slate-950 p-4
                       transition-all duration-300 ease-out
                       hover:-translate-y-1 hover:border-blue-500/60 hover:bg-slate-900
                       hover:shadow-xl hover:shadow-blue-500/10"
          >
            View all jobs →
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickRoles.map((r) => (
            <button
              key={r.id}
              onClick={() => navigate("/analyzer")}
              className="group text-left rounded-2xl border border-slate-300 bg-slate-950 p-4
             cursor-pointer
             transition-all duration-300 ease-out
             hover:-translate-y-1 hover:border-blue-500/60 hover:bg-slate-900
             hover:shadow-xl hover:shadow-blue-500/10"
              title="Go to Analyzer"
            >
              <div className="font-semibold">{r.title}</div>
              <div className="mt-1 text-xs text-slate-400">
                Core skills: {r.skills.length}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* EXTRA SECTION */}
      <div className="grid gap-4 md:grid-cols-2">
        <div
          className="text-left rounded-2xl border border-stale-300
bg-slate-950 p-4
                     transition-all duration-300 ease-out
                     hover:-translate-y-1 hover:border-blue-500/60 hover:bg-slate-900
                     hover:shadow-xl hover:shadow-blue-500/10"
        >
          <div className="font-semibold">Job Description Analyzer</div>
          <div className="mt-2 text-sm text-slate-400">
            Paste any real job post and instantly see required skills + your
            gaps.
          </div>
          <button
            onClick={() => navigate("/jd")}
            className="mt-4 rounded-xl px-4 py-2 text-sm font-semibold
             border border-slate-800 bg-slate-950 text-slate-200
             cursor-pointer
             transition-all duration-300 ease-out
             hover:bg-white hover:text-slate-950 hover:border-white
             active:scale-[0.98]"
          >
            Try JD Analyzer →
          </button>
        </div>

        <div
          className="text-left rounded-2xl border border-stale-300 bg-slate-950 p-4
                     transition-all duration-300 ease-out
                     hover:-translate-y-1 hover:border-blue-500/60 hover:bg-slate-900
                     hover:shadow-xl hover:shadow-blue-500/10"
        >
          <div className="font-semibold">Track your progress</div>
          <div className="mt-2 text-sm text-slate-400">
            Improve 1–2 skills, re-run analysis, and increase your score
            step-by-step.
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="mt-4 rounded-xl px-4 py-2 text-sm font-semibold
             border border-slate-800 bg-slate-950 text-slate-200
             cursor-pointer
             transition-all duration-300 ease-out
             hover:bg-white hover:text-slate-950 hover:border-white
             active:scale-[0.98]"
          >
            Update my skills →
          </button>
        </div>
      </div>
    </div>
  );
}
