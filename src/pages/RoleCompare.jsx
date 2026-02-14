// src/pages/RoleCompare.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { roles } from "../data/rolesMock";
import Roadmap from "../components/Roadmap";

function normalize(s) {
  return String(s || "").toLowerCase().trim();
}

function slugifySkill(skill) {
  return String(skill || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

function diffLevel(onlyA, onlyB) {
  const totalExtra = onlyA.length + onlyB.length;
  if (totalExtra <= 4) return "Easy";
  if (totalExtra <= 8) return "Medium";
  return "Hard";
}

export default function RoleCompare() {
  const navigate = useNavigate();

  const [roleAId, setRoleAId] = useState(roles[0]?.id || "");
  const [roleBId, setRoleBId] = useState(roles[1]?.id || roles[0]?.id || "");

  // ✅ active button highlight (white changes based on hover/drag)
  const [activeRoleBtn, setActiveRoleBtn] = useState(roleAId);

  const roleA = useMemo(() => roles.find((r) => r.id === roleAId), [roleAId]);
  const roleB = useMemo(() => roles.find((r) => r.id === roleBId), [roleBId]);

  // keep active button valid when dropdown changes
  // (if active is not A or B, default to A)
  useMemo(() => {
    if (activeRoleBtn !== roleAId && activeRoleBtn !== roleBId) {
      setActiveRoleBtn(roleAId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleAId, roleBId]);

  const data = useMemo(() => {
    const aSkills = (roleA?.skills || []).map(normalize);
    const bSkills = (roleB?.skills || []).map(normalize);

    const aSet = new Set(aSkills);
    const bSet = new Set(bSkills);

    const common = (roleA?.skills || []).filter((s) => bSet.has(normalize(s)));
    const onlyA = (roleA?.skills || []).filter((s) => !bSet.has(normalize(s)));
    const onlyB = (roleB?.skills || []).filter((s) => !aSet.has(normalize(s)));

    const difficulty = diffLevel(onlyA, onlyB);

    return { common, onlyA, onlyB, difficulty };
  }, [roleA, roleB]);

  function Pill({ children, variant = "neutral", onClick, title }) {
  const base =
    "text-sm px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer";

  const styles =
    variant === "good"
      // Common skills (green style)
      ? "bg-emerald-950/40 border-emerald-900 text-emerald-200 " +
        "hover:bg-white hover:text-slate-950 hover:border-white"
      : variant === "bad"
      ? "bg-slate-900/40 border-slate-800 text-slate-200 " +
        "hover:bg-white hover:text-slate-950 hover:border-white"
      // Neutral skills (HTML, CSS, etc.)
      : "bg-slate-900/30 border-slate-800 text-slate-200 " +
        "hover:bg-white hover:text-slate-950 hover:border-white";

    return (
      <button onClick={onClick} title={title} className={`${base} ${styles}`}>
        {children}
      </button>
    );
  }

  function Card({ title, subtitle, count, countCls, children }) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-bold">{title}</div>
            {subtitle ? (
              <div className="text-sm text-slate-400">{subtitle}</div>
            ) : null}
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full border ${
              countCls || "border-slate-700 bg-slate-900/30 text-slate-200"
            }`}
          >
            {count}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">{children}</div>
      </div>
    );
  }

  const canCompare = roleA && roleB;

  const primaryBtnCls =
    "rounded-xl px-4 py-2 text-sm font-semibold transition";
  const activeCls = "bg-white text-slate-950 hover:opacity-90";
  const inactiveCls =
    "text-slate-200 border border-slate-800 bg-slate-950 hover:bg-slate-900";

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-slate-400">Comparing</div>
        <h2 className="text-2xl font-bold">
          {roleA?.title || "Role A"} <span className="text-slate-500">vs</span>{" "}
          {roleB?.title || "Role B"}
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          See what’s common between two roles and what extra skills you need for
          each path.
        </p>
      </div>

      {/* Pick roles */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-slate-300">Role A</label>
            <select
              value={roleAId}
              onChange={(e) => setRoleAId(e.target.value)}
              className="mt-2 w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm outline-none focus:border-slate-600"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-300">Role B</label>
            <select
              value={roleBId}
              onChange={(e) => setRoleBId(e.target.value)}
              className="mt-2 w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm outline-none focus:border-slate-600"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats chips */}
        {canCompare && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs px-3 py-1.5 rounded-full border border-emerald-900 bg-emerald-950/40 text-emerald-200">
              Common: {data.common.length}
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full border border-slate-800 bg-slate-900/30 text-slate-200">
              Only A: {data.onlyA.length}
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full border border-slate-800 bg-slate-900/30 text-slate-200">
              Only B: {data.onlyB.length}
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full border border-slate-800 bg-slate-900/30 text-slate-200">
              Difficulty: {data.difficulty}
            </span>
          </div>
        )}
      </div>

      {/* Compare */}
      {!canCompare ? (
        <div className="text-slate-400">Select two roles to compare.</div>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Common */}
            <Card
              title="Common skills"
              subtitle="Skills useful for both roles"
              count={data.common.length}
              countCls="border-emerald-900 bg-emerald-950/40 text-emerald-200"
            >
              {data.common.length === 0 ? (
                <div className="text-sm text-slate-400">No common skills.</div>
              ) : (
                data.common.map((s) => (
                  <Pill
                    key={s}
                    variant="good"
                    title="Open this skill in Role A roadmap"
                    onClick={() =>
                      navigate(`/jobs/${roleAId}?focus=${encodeURIComponent(s)}`)
                    }
                  >
                    {s}
                  </Pill>
                ))
              )}
            </Card>

            {/* Only A */}
            <Card
              title={`Extra for ${roleA?.title}`}
              subtitle="Skills you need if targeting Role A"
              count={data.onlyA.length}
              countCls="border-slate-700 bg-slate-900/30 text-slate-200"
            >
              {data.onlyA.length === 0 ? (
                <div className="text-sm text-slate-400">No extra skills.</div>
              ) : (
                data.onlyA.map((s) => (
                  <Pill
                    key={s}
                    variant="neutral"
                    title="Click to open Role A learning roadmap for this skill"
                    onClick={() =>
                      navigate(`/jobs/${roleAId}?focus=${encodeURIComponent(s)}`)
                    }
                  >
                    {s}
                  </Pill>
                ))
              )}
            </Card>

            {/* Only B */}
            <Card
              title={`Extra for ${roleB?.title}`}
              subtitle="Skills you need if targeting Role B"
              count={data.onlyB.length}
              countCls="border-slate-700 bg-slate-900/30 text-slate-200"
            >
              {data.onlyB.length === 0 ? (
                <div className="text-sm text-slate-400">No extra skills.</div>
              ) : (
                data.onlyB.map((s) => (
                  <Pill
                    key={s}
                    variant="neutral"
                    title="Click to open Role B learning roadmap for this skill"
                    onClick={() =>
                      navigate(`/jobs/${roleBId}?focus=${encodeURIComponent(s)}`)
                    }
                  >
                    {s}
                  </Pill>
                ))
              )}
            </Card>
          </div>

          {/* Quick Recommendation */}
          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 space-y-2">
            <div className="text-lg font-bold">Quick Recommendation</div>
            <p className="text-sm text-slate-300">
              Start by mastering the{" "}
              <span className="text-white font-semibold">common skills</span>{" "}
              first. Then pick one role and learn its extra skills step-by-step.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onMouseEnter={() => setActiveRoleBtn(roleAId)}
                onFocus={() => setActiveRoleBtn(roleAId)}
                onClick={() => navigate(`/jobs/${roleAId}`)}
                className={`${primaryBtnCls} ${
                  activeRoleBtn === roleAId ? activeCls : inactiveCls
                }`}
              >
                View {roleA?.title} details →
              </button>

              <button
                onMouseEnter={() => setActiveRoleBtn(roleBId)}
                onFocus={() => setActiveRoleBtn(roleBId)}
                onClick={() => navigate(`/jobs/${roleBId}`)}
                className={`${primaryBtnCls} ${
                  activeRoleBtn === roleBId ? activeCls : inactiveCls
                }`}
              >
                View {roleB?.title} details →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
