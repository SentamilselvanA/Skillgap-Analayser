import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const inputCls =
  "w-full rounded-2xl px-5 py-4 text-sm outline-none transition-all " +
  "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex -mt-20">

      {/* ── Left panel — intentionally dark showcase ─────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12"
           style={{ background: "#0B0E14" }}>
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px]"
             style={{ background: "rgba(37,99,235,0.18)" }} />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[120px]"
             style={{ background: "rgba(124,58,237,0.15)" }} />

        <div className="relative z-10 max-w-lg">
          <div className="mb-8 inline-flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600
                            shadow-xl shadow-blue-500/20 grid place-items-center">
              <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">SkillNova</span>
          </div>

          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6"
              style={{ letterSpacing: "-0.04em" }}>
            Analyse. Grow.{" "}
            <br />
            <span className="neon-text">Excel with Precision.</span>
          </h1>

          <p className="text-lg mb-10 leading-relaxed" style={{ color: "#94A3B8" }}>
            The most advanced skill gap analysis platform for modern developers.
            Identify missing competencies, track your progress, and land your dream role.
          </p>

          <div className="grid grid-cols-2 gap-6">
            {[
              { value: "98%",  label: "Matching Accuracy" },
              { value: "500+", label: "Industry Roles"    },
            ].map(({ value, label }) => (
              <div key={label} className="p-4 rounded-2xl"
                   style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="text-2xl font-bold text-white mb-1">{value}</div>
                <div className="text-sm" style={{ color: "#64748B" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-10 left-10 opacity-10">
          <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
            <circle cx="200" cy="200" r="150" stroke="white" strokeWidth="0.5" strokeDasharray="10 10" />
            <circle cx="200" cy="200" r="100" stroke="white" strokeWidth="1" />
            <path d="M200 100 L200 300 M100 200 L300 200" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>
      </div>

      {/* ── Right panel — form, uses CSS variables ───────────── */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 animate-in"
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
            <h2 className="text-3xl mb-2">Welcome back</h2>
            <p className="text-sm" style={{ color: "var(--tx-secondary)" }}>
              Enter your credentials to access your profile
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold" style={{ color: "var(--tx-secondary)" }}>
                Email Address
              </label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="name@company.com" required
                className={inputCls}
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--bd-default)",
                  color: "var(--tx-primary)",
                }}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold" style={{ color: "var(--tx-secondary)" }}>
                  Password
                </label>
                <Link to="#" className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password" name="password" value={form.password}
                onChange={handleChange} placeholder="••••••••••••" required
                className={inputCls}
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--bd-default)",
                  color: "var(--tx-primary)",
                }}
              />
            </div>

            {error && (
              <div className="p-4 rounded-xl flex items-center gap-3 text-sm text-rose-600
                              bg-rose-50 border border-rose-200">
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
                  Signing in…
                </span>
              ) : "Sign in"}
            </button>


          </form>

          <p className="mt-10 text-center text-sm" style={{ color: "var(--tx-secondary)" }}>
            Don&apos;t have an account yet?{" "}
            <Link to="/register" className="font-bold text-blue-500 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
