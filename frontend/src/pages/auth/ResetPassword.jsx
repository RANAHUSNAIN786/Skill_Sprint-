import { Link } from "react-router-dom";

export default function ResetPassword() {
  return (
    <div className="min-h-screen p-6 bg-[radial-gradient(circle_at_5%_0%,rgba(79,70,229,0.11),transparent_60%),radial-gradient(circle_at_95%_5%,rgba(6,182,212,0.10),transparent_60%)] bg-slate-50 text-slate-900 font-sans">
      <div className="w-full max-w-md mx-auto flex flex-col gap-5 pt-4 md:pt-10">
        {/* Card */}
        <section className="relative overflow-hidden p-6 md:p-8 rounded-3xl border border-slate-200/80 bg-white/90 shadow-[0_25px_60px_rgba(31,41,55,0.10)] backdrop-blur-sm">
          {/* top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-400" />

          {/* Header */}
          <div className="mb-7 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-[0_10px_25px_rgba(79,70,229,0.25)] mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div className="text-indigo-600 text-xs font-extrabold uppercase tracking-[.16em] mb-2">
              Account
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              Reset password
            </h1>
            <p className="mt-2 text-sm text-slate-500 font-medium leading-relaxed">
              Abhi yeh feature implement nahi hua. Aap login page pe wapas ja sakte ho.
            </p>
          </div>

          {/* Status Box */}
          <div className="mb-6 p-4 rounded-2xl border border-slate-200 bg-slate-50/80">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Status
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <span className="inline-flex w-2 h-2 rounded-full bg-amber-400" />
              Not implemented yet
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 min-h-[48px] flex-1 px-5 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white text-sm font-extrabold shadow-[0_10px_24px_rgba(79,70,229,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:saturate-110"
            >
              Back to login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center min-h-[48px] flex-1 px-5 rounded-2xl border border-slate-200 bg-white text-sm font-extrabold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5"
            >
              Create account
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