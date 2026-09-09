import { roles } from "../data/rolesMock";
import { ROLE_INSIGHTS } from "../data/roleInsights";
import { useNavigate } from "react-router-dom";

function Badge({ text }) {
  const cls =
    text === "High"
      ? "bg-emerald-950/40 border-emerald-900 text-emerald-200"
      : "bg-amber-950/40 border-amber-900 text-amber-200";

  return (
    <span className={`text-xs px-2 py-1 rounded-full border ${cls}`}>
      Demand: {text}
    </span>
  );
}

export default function Jobs() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-12 animate-in">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Jobs Explorer</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Discover high-demand roles, understand the key advantages, and follow a structured learning path 
          to reach your career goals.
        </p>
        <div className="flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 text-[10px] font-bold text-blue-600 dark:text-blue-400 w-fit uppercase tracking-widest">
           <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
           Live Market Demand Data
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {roles.map((role) => {
          const info = ROLE_INSIGHTS[role.id];
          const demand = info?.demand || "Medium";
          const advantages = info?.advantages || [
            "Good career option with consistent opportunities.",
          ];
          const path = info?.path || role.skills.slice(0, 6);

          return (
            <div
              key={role.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/jobs/${role.id}`)}
              onKeyDown={(e) => e.key === "Enter" && navigate(`/jobs/${role.id}`)}
              className="group relative flex flex-col justify-between rounded-3xl border border-accent bg-card p-6 
                         transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                         hover:-translate-y-2 hover:border-blue-500/50 dark:hover:border-blue-400/50
                         hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/5 active:scale-[0.98]"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/0 to-indigo-500/0 opacity-0 transition-opacity duration-500 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 group-hover:opacity-100" />

              <div className="relative z-10 space-y-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                       {role.title}
                       <svg className="h-4 w-4 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                       </svg>
                    </h3>
                    <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      {role.skills.length} Required Skills
                    </div>
                  </div>
                  <Badge text={demand} />
                </div>

                <div className="space-y-3">
                  <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Key Advantages</div>
                  <ul className="space-y-2">
                    {advantages.slice(0, 2).map((a) => (
                      <li key={a} className="flex gap-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                        <span className="text-blue-500">•</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Top Skills</div>
                  <div className="flex flex-wrap gap-1.5">
                    {role.skills.slice(0, 5).map((s) => (
                      <span
                        key={s}
                        className="text-[10px] px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300
                                   font-bold transition-all duration-300 group-hover:border-blue-500/20 group-hover:bg-blue-500/5"
                      >
                        {s}
                      </span>
                    ))}
                    {role.skills.length > 5 && (
                      <span className="text-[10px] font-bold text-slate-400 px-1 py-1">+{role.skills.length - 5}</span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">Roadmap path</div>
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                      {path.join(" → ")}
                    </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

