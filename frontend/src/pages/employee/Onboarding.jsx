import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";

export default function Onboarding() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/plans")
      .then((d) => {
        setItems(d.items || []);
        setTotal(d.total || 0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const statusStyles = {
    active: "border-emerald-200 bg-emerald-50 text-emerald-600",
    completed: "border-indigo-200 bg-indigo-50 text-indigo-600",
    pending: "border-amber-200 bg-amber-50 text-amber-600",
    draft: "border-slate-200 bg-slate-100 text-slate-500",
  };

  return (
    <div className="min-h-screen p-6 bg-[radial-gradient(circle_at_5%_0%,rgba(79,70,229,0.11),transparent_60%),radial-gradient(circle_at_95%_5%,rgba(6,182,212,0.10),transparent_60%)] bg-slate-50 text-slate-900 font-sans">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-5">
        {/* Header */}
        <header className="flex items-end justify-between gap-5 flex-wrap">
          <div>
            <div className="text-indigo-600 text-xs font-extrabold uppercase tracking-[.14em] mb-1.5">
              Employee / Onboarding
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              My plans{" "}
              <span className="text-slate-400 text-2xl font-bold">({total})</span>
            </h1>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-2xl border border-slate-200 bg-white/90 text-sm font-extrabold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5"
          >
            Back
          </Link>
        </header>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 px-4 py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-semibold"
          >
            <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-2.5 text-slate-400 text-sm font-bold">
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Loading plans...
          </div>
        )}

        {/* Empty state */}
        {!loading && items.length === 0 && (
          <section className="p-8 rounded-3xl border border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(31,41,55,0.07)] text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <h2 className="text-lg font-extrabold text-slate-800 mb-1">No plan assigned yet</h2>
            <p className="text-sm text-slate-500 font-medium">
              Ask your administrator to generate one for you.
            </p>
          </section>
        )}

        {/* Plans list */}
        {!loading && items.length > 0 && (
          <section className="flex flex-col gap-3">
            {items.map((p) => (
              <Link
                key={p.id}
                to={`/onboarding/${p.id}`}
                className="group flex items-center justify-between gap-4 p-5 rounded-3xl border border-slate-200 bg-white/90 shadow-[0_12px_40px_rgba(31,41,55,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(31,41,55,0.10)] hover:border-indigo-200"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-1.5">
                    <h2 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors duration-150">
                      {p.plan_code}
                    </h2>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        statusStyles[p.status] || statusStyles.draft
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium">
                    {p.module_count} modules · {p.task_count} tasks · {p.quiz_count} quizzes
                  </p>
                </div>

                <div className="shrink-0 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </Link>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}