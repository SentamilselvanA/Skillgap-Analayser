import { roles } from "../data/rolesMock";
import { ROLE_INSIGHTS } from "../data/roleInsights";
import { useNavigate } from "react-router-dom";

function Badge({ text }) {
  const style =
    text === "High"
      ? { background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981" }
      : { background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", color: "#f59e0b" };

  return (
    <span className="text-xs px-2 py-1 rounded-full font-bold" style={style}>
      Demand: {text}
    </span>
  );
}

export default function Jobs() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-12 animate-in">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black tracking-tight">Jobs Explorer</h2>
        <p className="max-w-2xl leading-relaxed" style={{ color: "var(--tx-secondary)" }}>
          Discover high-demand roles, understand the key advantages, and follow a structured learning path
          to reach your career goals.
        </p>
        <div className="flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full w-fit text-[10px] font-bold uppercase tracking-widest"
             style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", color: "#3b82f6" }}>
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
          Live Market Demand Data
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {roles.map((role) => {
          const info = ROLE_INSIGHTS[role.id];
          const demand = info?.demand || "Medium";
          const advantages = info?.advantages || ["Good career option with consistent opportunities."];
          const path = info?.path || role.skills.slice(0, 6);

          return (
            <div key={role.id}
                 role="button" tabIndex={0}
                 onClick={() => navigate(`/jobs/${role.id}`)}
                 onKeyDown={(e) => e.key === "Enter" && navigate(`/jobs/${role.id}`)}
                 className="group relative flex flex-col justify-between rounded-3xl p-6 cursor-pointer
                            transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
                 style={{ background: "var(--bg-card)", border: "1px solid var(--bd-default)" }}>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                   style={{ background: "rgba(59,130,246,0.03)" }} />

              <div className="relative z-10 space-y-6">
                {/* Title + badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--tx-primary)" }}>
                      {role.title}
                      <svg className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                           fill="none" stroke="currentColor" viewBox="0 0 24 24"
                           style={{ color: "var(--tx-muted)" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </h3>
                    <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--tx-muted)" }}>
                      {role.skills.length} Required Skills
                    </div>
                  </div>
                  <Badge text={demand} />
                </div>

                {/* Advantages */}
                <div className="space-y-3">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: "var(--tx-muted)" }}>
                    Key Advantages
                  </div>
                  <ul className="space-y-2">
                    {advantages.slice(0, 2).map((a) => (
                      <li key={a} className="flex gap-2 text-xs leading-relaxed italic" style={{ color: "var(--tx-secondary)" }}>
                        <span style={{ color: "#3b82f6" }}>•</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Top skills */}
                <div className="space-y-3">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: "var(--tx-muted)" }}>
                    Top Skills
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {role.skills.slice(0, 5).map((s) => (
                      <span key={s}
                            className="text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all duration-200"
                            style={{ background: "var(--bg-surface)", border: "1px solid var(--bd-default)", color: "var(--tx-secondary)" }}>
                        {s}
                      </span>
                    ))}
                    {role.skills.length > 5 && (
                      <span className="text-[10px] font-bold px-1 py-1" style={{ color: "var(--tx-muted)" }}>
                        +{role.skills.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                {/* Roadmap path */}
                <div className="pt-4" style={{ borderTop: "1px solid var(--bd-subtle)" }}>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: "var(--tx-muted)" }}>
                    Roadmap path
                  </div>
                  <div className="text-xs font-bold truncate transition-colors duration-200 group-hover:text-blue-500"
                       style={{ color: "var(--tx-secondary)" }}>
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
