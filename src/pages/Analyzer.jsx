import { useMemo, useState } from "react";
import { roles } from "../data/rolesMock";
import { loadSkills } from "../utils/storage";
import { compareSkills } from "../utils/compareSkills";
import ProgressBar from "../components/ProgressBar";
import SkillList from "../components/SkillList";

export default function Analyzer() {
  const userSkills = useMemo(() => loadSkills(), []);
  const [roleId, setRoleId] = useState(roles[0]?.id || "");
  const [result, setResult] = useState(null);

  const selectedRole = roles.find((r) => r.id === roleId);

  function analyze() {
    const roleSkills = selectedRole?.skills || [];
    const r = compareSkills(userSkills, roleSkills);
    setResult({
      ...r,
      roleTitle: selectedRole?.title || "Unknown role",
      total: roleSkills.length,
    });
  }

  const hasSkills = userSkills.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Role Analyzer</h2>
        <p className="text-sm text-slate-400">
          Select a role and compare it with your current skills.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1 rounded-3xl border border-slate-800 bg-slate-950 p-6 space-y-4">
          <div>
            <div className="text-sm text-slate-400">Your skills</div>
            <div className="text-xl font-semibold">{userSkills.length}</div>
          </div>

          <div>
            <label className="text-sm text-slate-300">Target role</label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="mt-2 w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm outline-none focus:border-slate-600"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={analyze}
            disabled={!hasSkills}
            className="w-full rounded-xl px-4 py-3 text-sm font-semibold bg-white text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
          >
            Compare now
          </button>

          {!hasSkills && (
            <div className="text-sm text-rose-300">
              Add your skills in the Profile page first.
            </div>
          )}
        </div>

        <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-950 p-6">
          {!result ? (
            <div className="text-slate-400">
              Click <span className="text-slate-200 font-semibold">Compare now</span> to
              see matched and missing skills.
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm text-slate-400">Role</div>
                  <div className="text-xl font-bold">{result.roleTitle}</div>
                </div>
                <div className="text-sm text-slate-300">
                  Total required skills:{" "}
                  <span className="font-semibold text-white">{result.total}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-slate-300">Match score</div>
                  <div className="font-semibold">{result.score}%</div>
                </div>
                <ProgressBar value={result.score} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <SkillList title="Matched skills" items={result.matched} variant="good" />
                <SkillList title="Missing skills" items={result.missing} variant="bad" />
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <div className="font-semibold">Next steps</div>
                <ul className="mt-2 text-sm text-slate-300 list-disc pl-5 space-y-1">
                  <li>Start with 1–2 missing skills and build a small project.</li>
                  <li>Add those skills to your profile once you practice them.</li>
                  <li>Repeat analysis until you reach 80%+ match.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
