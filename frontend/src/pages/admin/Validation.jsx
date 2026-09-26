import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";

export default function Validation() {
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [runs, setRuns] = useState([]);
  const [selectedRun, setSelectedRun] = useState(null);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [loadingRuns, setLoadingRuns] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/api/plans?limit=100")
      .then((d) => setPlans(d.items || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingPlans(false));
  }, []);

  const loadRuns = (planId) => {
    if (!planId) return;
    setLoadingRuns(true);
    setSelectedRun(null);
    setError(null);
    api
      .get(`/api/plans/${planId}/validation-runs`)
      .then((d) => setRuns(d.items || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingRuns(false));
  };

  const onPlanChange = (e) => {
    const id = e.target.value;
    setSelectedPlanId(id);
    setRuns([]);
    setSelectedRun(null);
    if (id) loadRuns(id);
  };

  const onValidate = async () => {
    if (!selectedPlanId) return;
    setValidating(true);
    setError(null);
    try {
      const run = await api.post(`/api/plans/${selectedPlanId}/validate`);
      setSelectedRun(run);
      loadRuns(selectedPlanId);
    } catch (err) {
      setError(err.message || "Validation failed");
    } finally {
      setValidating(false);
    }
  };

  const onViewRun = async (runId) => {
    setError(null);
    try {
      const run = await api.get(`/api/validation-runs/${runId}`);
      setSelectedRun(run);
    } catch (err) {
      setError(err.message);
    }
  };

  const severityStyles = {
    critical: "border-rose-300 bg-rose-50 text-rose-700",
    error: "border-orange-300 bg-orange-50 text-orange-700",
    warning: "border-amber-300 bg-amber-50 text-amber-700",
    info: "border-sky-300 bg-sky-50 text-sky-700",
  };

  const statusStyles = {
    verified: "border-emerald-200 bg-emerald-50 text-emerald-600",
    passed: "border-emerald-200 bg-emerald-50 text-emerald-600",
    failed: "border-rose-200 bg-rose-50 text-rose-600",
    manual_review_required: "border-amber-200 bg-amber-50 text-amber-600",
    running: "border-sky-200 bg-sky-50 text-sky-600",
  };

  return (
    <div className="min-h-screen p-6 bg-[radial-gradient(circle_at_5%_0%,rgba(79,70,229,0.11),transparent_60%),radial-gradient(circle_at_95%_5%,rgba(6,182,212,0.10),transparent_60%)] bg-slate-50 text-slate-900 font-sans">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-5">
        {/* Header */}
        <header className="flex items-end justify-between gap-5 flex-wrap">
          <div>
            <div className="text-indigo-600 text-xs font-extrabold uppercase tracking-[.14em] mb-1.5">
              Admin / Validation
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Plan validation
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 font-medium">
              Run validation checks and review findings for onboarding plans.
            </p>
          </div>

          <Link
            to="/admin"
            className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-2xl border border-slate-200 bg-white/90 text-sm font-extrabold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5"
          >
            Back
          </Link>
        </header>

        {/* Plan select + Validate */}
        <section className="p-5 rounded-3xl border border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(31,41,55,0.07)]">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Onboarding plan
              </label>
              <select
                value={selectedPlanId}
                onChange={onPlanChange}
                disabled={loadingPlans}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 disabled:opacity-60"
              >
                <option value="">
                  {loadingPlans ? "Loading plans..." : "Select a plan"}
                </option>
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.plan_code} — {p.status}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={onValidate}
              disabled={!selectedPlanId || validating}
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white text-sm font-extrabold shadow-[0_10px_24px_rgba(79,70,229,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:saturate-110 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {validating ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Validating...
                </>
              ) : (
                "Run validation"
              )}
            </button>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 px-4 py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-semibold"
          >
            <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Previous runs */}
        {selectedPlanId && (
          <section className="p-5 rounded-3xl border border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(31,41,55,0.07)]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Validation runs ({runs.length})
            </h2>

            {loadingRuns ? (
              <div className="flex items-center gap-2.5 text-slate-400 text-sm font-bold">
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Loading runs...
              </div>
            ) : runs.length === 0 ? (
              <p className="text-sm text-slate-400 font-medium">No validation runs yet.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {runs.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onViewRun(r.id)}
                    className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border text-left transition-all duration-150 ${
                      selectedRun?.id === r.id
                        ? "border-indigo-300 bg-indigo-50/50"
                        : "border-slate-100 bg-slate-50/50 hover:border-indigo-200 hover:bg-white"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-extrabold text-slate-800">
                          Run #{r.id}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${
                            statusStyles[r.final_status || r.status] || statusStyles.running
                          }`}
                        >
                          {r.final_status || r.status}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-400 font-medium">
                        {r.created_at ? new Date(r.created_at).toLocaleString() : ""}
                        {r.coverage_score != null ? ` · Coverage ${Math.round(r.coverage_score * 100)}%` : ""}
                      </p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-300">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Selected run detail */}
        {selectedRun && (
          <>
            {/* Scores */}
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Coverage", value: selectedRun.coverage_score },
                { label: "Traceability", value: selectedRun.traceability_score },
                { label: "Consistency", value: selectedRun.requirement_consistency_score },
                {
                  label: "Findings",
                  value: selectedRun.findings?.length ?? selectedRun.missing_requirement_count ?? 0,
                  raw: true,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-4 rounded-2xl border border-slate-200 bg-white/90 text-center"
                >
                  <div className="text-2xl font-extrabold text-slate-900">
                    {item.raw
                      ? item.value
                      : item.value != null
                      ? `${Math.round(item.value * 100)}%`
                      : "—"}
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </section>

            {/* Findings */}
            <section className="p-5 rounded-3xl border border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(31,41,55,0.07)]">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Findings ({selectedRun.findings?.length || 0})
              </h2>

              {!selectedRun.findings?.length ? (
                <p className="text-sm text-slate-400 font-medium">No findings for this run.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {selectedRun.findings.map((f) => (
                    <div
                      key={f.id}
                      className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50"
                    >
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${
                            severityStyles[f.severity] || severityStyles.info
                          }`}
                        >
                          {f.severity}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {f.issue_type}
                        </span>
                        {f.entity_code && (
                          <span className="text-xs text-slate-500 font-medium">
                            {f.entity_type}: {f.entity_code}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-700 font-medium leading-relaxed">
                        {f.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}