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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Jobs Explorer</h2>
        <p className="text-sm text-slate-400">
          Learn what each role needs, its advantages, and a simple learning path.
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Note: Demand levels are simplified (High/Medium) for demo purposes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
              className="group cursor-pointer rounded-3xl border border-slate-800 bg-slate-950 p-6 space-y-4
                         transition-all duration-300 ease-out
                         hover:-translate-y-2 hover:scale-[1.02]
                         hover:border-blue-500/70 hover:bg-slate-900
                         hover:shadow-2xl hover:shadow-blue-500/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-bold flex items-center gap-2">
                    {role.title}
                    <span className="text-slate-500 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                      ↗
                    </span>
                  </div>
                  <div className="text-sm text-slate-400">
                    Core skills: {role.skills.length}
                  </div>
                </div>

                <Badge text={demand} />
              </div>

              <div>
                <div className="text-sm font-semibold">Advantages</div>
                <ul className="mt-2 text-sm text-slate-300 list-disc pl-5 space-y-1">
                  {advantages.slice(0, 3).map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-sm font-semibold">What you should know</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {role.skills.slice(0, 8).map((s) => (
                    <span
                      key={s}
                      className="text-xs px-3 py-1.5 rounded-full border border-slate-800 bg-slate-900/40 text-slate-200
                                 transition-all duration-300 group-hover:border-blue-500/50"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold">Suggested learning path</div>
                <div className="mt-2 text-sm text-slate-300 transition-colors duration-300 group-hover:text-slate-200">
                  {path.join("  →  ")}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
