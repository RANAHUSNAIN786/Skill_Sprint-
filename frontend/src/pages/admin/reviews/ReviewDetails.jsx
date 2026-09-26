import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../../lib/api";

const DECISIONS = [
  { value: "accept", label: "Accept" },
  { value: "reject", label: "Reject" },
  { value: "override", label: "Override severity" },
  { value: "comment", label: "Comment only" },
];

const SEVERITIES = ["critical", "error", "warning", "info"];

export default function ReviewDetails() {
  const { findingId } = useParams();
  const [finding, setFinding] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    decision: "accept",
    comment: "",
    override_severity: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitMsg, setSubmitMsg] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      api.get(`/api/reviews/findings/${findingId}`),
      api.get(`/api/reviews/findings/${findingId}/reviews`),
    ])
      .then(([f, r]) => {
        setFinding(f.finding || f);
        setReviews(r.items || r || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [findingId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitMsg(null);
    setSubmitting(true);
    try {
      const payload = {
        decision: form.decision,
        comment: form.comment || null,
        override_severity:
          form.decision === "override" && form.override_severity
            ? form.override_severity
            : null,
      };
      await api.post(`/api/reviews/findings/${findingId}/review`, payload);
      setSubmitMsg("Review submitted successfully.");
      setForm({ decision: "accept", comment: "", override_severity: "" });
      load();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const severityStyles = {
    critical: "border-rose-300 bg-rose-50 text-rose-700",
    error: "border-orange-300 bg-orange-50 text-orange-700",
    warning: "border-amber-300 bg-amber-50 text-amber-700",
    info: "border-sky-300 bg-sky-50 text-sky-700",
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-[radial-gradient(circle_at_5%_0%,rgba(79,70,229,0.11),transparent_60%),radial-gradient(circle_at_95%_5%,rgba(6,182,212,0.10),transparent_60%)] bg-slate-50 text-slate-900 font-sans">
        <div className="w-full max-w-4xl mx-auto flex items-center gap-2.5 text-slate-400 text-sm font-bold">
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 bg-[radial-gradient(circle_at_5%_0%,rgba(79,70,229,0.11),transparent_60%),radial-gradient(circle_at_95%_5%,rgba(6,182,212,0.10),transparent_60%)] bg-slate-50 text-slate-900 font-sans">
        <div className="w-full max-w-4xl mx-auto">
          <div
            role="alert"
            className="flex items-start gap-2.5 px-4 py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-semibold"
          >
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!finding) return null;

  return (
    <div className="min-h-screen p-6 bg-[radial-gradient(circle_at_5%_0%,rgba(79,70,229,0.11),transparent_60%),radial-gradient(circle_at_95%_5%,rgba(6,182,212,0.10),transparent_60%)] bg-slate-50 text-slate-900 font-sans">
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-5">
        {/* Header */}
        <header className="flex items-end justify-between gap-5 flex-wrap">
          <div>
            <div className="text-indigo-600 text-xs font-extrabold uppercase tracking-[.14em] mb-1.5">
              Admin / Review
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Finding #{finding.id}
            </h1>
            <div className="mt-2 flex items-center gap-2.5 flex-wrap">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${
                  severityStyles[finding.severity] || severityStyles.info
                }`}
              >
                {finding.severity}
              </span>
              {finding.issue_type && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border border-slate-200 bg-slate-100 text-slate-600">
                  {finding.issue_type}
                </span>
              )}
            </div>
          </div>

          <Link
            to="/admin/reviews"
            className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-2xl border border-slate-200 bg-white/90 text-sm font-extrabold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5"
          >
            Back
          </Link>
        </header>

        {/* Finding details */}
        <section className="p-5 rounded-3xl border border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(31,41,55,0.07)]">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Message
          </h2>
          <p className="text-sm text-slate-800 font-medium leading-relaxed whitespace-pre-wrap">
            {finding.message || "—"}
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {finding.entity_type && (
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                  Entity
                </div>
                <div className="text-sm font-semibold text-slate-700">
                  {finding.entity_type}
                  {finding.entity_code ? ` · ${finding.entity_code}` : ""}
                  {finding.entity_id ? ` (#${finding.entity_id})` : ""}
                </div>
              </div>
            )}
            {finding.source_reference && (
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                  Source
                </div>
                <div className="text-sm font-semibold text-slate-700">
                  {finding.source_reference}
                </div>
              </div>
            )}
            {finding.expected && (
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                  Expected
                </div>
                <div className="text-sm font-semibold text-slate-700">
                  {finding.expected}
                </div>
              </div>
            )}
            {finding.actual && (
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                  Actual
                </div>
                <div className="text-sm font-semibold text-slate-700">
                  {finding.actual}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Submit review */}
        <section className="p-5 rounded-3xl border border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(31,41,55,0.07)]">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            Submit review
          </h2>

          <form onSubmit={onSubmit} className="flex flex-col gap-4 max-w-lg">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Decision
              </label>
              <select
                value={form.decision}
                onChange={(e) => setForm({ ...form, decision: e.target.value })}
                className="px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
              >
                {DECISIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            {form.decision === "override" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Override severity
                </label>
                <select
                  value={form.override_severity}
                  onChange={(e) =>
                    setForm({ ...form, override_severity: e.target.value })
                  }
                  className="px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                >
                  <option value="">Select severity</option>
                  {SEVERITIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Comment
              </label>
              <textarea
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                rows={3}
                className="px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 resize-none"
              />
            </div>

            {submitError && (
              <div role="alert" className="px-4 py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-semibold">
                {submitError}
              </div>
            )}
            {submitMsg && (
              <div className="px-4 py-3 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-semibold">
                {submitMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white text-sm font-extrabold shadow-[0_10px_24px_rgba(79,70,229,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:saturate-110 disabled:opacity-60 disabled:cursor-not-allowed w-fit"
            >
              {submitting ? "Submitting..." : "Submit review"}
            </button>
          </form>
        </section>

        {/* Previous reviews */}
        <section className="p-5 rounded-3xl border border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(31,41,55,0.07)]">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            Previous reviews ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <p className="text-sm text-slate-400 font-medium">No reviews yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70"
                >
                  <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                    <span className="text-sm font-extrabold text-slate-800 capitalize">
                      {r.decision}
                    </span>
                    {r.override_severity && (
                      <span className="text-xs text-slate-500 font-medium">
                        → {r.override_severity}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      {r.created_at
                        ? new Date(r.created_at).toLocaleString()
                        : ""}
                    </span>
                  </div>
                  {r.comment && (
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      {r.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}