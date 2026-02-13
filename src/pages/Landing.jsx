import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900 p-8">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
            Find your skill gaps. Prepare for the right job role.
          </h1>
          <p className="text-slate-300">
            Job seekers often don’t know what skills they’re missing for a role.
            This app compares your skills with job requirements and shows what to learn next.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/profile"
              className="rounded-xl bg-white text-slate-950 px-5 py-3 text-sm font-semibold hover:opacity-90 transition"
            >
              Add my skills
            </Link>
            <Link
              to="/analyzer"
              className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-900 transition"
            >
              Analyze a role
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          ["1) Add skills", "Create your skill profile with levels."],
          ["2) Choose role", "Pick a target role from a list."],
          ["3) See gaps", "Matched, missing skills + score."],
        ].map(([t, d]) => (
          <div
            key={t}
            className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
          >
            <div className="font-semibold">{t}</div>
            <div className="text-sm text-slate-400 mt-1">{d}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
