import { Link } from "react-router-dom";

const NAV_ECOSYSTEM = [
  { to: "/analyzer", label: "Role Analyzer"  },
  { to: "/jd",       label: "JD Analyzer"    },
  { to: "/jobs",     label: "Jobs Explorer"  },
  { to: "/compare",  label: "Career Compare" },
];

const NAV_SUPPORT = [
  { to: "/profile",                      label: "Skill Inventory" },
  { href: "mailto:support@skillnova.io", label: "Contact Us"      },
  { label: "Privacy Policy" },
  { label: "Terms of Use"   },
];

const SOCIAL_PATHS = [
  "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z",
  "M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.493-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-2v-3.86c0-1.023-.371-1.717-1.218-1.717-.647 0-1.032.436-1.202.857-.063.152-.078.364-.078.577v4.143h-2v-6h2v.835c.266-.41.741-1.002 1.821-1.002 1.33 0 2.327.869 2.327 2.738v3.429z",
];

const linkStyle = { color: "var(--tx-secondary)", fontSize: "0.875rem", transition: "color 0.2s" };

export default function Footer() {
  return (
    <footer style={{ marginTop: "6rem", borderTop: "1px solid var(--bd-default)" }}>
      <div className="w-full px-6 md:px-10 lg:px-16 py-16 grid gap-12 md:grid-cols-4">

        {/* Brand */}
        <div className="space-y-5">
          <img src="/skillnova-logo.png" alt="SkillNova" className="h-10 object-contain" />
          <p className="text-sm leading-relaxed" style={{ color: "var(--tx-secondary)" }}>
            Empowering professionals to bridge skill gaps through data-driven
            insights and personalized learning roadmaps.
          </p>
          <div className="flex gap-2">
            {SOCIAL_PATHS.map((d, i) => (
              <a key={i} href="#"
                 className="w-8 h-8 grid place-items-center rounded-lg transition-all duration-200
                            hover:border-blue-500/40"
                 style={{
                   border: "1px solid var(--bd-default)",
                   background: "var(--bg-surface)",
                   color: "var(--tx-muted)",
                 }}>
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d={d} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Ecosystem */}
        <div className="space-y-5">
          {/* h4 inherits var(--tx-primary) from global rule */}
          <h4 className="text-[10px] uppercase tracking-[0.22em]">Ecosystem</h4>
          <nav className="flex flex-col gap-3">
            {NAV_ECOSYSTEM.map(({ to, label }) => (
              <Link key={to} to={to} style={linkStyle}
                    className="hover:text-blue-500 transition-colors">
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Support */}
        <div className="space-y-5">
          <h4 className="text-[10px] uppercase tracking-[0.22em]">Support</h4>
          <nav className="flex flex-col gap-3">
            {NAV_SUPPORT.map(({ to, href, label }) =>
              to ? (
                <Link key={label} to={to} style={linkStyle}
                      className="hover:text-blue-500 transition-colors">
                  {label}
                </Link>
              ) : href ? (
                <a key={label} href={href} style={linkStyle}
                   className="hover:text-blue-500 transition-colors">
                  {label}
                </a>
              ) : (
                <button key={label} style={linkStyle}
                        className="text-left hover:text-blue-500 transition-colors">
                  {label}
                </button>
              )
            )}
          </nav>
        </div>

        {/* CTA card — uses var(--bg-surface) so it's subtle in both modes */}
        <div className="rounded-2xl p-6 flex flex-col gap-4"
             style={{ background: "var(--bg-surface)", border: "1px solid var(--bd-default)" }}>
          <div>
            {/* h4 inherits var(--tx-primary) */}
            <h4 className="text-sm mb-1">Ready to advance?</h4>
            <p className="text-xs leading-relaxed m-0" style={{ color: "var(--tx-secondary)" }}>
              Join thousands of professionals optimizing their career paths with SkillNova.
            </p>
          </div>
          <Link to="/register"
                className="btn-primary mt-auto flex items-center justify-center gap-2
                           px-4 py-2.5 rounded-xl text-sm">
            Get Started Free
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                    d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Bottom strip */}
      <div style={{ borderTop: "1px solid var(--bd-subtle)" }}>
        <div className="w-full px-6 md:px-10 lg:px-16 py-5
                        flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs" style={{ color: "var(--tx-muted)" }}>
            © {new Date().getFullYear()} SkillNova. Engineered for the future of work.
          </p>
          <div className="flex gap-5 text-[10px] font-bold uppercase tracking-widest"
               style={{ color: "var(--tx-muted)" }}>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              All systems operational
            </span>
            <span>v2.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
