import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { roles } from "../data/rolesMock";
import { ROLE_INSIGHTS } from "../data/roleInsights";
import Roadmap from "../components/Roadmap";

export default function JobDetails() {
  const { roleId } = useParams();

  const role = useMemo(() => roles.find((r) => r.id === roleId), [roleId]);
  const info = role ? ROLE_INSIGHTS[role.id] : null;

  if (!role) {
    return (
      <div className="space-y-4">
        <div className="text-2xl font-bold">Role not found</div>
        <Link
          to="/jobs"
          className="inline-flex items-center rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 hover:bg-slate-900 transition"
        >
          ← Back to Jobs
        </Link>
      </div>
    );
  }

  const demand = info?.demand || "Medium";
  const advantages = info?.advantages || ["Good career option with consistent opportunities."];
  const path = info?.path || role.skills;

  // Roadmap expects missingSkills; here we reuse it as "what to learn"
  // (Later we can connect it with user skills to show actual missing)
  const learnList = path;

  const badge =
    demand === "High"
      ? "bg-emerald-950/40 border-emerald-900 text-emerald-200"
      : "bg-amber-950/40 border-amber-900 text-amber-200";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-slate-400">Role</div>
          <h2 className="text-2xl font-bold">{role.title}</h2>
          <div className="mt-2 inline-flex text-xs px-2 py-1 rounded-full border {badge}"></div>
          <span className={`inline-flex text-xs px-2 py-1 rounded-full border ${badge}`}>
            Demand: {demand}
          </span>
        </div>

        <Link
          to="/jobs"
          className="inline-flex items-center rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 hover:bg-slate-900 transition"
        >
          ← Back
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1 rounded-3xl border border-slate-800 bg-slate-950 p-6 space-y-4">
          <div>
            <div className="text-sm text-slate-400">Advantages</div>
            <ul className="mt-2 text-sm text-slate-300 list-disc pl-5 space-y-1">
              {advantages.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-sm text-slate-400">Core skills</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {role.skills.map((s) => (
                <span
                  key={s}
                  className="text-xs px-3 py-1.5 rounded-full border border-slate-800 bg-slate-900/40 text-slate-200"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
            <div className="font-semibold">Suggested learning path</div>
            <div className="mt-2 text-sm text-slate-300">
              {path.join("  →  ")}
            </div>
          </div>

          {/* Reuse Roadmap to show how to learn these */}
          <Roadmap missingSkills={learnList} />
        </div>
      </div>
    </div>
  );
}
