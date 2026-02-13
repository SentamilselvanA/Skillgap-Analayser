import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm transition ${
    isActive
      ? "bg-slate-800 text-white"
      : "text-slate-300 hover:bg-slate-900 hover:text-white"
  }`;

export default function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="w-full px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-slate-800 grid place-items-center font-bold">
            SG
          </div>
          <div>
            <div className="font-semibold leading-tight">SkillGap</div>
            <div className="text-xs text-slate-400 -mt-0.5">
              Compare skills • Find gaps • Plan
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/profile" className={linkClass}>
            Profile
          </NavLink>
          <NavLink to="/analyzer" className={linkClass}>
            Analyzer
          </NavLink>
          <NavLink to="/jobs" className={linkClass}>
  Jobs
</NavLink>

        </nav>
      </div>
    </header>
  );
}
