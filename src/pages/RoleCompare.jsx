import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { roles } from "../data/rolesMock";
import Roadmap from "../components/Roadmap.jsx";

function normalize(s) {
  return String(s || "").toLowerCase().trim();
}

function diffLevel(onlyA, onlyB) {
  const total = onlyA.length + onlyB.length;
  if (total <= 4) return "Easy";
  if (total <= 8) return "Medium";
  return "Hard";
}

const card = {
  background: "var(--bg-card)",
  border: "1px solid var(--bd-default)",
  borderRadius: "1.5rem",
};

const surface = {
  background: "var(--bg-surface)",
  border: "1px solid var(--bd-default)",
  borderRadius: "0.75rem",
};

const selectStyle = {
  background: "var(--bg-surface)",
  border: "1px solid var(--bd-default)",
  color: "var(--tx-primary)",
  borderRadius: "1rem",
  width: "100%",
  padding: "1rem 1.25rem",
  fontSize: "0.875rem",
  fontWeight: 500,
  outline: "none",
  appearance: "none",
};

function Pill({ children, variant = "neutral", onClick, title }) {
  const base = "text-xs font-bold px-3 py-2 rounded-xl border transition-all duration-200 cursor-pointer hover:scale-[1.04]";
  const styles = variant === "good"
    ? { background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981" }
    : { background: "var(--bg-surface)", border: "1px solid var(--bd-default)", color: "var(--tx-secondary)" };

  return (
    <button onClick={onClick} title={title} className={base} style={styles}>
      {children}
    </button>
  );
}

function Card({ title, subtitle, count, countVariant = "neutral", children }) {
  const countStyle = countVariant === "good"
    ? { background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981" }
    : { background: "var(--bg-surface)", border: "1px solid var(--bd-default)", color: "var(--tx-muted)" };

  return (
    <div className="p-8 space-y-6 shadow-sm" style={card}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-lg font-bold" style={{ color: "var(--tx-primary)" }}>{title}</div>
          {subtitle && (
            <div className="text-xs leading-relaxed italic" style={{ color: "var(--tx-muted)" }}>
              {subtitle}
            </div>
          )}
        </div>
        <span className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest"
              style={countStyle}>
          {count} Items
        </span>
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export default function RoleCompare() {
  const navigate = useNavigate();
  const [roleAId, setRoleAId] = useState(roles[0]?.id || "");
  const [roleBId, setRoleBId] = useState(roles[1]?.id || roles[0]?.id || "");
  const [activeRoleBtn, setActiveRoleBtn] = useState(roleAId);

  const roleA = useMemo(() => roles.find((r) => r.id === roleAId), [roleAId]);
  const roleB = useMemo(() => roles.find((r) => r.id === roleBId), [roleBId]);

  useMemo(() => {
    if (activeRoleBtn !== roleAId && activeRoleBtn !== roleBId) setActiveRoleBtn(roleAId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleAId, roleBId]);

  const data = useMemo(() => {
    const aSkills = (roleA?.skills || []).map(normalize);
    const bSkills = (roleB?.skills || []).map(normalize);
    const aSet = new Set(aSkills);
    const bSet = new Set(bSkills);
    return {
      common: (roleA?.skills || []).filter((s) => bSet.has(normalize(s))),
      onlyA:  (roleA?.skills || []).filter((s) => !bSet.has(normalize(s))),
      onlyB:  (roleB?.skills || []).filter((s) => !aSet.has(normalize(s))),
      difficulty: diffLevel(
        (roleA?.skills || []).filter((s) => !bSet.has(normalize(s))),
        (roleB?.skills || []).filter((s) => !aSet.has(normalize(s)))
      ),
    };
  }, [roleA, roleB]);

  const canCompare = roleA && roleB;

  return (
    <div className="space-y-10 pb-20 animate-in">

      {/* ── Page header ──────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="text-xs font-black uppercase tracking-[0.2em]"
             style={{ color: "var(--tx-accent)" }}>
          Strategy Mode
        </div>

        {/* Gradient VS headline */}
        <h2 className="text-4xl font-black tracking-tighter leading-tight">
          <span style={{ color: "var(--tx-primary)" }}>{roleA?.title || "Role A"}</span>
          {" "}
          <span className="text-2xl font-black mx-1" style={{ color: "var(--tx-muted)" }}>VS</span>
          {" "}
          <span style={{ color: "var(--tx-primary)" }}>{roleB?.title || "Role B"}</span>
        </h2>

        <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "var(--tx-secondary)" }}>
          Cross-reference skill requirements between roles to identify shared competencies and
          bridge the gap in your career transition.
        </p>
      </div>

      {/* ── Role selectors ───────────────────────────────────── */}
      <div className="p-8 space-y-8 shadow-sm" style={card}>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest ml-1"
                   style={{ color: "var(--tx-muted)" }}>
              Baseline Role (A)
            </label>
            <select value={roleAId} onChange={(e) => setRoleAId(e.target.value)} style={selectStyle}>
              {roles.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest ml-1"
                   style={{ color: "var(--tx-muted)" }}>
              Target Role (B)
            </label>
            <select value={roleBId} onChange={(e) => setRoleBId(e.target.value)} style={selectStyle}>
              {roles.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
            </select>
          </div>
        </div>

        {/* Stats chips */}
        {canCompare && (
          <div className="flex flex-wrap gap-3 pt-4"
               style={{ borderTop: "1px solid var(--bd-subtle)" }}>
            {[
              { label: `Overlap: ${data.common.length} Skills`, color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" },
              { label: `Unique A: ${data.onlyA.length}`,        color: "var(--tx-muted)", bg: "var(--bg-surface)", border: "var(--bd-default)" },
              { label: `Unique B: ${data.onlyB.length}`,        color: "var(--tx-muted)", bg: "var(--bg-surface)", border: "var(--bd-default)" },
              { label: `Level: ${data.difficulty}`,             color: "var(--tx-accent)", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)", ml: true },
            ].map(({ label, color, bg, border, ml }) => (
              <div key={label}
                   className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${ml ? "ml-auto" : ""}`}
                   style={{ background: bg, border: `1px solid ${border}`, color }}>
                {label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Comparison cards ─────────────────────────────────── */}
      {!canCompare ? (
        <div className="flex flex-col items-center justify-center py-20 italic"
             style={{ color: "var(--tx-muted)" }}>
          Select two different roles to begin analysis.
        </div>
      ) : (
        <div className="space-y-10">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card title="Common Foundation"
                  subtitle="Skills transferable between both career paths"
                  count={data.common.length}
                  countVariant="good">
              {data.common.length === 0 ? (
                <div className="text-xs py-2" style={{ color: "var(--tx-muted)" }}>
                  No overlapping skills identified.
                </div>
              ) : (
                data.common.map((s) => (
                  <Pill key={s} variant="good" title="Focus on this shared asset"
                        onClick={() => navigate(`/jobs/${roleAId}?focus=${encodeURIComponent(s)}`)}>
                    {s}
                  </Pill>
                ))
              )}
            </Card>

            <Card title={`Role A: ${roleA?.title.split(" ")[0]} Spec`}
                  subtitle={`Exclusive competencies for ${roleA?.title}`}
                  count={data.onlyA.length}>
              {data.onlyA.length === 0 ? (
                <div className="text-xs py-2" style={{ color: "var(--tx-muted)" }}>
                  No unique skills found for this role.
                </div>
              ) : (
                data.onlyA.map((s) => (
                  <Pill key={s} title="Analyze learning path"
                        onClick={() => navigate(`/jobs/${roleAId}?focus=${encodeURIComponent(s)}`)}>
                    {s}
                  </Pill>
                ))
              )}
            </Card>

            <Card title={`Role B: ${roleB?.title.split(" ")[0]} Spec`}
                  subtitle={`Exclusive competencies for ${roleB?.title}`}
                  count={data.onlyB.length}>
              {data.onlyB.length === 0 ? (
                <div className="text-xs py-2" style={{ color: "var(--tx-muted)" }}>
                  No unique skills found for this role.
                </div>
              ) : (
                data.onlyB.map((s) => (
                  <Pill key={s} title="Analyze learning path"
                        onClick={() => navigate(`/jobs/${roleBId}?focus=${encodeURIComponent(s)}`)}>
                    {s}
                  </Pill>
                ))
              )}
            </Card>
          </div>

          {/* Recommendation */}
          <div className="p-10 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-8"
               style={card}>
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-black text-amber-500 uppercase tracking-widest">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.336-6.364l-.707-.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M12 11v5" />
                </svg>
                Transition Strategy
              </div>
              <h3 className="text-2xl">Expert Roadmap Recommendation</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--tx-secondary)" }}>
                Master the{" "}
                <span className="font-bold" style={{ color: "var(--tx-primary)" }}>
                  common foundation
                </span>{" "}
                to gain versatility. Then, prioritize the unique skills of your target role
                to solidify your competitive edge.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              {[
                { id: roleAId, label: `Explore ${roleA?.title.split(" ")[0]} Path` },
                { id: roleBId, label: `Explore ${roleB?.title.split(" ")[0]} Path` },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onMouseEnter={() => setActiveRoleBtn(id)}
                  onFocus={() => setActiveRoleBtn(id)}
                  onClick={() => navigate(`/jobs/${id}`)}
                  className={`rounded-2xl px-6 py-3 text-sm font-bold shadow-lg transition-all duration-300 active:scale-[0.98] ${
                    activeRoleBtn === id ? "btn-primary" : "btn-ghost"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
