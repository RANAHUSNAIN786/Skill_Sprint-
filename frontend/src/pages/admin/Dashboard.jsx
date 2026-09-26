import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/admin/users", label: "Users", desc: "Add, edit and manage employee accounts", accent: "from-violet-500 to-purple-500", text: "text-violet-600", ring: "hover:ring-violet-200", bg: "bg-violet-50" },
  { to: "/admin/roles", label: "Job roles", desc: "Define roles, levels and mappings", accent: "from-cyan-500 to-sky-500", text: "text-cyan-600", ring: "hover:ring-cyan-200", bg: "bg-cyan-50" },
  { to: "/admin/documents", label: "Documents", desc: "Upload files and track versions", accent: "from-amber-500 to-orange-500", text: "text-amber-600", ring: "hover:ring-amber-200", bg: "bg-amber-50" },
  { to: "/admin/requirements", label: "Requirements", desc: "Browse the SRS requirements library", accent: "from-rose-500 to-pink-500", text: "text-rose-600", ring: "hover:ring-rose-200", bg: "bg-rose-50" },
  { to: "/admin/role-matrix", label: "Role matrix", desc: "Map roles to their requirements", accent: "from-emerald-500 to-teal-500", text: "text-emerald-600", ring: "hover:ring-emerald-200", bg: "bg-emerald-50" },
  { to: "/admin/plans", label: "Onboarding plans", desc: "Generate and manage onboarding plans", accent: "from-indigo-500 to-blue-500", text: "text-indigo-600", ring: "hover:ring-indigo-200", bg: "bg-indigo-50" },
  { to: "/admin/validation", label: "Validation", desc: "Run consistency and coverage checks", accent: "from-sky-500 to-cyan-500", text: "text-sky-600", ring: "hover:ring-sky-200", bg: "bg-sky-50" },
  { to: "/admin/reviews", label: "Reviews", desc: "Work through the manual review queue", accent: "from-orange-500 to-amber-500", text: "text-orange-600", ring: "hover:ring-orange-200", bg: "bg-orange-50" },
  { to: "/admin/policy-impact", label: "Policy impact", desc: "See how policy changes ripple through", accent: "from-pink-500 to-rose-500", text: "text-pink-600", ring: "hover:ring-pink-200", bg: "bg-pink-50" },
  { to: "/admin/audit-logs", label: "Audit logs", desc: "Trace every action and system event", accent: "from-purple-500 to-violet-500", text: "text-purple-600", ring: "hover:ring-purple-200", bg: "bg-purple-50" },
  { to: "/admin/settings", label: "Settings", desc: "Configure system-wide preferences", accent: "from-teal-500 to-emerald-500", text: "text-teal-600", ring: "hover:ring-teal-200", bg: "bg-teal-50" },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const initial = (user?.name || "A").charAt(0).toUpperCase();
  const firstName = (user?.name || "there").split(" ")[0];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_0%,rgba(124,58,237,0.08),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(6,182,212,0.08),transparent_45%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.06),transparent_45%)] bg-slate-50 text-slate-900 font-sans">
      {/* Topbar */}
      <header className="sticky top-0 z-20 backdrop-blur-lg bg-white/70 border-b border-slate-200/70">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 text-white flex items-center justify-center font-extrabold shadow-lg shadow-indigo-200">
              A
            </div>
            <div>
              <div className="font-extrabold leading-none tracking-tight">Admin console</div>
              <div className="text-slate-400 text-[11px] mt-1 font-medium">Manage the entire workspace</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-slate-200 bg-white">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-white text-xs flex items-center justify-center font-bold">
                {initial}
              </div>
              <span className="text-sm font-semibold text-slate-700">{user?.name || "—"}</span>
            </div>

            <button
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-900 text-white text-sm font-bold shadow-sm transition-all duration-200 hover:bg-slate-800 hover:shadow-md active:scale-95"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Search
            </button>

            <button
              onClick={logout}
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 bg-white text-sm font-bold text-slate-500 transition-all duration-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 active:scale-95"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-8 flex flex-col gap-8">
        {/* Hero */}
        <section>
          <div className="text-indigo-500 text-xs font-bold uppercase tracking-[.18em] mb-2">
            Overview
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-700 to-slate-900 bg-clip-text text-transparent">
            Welcome back, {firstName}
          </h1>
          <p className="text-slate-500 text-sm mt-2 max-w-xl">
            Everything you need to run the workspace — users, documents, requirements and onboarding, all in one place.
          </p>

          <div className="flex gap-3 mt-5 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-slate-200 bg-white shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-400 font-semibold">Role</span>
              <span className="text-sm font-bold text-slate-800">Administrator</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-slate-200 bg-white shadow-sm">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-xs text-slate-400 font-semibold">Access level</span>
              <span className="text-sm font-bold text-slate-800">Full</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-slate-200 bg-white shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs text-slate-400 font-semibold">Modules</span>
              <span className="text-sm font-bold text-slate-800">{NAV.length} available</span>
            </div>
          </div>
        </section>

        {/* Nav grid */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-extrabold text-slate-700">Jump to a module</h2>
            <span className="text-xs text-slate-400 font-medium">Click any card to open</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {NAV.map((item, i) => (
              <Link
                key={item.to}
                to={item.to}
                className={`group relative rounded-3xl bg-white border border-slate-200/80 p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)] ring-1 ring-transparent transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:border-transparent ${item.ring}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.accent} flex items-center justify-center text-white font-extrabold shadow-md transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110`}
                  >
                    {item.label.charAt(0)}
                  </div>
                  <span className={`text-[11px] font-extrabold ${item.text} ${item.bg} px-2 py-1 rounded-lg`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-[15px] tracking-tight">
                  {item.label}
                </h3>
                <p className="text-slate-400 text-[13px] leading-relaxed mt-1.5 min-h-[36px]">
                  {item.desc}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className={`text-[11px] font-bold ${item.text} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    Open module
                  </span>
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${item.bg} ${item.text} font-bold transition-all duration-300 group-hover:translate-x-1`}
                  >
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}