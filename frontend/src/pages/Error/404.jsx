import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen p-6 bg-[radial-gradient(circle_at_5%_0%,rgba(79,70,229,0.11),transparent_60%),radial-gradient(circle_at_95%_5%,rgba(6,182,212,0.10),transparent_60%)] bg-slate-50 text-slate-900 font-sans flex items-center justify-center">
      <div className="w-full max-w-md mx-auto flex flex-col gap-5">
        <section className="relative overflow-hidden p-8 md:p-10 rounded-3xl border border-slate-200/80 bg-white/90 shadow-[0_25px_60px_rgba(31,41,55,0.10)] backdrop-blur-sm text-center">
          {/* top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-400" />

          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-[0_10px_25px_rgba(79,70,229,0.25)] mb-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <div className="text-indigo-600 text-xs font-extrabold uppercase tracking-[.16em] mb-2">
            Error
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-2">
            404
          </h1>

          <p className="text-base text-slate-500 font-medium mb-2">
            Page nahi mili
          </p>
          <p className="text-sm text-slate-400 font-medium mb-7">
            Yeh page exist nahi karta ya move ho chuka hai.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white text-sm font-extrabold shadow-[0_10px_24px_rgba(79,70,229,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:saturate-110"
            >
              Home pe jao
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-2xl border border-slate-200 bg-white text-sm font-extrabold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5"
            >
              Dashboard
            </Link>
          </div>
        </section>

        <p className="text-center text-[11px] text-slate-400 font-medium tracking-wide">
          Clean • Light • VIP one-look theme
        </p>
      </div>
    </div>
  );
}