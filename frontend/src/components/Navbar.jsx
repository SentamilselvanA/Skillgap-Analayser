import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium tracking-tight transition-all duration-200 ${
      isActive ? "bg-blue-600 text-white shadow-md shadow-blue-500/25" : ""
    }`;

  const linkStyle = (isActive) =>
    isActive ? {} : { color: "var(--tx-secondary)" };

  return (
    <header
      className="fixed top-0 left-0 w-full z-50"
      style={{
        background: theme === "dark"
          ? "rgba(11,14,20,0.85)"
          : "rgba(248,250,252,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--bd-default)",
      }}
    >
      {/* Navbar inner — matches page px-6 md:px-10 lg:px-16 */}
      <div className="w-full px-6 md:px-10 lg:px-16 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <NavLink to="/" className="flex-shrink-0">
          <img src="/skillnova-logo.png" alt="SkillNova" className="h-10 object-contain" />
        </NavLink>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-0.5">
          {[
            { to: "/", label: "Home", end: true },
            { to: "/profile",  label: "Profile"  },
            { to: "/analyzer", label: "Analyzer" },
            { to: "/jobs",     label: "Jobs"      },
            { to: "/compare",  label: "Compare"   },
          ].map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => linkClass({ isActive })}
              style={({ isActive }) => linkStyle(isActive)}>
              {label}
            </NavLink>
          ))}
          {user?.role === "admin" && (
            <NavLink to="/admin" className={linkClass} style={({ isActive }) => linkStyle(isActive)}>
              Admin
            </NavLink>
          )}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">

          {/* Theme toggle */}
          <button onClick={toggleTheme} aria-label="Toggle theme"
                  className="w-9 h-9 grid place-items-center rounded-lg
                             transition-all duration-200 hover:bg-black/5"
                  style={{ color: "var(--tx-muted)", border: "1px solid var(--bd-default)" }}>
            {theme === "dark" ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.757 7.757l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                   style={{ border: "1px solid var(--bd-default)", background: "var(--bg-surface)" }}>
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-violet-600
                                grid place-items-center text-[10px] font-bold text-white flex-shrink-0">
                  {user.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <span className="text-sm font-medium max-w-[100px] truncate"
                      style={{ color: "var(--tx-primary)" }}>
                  {user.name}
                </span>
              </div>
              <button onClick={() => { logout(); navigate("/"); }}
                      className="btn-ghost px-3 py-1.5 rounded-lg text-sm">
                Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn-ghost px-4 py-2 rounded-lg text-sm">
                Sign in
              </NavLink>
              <NavLink to="/register" className="btn-primary px-4 py-2 rounded-lg text-sm">
                Get Started
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
