import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const inputCls =
  "w-full rounded-2xl px-5 py-3.5 text-sm outline-none transition-all " +
  "focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500";

const FEATURES = [
  {
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "#3b82f6",
    title: "Personalised Goal Setting",
    desc: "Define your career objectives and let us map the path to achievement.",
  },
  {
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    color: "#8b5cf6",
    title: "Growth Tracking",
    desc: "Visualise your progress in real-time as you acquire new industry skills.",
  },
  {
    icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    color: "#ec4899",
    title: "Direct Job Matching",
    desc: "Get introduced to roles that match your competency profile perfectly.",
  },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) return setError("Passwords do not match");
    if (form.password.length < 6) return setError("Password must be at least 6 characters");
    setLoading(true);
    setError("");
    try {
      await register(form.name, form.email, form.password);
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Fair", "Strong"];
  const strengthColor = ["", "bg-rose-500", "bg-amber-400", "bg-emerald-500"];

  return (
    <div className="min-h-screen flex -mt-20">

      {/* ── Left showcase panel ───────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12"
           style={{ background: "var(--bg-surface)", borderRight: "1px solid var(--bd-default)" }}>

        {/* Ambient orbs */}
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[130px] pointer-events-none"
             style={{ background: "rgba(37,99,235,0.10)" }} />
        <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] rounded-full blur-[130px] pointer-events-none"
             style={{ background: "rgba(124,58,237,0.08)" }} />

        <div className="relative z-10 max-w-lg">
          {/* Logo */}
          <div className="mb-10 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 grid place-items-center">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight" style={{ color: "var(--tx-primary)" }}>SkillNova</span>
          </div>

          <h1 className="text-4xl font-extrabold leading-tight mb-8"
              style={{ letterSpacing: "-0.04em", color: "var(--tx-primary)" }}>
            Start Your Journey to{" "}
            <br />
            <span className="neon-text font-black">Professional Mastery.</span>
          </h1>

          <div className="space-y-6">
            {FEATURES.map(({ icon, color, title, desc }) => (
              <div key={title} className="flex gap-5">
                <div className="h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center"
                     style={{ background: "var(--bg-card)", border: "1px solid var(--bd-default)" }}>
                  <svg className="h-6 w-6" fill="none" stroke={color} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: "var(--tx-primary)" }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--tx-secondary)" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 py-16 animate-in"
           style={{ background: "var(--bg-main)" }}>
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="inline-flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 grid place-items-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-2xl font-bold" style={{ color: "var(--tx-primary)" }}>SkillNova</span>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl mb-2">Create profile</h2>
            <p className="text-sm" style={{ color: "var(--tx-secondary)" }}>
              Join thousands of developers mastering their craft
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { label: "Full Name",     name: "name",  type: "text",  placeholder: "Eleanor Shellstrop" },
              { label: "Email Address", name: "email", type: "email", placeholder: "alex@example.io"    },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name} className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider ml-1"
                       style={{ color: "var(--tx-muted)" }}>
                  {label}
                </label>
                <input type={type} name={name} value={form[name]}
                       onChange={handleChange} placeholder={placeholder} required
                       className={inputCls}
                       style={{ background: "var(--bg-surface)", border: "1px solid var(--bd-default)", color: "var(--tx-primary)" }} />
              </div>
            ))}

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider ml-1"
                     style={{ color: "var(--tx-muted)" }}>
                Password
              </label>
              <input type="password" name="password" value={form.password}
                     onChange={handleChange} placeholder="Create a strong password" required
                     className={inputCls}
                     style={{ background: "var(--bg-surface)", border: "1px solid var(--bd-default)", color: "var(--tx-primary)" }} />
              {form.password.length > 0 && (
                <div className="mt-2 flex items-center gap-2 pl-1">
                  <div className="flex-1 h-1 rounded-full overflow-hidden"
                       style={{ background: "var(--bd-default)" }}>
                    <div className={`h-full rounded-full transition-all duration-300 ${strengthColor[strength]}`}
                         style={{ width: `${(strength / 3) * 100}%` }} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter"
                        style={{ color: "var(--tx-muted)" }}>
                    {strengthLabel[strength]}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider ml-1"
                     style={{ color: "var(--tx-muted)" }}>
                Confirm Password
              </label>
              <input type="password" name="confirm" value={form.confirm}
                     onChange={handleChange} placeholder="Confirm your password" required
                     className={inputCls}
                     style={{ background: "var(--bg-surface)", border: "1px solid var(--bd-default)", color: "var(--tx-primary)" }} />
            </div>

            {error && (
              <div className="p-4 rounded-xl flex items-center gap-3 text-sm"
                   style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444" }}>
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
                    className="btn-primary w-full rounded-2xl py-4 text-sm justify-center
                               disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Initializing…
                </span>
              ) : "Get Started Free"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm" style={{ color: "var(--tx-secondary)" }}>
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-violet-500 hover:underline">
              Log in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
