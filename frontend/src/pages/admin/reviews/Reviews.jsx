import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../lib/api";

const SEVERITIES = ["", "critical", "error", "warning", "info"];

export default function Reviews() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [severity, setSeverity] = useState("");

  const load = () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (severity) params.set("severity", severity);
    const q = params.toString() ? `?${params.toString()}` : "";
    api
      .get(`/api/reviews/findings${q}`)
      .then((d) => setItems(d.items || d || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const onFilter = (e) => {
    e.preventDefault();
    load();
  };

  const severityStyles = {
    critical: "border-rose-300 bg-rose-50 text-rose-700",
    error: "border-orange-300 bg-orange-50 text-orange-700",
    warning: "border-amber-300 bg-amber-50 text-amber-700",
    info: "border-sky-300 bg-sky-50 text-sky-700",
  };

  return (
    <div className="min-h-screen p-6 bg-[radial-gradient(circle_at_5%_0%,rgba(79,70,229,0.11),transparent_60%),radial-gradient(circle_at_95%_5%,rgba(6,182,212,0.10),transparent_60%)] bg-slate-50 text-slate-900 font-sans">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-5">
        {/* Header */}
        <header className="flex items-end justify-between gap-5 flex-wrap">
          <div>
            <div className="text-indigo-600 text-xs font-extrabold uppercase tracking-[.14em] mb-1.5">
              Admin / Reviews
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Flagged findings{" "}
              <span className="text-slate-400 text-2xl font-bold">
                ({items.length})
              </span>
            </h1>
          </div>

          <Link
            to="/admin"
            className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-2xl border border-slate-200 bg-white/90 text-sm font-extrabold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5"
          >
            Back
          </Link>
        </header>

        {/* Filter */}
        <section className="p-4 rounded-3xl border border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(31,41,55,0.07)]">
          <form onSubmit={onFilter} className="flex flex-wrap gap-2.5 items-end">
            <div className="flex flex-col gap-1.5 min-w-[160px]">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
              >
                {SEVERITIES.map((s) => (
                  <option key={s} value={s}>
                    {s || "All severities"}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold transition-all duration-200 hover:bg-slate-800"
            >
              Filter
            </button>
          </form>
        </section>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 px-4 py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-semibold"
          >
            <svg
              className="shrink-0 mt-0.5"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
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
            <svg
              className="animate-spin"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Loading findings...
          </div>
        )}

        {/* Empty */}
        {!loading && items.length === 0 && (
          <section className="p-8 rounded-3xl border border-slate-200 bg-white/90 text-center">
            <p className="text-sm text-slate-400 font-medium">
              No flagged findings found.
            </p>
          </section>
        )}

        {/* List */}
        {!loading && items.length > 0 && (
          <section className="flex flex-col gap-3">
            {items.map((f) => (
              <Link
                key={f.id}
                to={`/admin/reviews/${f.id}`}
                className="group flex items-center justify-between gap-4 p-5 rounded-3xl border border-slate-200 bg-white/90 shadow-[0_12px_40px_rgba(31,41,55,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(31,41,55,0.10)] hover:border-indigo-200"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${
                        severityStyles[f.severity] || severityStyles.info
                      }`}
                    >
                      {f.severity}
                    </span>
                    {f.issue_type && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border border-slate-200 bg-slate-100 text-slate-600">
                        {f.issue_type}
                      </span>
                    )}
                    <span className="text-xs text-slate-400 font-medium">
                      #{f.id}
                    </span>
                  </div>
                  <h2 className="text-sm font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {f.message || "Finding"}
                  </h2>
                  {(f.entity_type || f.entity_code) && (
                    <p className="mt-1 text-xs text-slate-400 font-medium">
                      {f.entity_type}
                      {f.entity_code ? ` · ${f.entity_code}` : ""}
                    </p>
                  )}
                </div>
                <svg
                  className="shrink-0 text-slate-300 group-hover:text-indigo-500"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}