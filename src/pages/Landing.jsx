import { useNavigate } from "react-router-dom";
import { roles } from "../data/rolesMock";

function FeatureCard({ title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-2xl border border-slate-800 bg-slate-950 p-5
                 transition-all duration-300 ease-out
                 hover:-translate-y-1 hover:border-blue-500/60 hover:bg-slate-900
                 hover:shadow-xl hover:shadow-blue-500/10"
    >
      <div className="font-semibold text-slate-100">{title}</div>
      <div className="mt-1 text-sm text-slate-400">{desc}</div>
      <div className="mt-3 text-xs text-slate-500 group-hover:text-slate-300">
        Click to open →
      </div>
    </button>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  const quickRoles = roles.slice(0, 6); // show first 6 roles

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900/60 p-8 md:p-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Find your skill gaps. Prepare for the right job role.
          </h1>
          <p className="mt-4 text-slate-300">
            Compare your skills with job requirements, find what’s missing, and follow a roadmap to learn next.
          </p>

          {/* CTA buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/profile")}
              className="rounded-xl px-5 py-3 text-sm font-semibold bg-white text-slate-950
                         transition hover:opacity-90 active:scale-[0.98]"
            >
              Add my skills
            </button>

            <button
              onClick={() => navigate("/analyzer")}
              className="rounded-xl px-5 py-3 text-sm font-semibold border border-slate-800 bg-slate-950
                         transition-all duration-300 ease-out
                         hover:bg-slate-900 hover:border-blue-500/50
                         active:scale-[0.98]"
            >
              Analyze a role
            </button>

            <button
              onClick={() => navigate("/jd")}
              className="rounded-xl px-5 py-3 text-sm font-semibold border border-slate-800 bg-slate-950
                         transition-all duration-300 ease-out
                         hover:bg-slate-900 hover:border-blue-500/50
                         active:scale-[0.98]"
            >
              Paste a job description
            </button>
          </div>

          <div className="mt-4 text-xs text-slate-500">
            Tip: Add 8–12 skills first → then analyze a role to see your match score.
          </div>
        </div>
      </div>

      {/* QUICK STEPS (Clickable cards) */}
      <div className="grid gap-4 md:grid-cols-3">
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
            className="rounded-xl px-4 py-2 text-sm border border-slate-800 bg-slate-950
                       hover:bg-slate-900 transition"
          >
            View all jobs →
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickRoles.map((r) => (
            <button
              key={r.id}
              onClick={() => navigate("/analyzer")}
              className="text-left rounded-2xl border border-slate-800 bg-slate-950 p-4
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
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
          <div className="font-semibold">Job Description Analyzer</div>
          <div className="mt-2 text-sm text-slate-400">
            Paste any real job post and instantly see required skills + your gaps.
          </div>
          <button
            onClick={() => navigate("/jd")}
            className="mt-4 rounded-xl px-4 py-2 text-sm font-semibold bg-white text-slate-950 hover:opacity-90 transition"
          >
            Try JD Analyzer →
          </button>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
          <div className="font-semibold">Track your progress</div>
          <div className="mt-2 text-sm text-slate-400">
            Improve 1–2 skills, re-run analysis, and increase your score step-by-step.
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="mt-4 rounded-xl px-4 py-2 text-sm border border-slate-800 bg-slate-950 hover:bg-slate-900 transition"
          >
            Update my skills →
          </button>
        </div>
      </div>
    </div>
  );
}








// import { Link } from "react-router-dom";

// export default function Landing() {
//   return (
//     <div className="space-y-10">
//       <section className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900 p-8">
//         <div className="max-w-2xl space-y-4">
//           <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
//             Find your skill gaps. Prepare for the right job role.
//           </h1>
//           <p className="text-slate-300">
//             Job seekers often don’t know what skills they’re missing for a role.
//             This app compares your skills with job requirements and shows what to learn next.
//           </p>

//           <div className="flex flex-wrap gap-3 pt-2">
//             <Link
//               to="/profile"
//               className="rounded-xl bg-white text-slate-950 px-5 py-3 text-sm font-semibold hover:opacity-90 transition"
//             >
//               Add my skills
//             </Link>
//             <Link
//               to="/analyzer"
//               className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-900 transition"
//             >
//               Analyze a role
//             </Link>
//           </div>
//         </div>
//       </section>

//       <section className="grid gap-4 sm:grid-cols-3">
//         {[
//           ["1) Add skills", "Create your skill profile with levels."],
//           ["2) Choose role", "Pick a target role from a list."],
//           ["3) See gaps", "Matched, missing skills + score."],
//         ].map(([t, d]) => (
//           <div
//             key={t}
//             className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
//           >
//             <div className="font-semibold">{t}</div>
//             <div className="text-sm text-slate-400 mt-1">{d}</div>
//           </div>
//         ))}
//       </section>
//     </div>
//   );
// }
