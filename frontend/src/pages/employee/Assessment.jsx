import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../lib/api";

export default function Assessment() {
  const { planId, assessmentId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/api/plans/${planId}/assessments/${assessmentId}`)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [planId, assessmentId]);

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-[radial-gradient(circle_at_5%_0%,rgba(79,70,229,0.11),transparent_60%),radial-gradient(circle_at_95%_5%,rgba(6,182,212,0.10),transparent_60%)] bg-slate-50 text-slate-900 font-sans">
        <div className="w-full max-w-4xl mx-auto flex items-center gap-2.5 text-slate-400 text-sm font-bold">
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Loading assessment...
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
            <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const assessment = data.assessment || data;
  const rubrics = data.rubrics || assessment.rubrics || [];

  return (
    <div className="min-h-screen p-6 bg-[radial-gradient(circle_at_5%_0%,rgba(79,70,229,0.11),transparent_60%),radial-gradient(circle_at_95%_5%,rgba(6,182,212,0.10),transparent_60%)] bg-slate-50 text-slate-900 font-sans">
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-5">
        {/* Header */}
        <header className="flex items-end justify-between gap-5 flex-wrap">
          <div>
            <div className="text-indigo-600 text-xs font-extrabold uppercase tracking-[.14em] mb-1.5">
              Onboarding / Assessment
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              {assessment.title}
            </h1>
            <div className="mt-2 flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border border-indigo-200 bg-indigo-50 text-indigo-600 capitalize">
                {assessment.assessment_type}
              </span>
              <span className="text-sm text-slate-500 font-medium">
                Passing score:{" "}
                <span className="font-bold text-slate-800">
                  {assessment.passing_score}%
                </span>
              </span>
            </div>
          </div>

          <Link
            to={`/onboarding/${planId}`}
            className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-2xl border border-slate-200 bg-white/90 text-sm font-extrabold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5"
          >
            Back
          </Link>
        </header>

        {/* Description */}
        {assessment.description && (
          <section className="p-5 rounded-3xl border border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(31,41,55,0.07)]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Description
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
              {assessment.description}
            </p>
          </section>
        )}

        {/* Meta info */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {assessment.source_section && (
            <div className="p-4 rounded-2xl border border-slate-200 bg-white/90">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Source section
              </div>
              <div className="text-sm font-extrabold text-slate-800">
                {assessment.source_section}
              </div>
            </div>
          )}
          {assessment.created_at && (
            <div className="p-4 rounded-2xl border border-slate-200 bg-white/90">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Created
              </div>
              <div className="text-sm font-extrabold text-slate-800">
                {new Date(assessment.created_at).toLocaleDateString()}
              </div>
            </div>
          )}
        </section>

        {/* Rubrics */}
        <section className="p-5 rounded-3xl border border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(31,41,55,0.07)]">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            Rubric ({rubrics.length})
          </h2>

          {rubrics.length === 0 ? (
            <p className="text-sm text-slate-400 font-medium">No rubric criteria defined.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {[...rubrics]
                .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
                .map((r, idx) => (
                  <div
                    key={r.id || idx}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-xs font-extrabold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h3 className="text-sm font-extrabold text-slate-800">
                          {r.criterion}
                        </h3>
                      </div>
                      <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border border-slate-200 bg-white text-slate-600">
                        Weight: {r.weight ?? 1}
                      </span>
                    </div>

                    {r.expected_performance && (
                      <div className="mt-2 pl-9">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                          Expected performance
                        </div>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                          {r.expected_performance}
                        </p>
                      </div>
                    )}

                    {r.pass_condition && (
                      <div className="mt-2 pl-9">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                          Pass condition
                        </div>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                          {r.pass_condition}
                        </p>
                      </div>
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