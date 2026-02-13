import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-3">

        {/* BRAND */}
        <div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-800 grid place-items-center font-bold">
              SG
            </div>
            <div className="font-semibold text-lg">SkillGap</div>
          </div>

          <p className="mt-4 text-sm text-slate-400 leading-relaxed">
            Helping job seekers identify missing skills,
            understand job demand, and build a clear learning roadmap.
          </p>

          <p className="mt-4 text-xs text-slate-500">
            Designed for students, developers, and career switchers.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <div className="font-semibold mb-4">Explore</div>

          <div className="flex flex-col gap-3 text-sm text-slate-400">

            <Link to="/profile" className="hover:text-blue-400 transition">
              Add Skills
            </Link>

            <Link to="/analyzer" className="hover:text-blue-400 transition">
              Role Analyzer
            </Link>

            <Link to="/jd" className="hover:text-blue-400 transition">
              JD Analyzer
            </Link>

            <Link to="/jobs" className="hover:text-blue-400 transition">
              Jobs Explorer
            </Link>

          </div>
        </div>

        {/* CONTACT */}
        <div>
          <div className="font-semibold mb-4">Contact</div>

          <div className="space-y-3 text-sm text-slate-400">

            <div>
              📧 Email:{" "}
              <a
                href="mailto:selvanasentamil@gmail.com"
                className="hover:text-blue-400 transition"
              >
               selvanasentamil@gmail.com
              </a>
            </div>

            <div>
              💼 LinkedIn:{" "}
              <a
                href="https://www.linkedin.com/in/sentamil-selvan-736760327/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-400 transition"
              >
                Sentamilselvan
              </a>
            </div>

            <div>
              📝 Feedback:{" "}
              <Link
                to="/"
                className="hover:text-blue-400 transition"
              >
                Send Suggestions
              </Link>
            </div>

          </div>

          {/* Call To Action */}
          <div className="mt-6">
            <Link
              to="/profile"
              className="inline-block px-4 py-2 rounded-lg text-sm font-semibold
                         bg-white text-slate-950
                         hover:opacity-90 transition"
            >
              Start Improving →
            </Link>
          </div>
        </div>
      </div>

      {/* BOTTOM STRIP */}
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} SkillGap. All rights reserved.
      </div>
    </footer>
  );
}
