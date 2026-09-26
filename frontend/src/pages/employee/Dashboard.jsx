import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  const links = [
    {
      to: "/profile",
      title: "Profile",
      desc: "View and update your details",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      to: "/onboarding",
      title: "Onboarding",
      desc: "Complete your onboarding steps",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      to: "/progress",
      title: "Progress",
      desc: "Track your learning progress",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
    {
      to: "/notifications",
      title: "Notifications",
      desc: "View your latest updates",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-6 bg-[radial-gradient(circle_at_5%_0%,rgba(79,70,229,0.11),transparent_60%),radial-gradient(circle_at_95%_5%,rgba(6,182,212,0.10),transparent_60%)] bg-slate-50 text-slate-900 font-sans">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <header className="flex items-end justify-between gap-5 flex-wrap">
          <div>
            <div className="text-indigo-600 text-xs font-extrabold uppercase tracking-[.14em] mb-1.5">
              Employee Portal
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Dashboard
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 font-medium">
              Welcome back, <span className="font-bold text-slate-800">{user?.name || "Employee"}</span>
            </p>
          </div>

          <button
            onClick={logout}
            className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-2xl border border-slate-200 bg-white/90 text-sm font-extrabold text-slate-800 transition-all duration-200 hover:border-rose-300 hover:text-rose-600 hover:-translate-y-0.5"
          >
            Log out
          </button>
        </header>

        {/* Quick links grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {links.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group relative overflow-hidden p-5 rounded-3xl border border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(31,41,55,0.07)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(31,41,55,0.12)] hover:border-indigo-200"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white flex items-center justify-center shadow-[0_8px_20px_rgba(79,70,229,0.25)] group-hover:scale-105 transition-transform duration-200">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors duration-150">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 font-medium leading-snug">
                    {item.desc}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}