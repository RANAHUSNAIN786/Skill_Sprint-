import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../lib/api";

export default function OnboardingPlan() {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(`/api/plans/${planId}`)
      .then(setPlan)
      .catch((err) => setError(err.message));
  }, [planId]);

  if (error) {
    return (
      <div className="min-h-screen p-6 bg-[radial-gradient(circle_at_5%_0%,rgba(79,70,229,0.11),transparent_60%),radial-gradient(circle_at_95%_5%,rgba(6,182,212,0.10),transparent_60%)] bg-slate-50 text-slate-900 font-sans">
        <div className="w-full max-w-5xl mx-auto">
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

  if (!plan) {
    return (
      <div className="min-h-screen p-6 bg-[radial-gradient(circle_at_5%_0%,rgba(79,70,229,0.11),transparent_60%),radial-gradient(circle_at_95%_5%,rgba(6,182,212,0.10),transparent_60%)] bg-slate-50 text-slate-900 font-sans">
        <div className="w-full max-w-5xl mx-auto flex items-center gap-2.5 text-slate-400 text-sm font-bold">
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Loading plan...
        </div>
      </div>
    );
  }

  const summary = plan.summary_json ? JSON.parse(plan.summary_json) : {};

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
              Onboarding / Plan
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              {plan.plan_code}
            </h1>
            <div className="mt-2 flex items-center gap-2.5 flex-wrap">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  statusStyles[plan.status] || statusStyles.draft
                }`}
              >
                {plan.status}
              </span>
              {plan.job_role_name && (
                <span className="text-sm text-slate-500 font-medium">
                  Role: <span className="text-slate-800 font-bold">{plan.job_role_name}</span>
                </span>
              )}
            </div>
          </div>

          <Link
            to="/onboarding"
            className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-2xl border border-slate-200 bg-white/90 text-sm font-extrabold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5"
          >
            Back
          </Link>
        </header>

        {/* Overview */}
        {summary.summary_text && (
          <section className="p-5 rounded-3xl border border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(31,41,55,0.07)]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Overview
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {summary.summary_text}
            </p>
          </section>
        )}

        {/* Stages */}
        {plan.stages?.length > 0 && (
          <section className="p-5 rounded-3xl border border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(31,41,55,0.07)]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Stages
            </h2>
            <div className="flex flex-col gap-2.5">
              {plan.stages.map((s, idx) => (
                <div
                  key={s.id}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100"
                >
                  <div className="shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-xs font-extrabold flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-extrabold text-slate-800">{s.stage}</div>
                    {s.description && (
                      <p className="mt-0.5 text-sm text-slate-500 font-medium">{s.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Modules */}
        <section className="p-5 rounded-3xl border border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(31,41,55,0.07)]">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Modules ({plan.modules?.length || 0})
          </h2>
          {plan.modules?.length > 0 ? (
            <div className="flex flex-col gap-2">
              {plan.modules.map((m) => (
                <Link
                  key={m.id}
                  to={`/onboarding/${plan.id}/module/${m.id}`}
                  className="group flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-sm transition-all duration-150"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {m.module_code}: {m.title}
                      </span>
                      {m.is_mandatory && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border border-rose-200 bg-rose-50 text-rose-600">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400 font-medium">
                      {m.estimated_minutes ?? "?"} min
                    </p>
                  </div>
                  <svg className="shrink-0 text-slate-300 group-hover:text-indigo-500 transition-colors" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 font-medium">No modules yet.</p>
          )}
        </section>

        {/* Tasks */}
        <section className="p-5 rounded-3xl border border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(31,41,55,0.07)]">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Tasks ({plan.tasks?.length || 0})
          </h2>
          {plan.tasks?.length > 0 ? (
            <div className="flex flex-col gap-2">
              {plan.tasks.map((t) => (
                <Link
                  key={t.id}
                  to={`/onboarding/${plan.id}/task/${t.id}`}
                  className="group flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-sm transition-all duration-150"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {t.task_code}: {t.title}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400 font-medium">
                      Due: {t.due_stage || "—"}
                    </p>
                  </div>
                  <svg className="shrink-0 text-slate-300 group-hover:text-indigo-500 transition-colors" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 font-medium">No tasks yet.</p>
          )}
        </section>

        {/* Assessments */}
        <section className="p-5 rounded-3xl border border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(31,41,55,0.07)]">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Assessments ({plan.assessments?.length || 0})
          </h2>
          {plan.assessments?.length > 0 ? (
            <div className="flex flex-col gap-2">
              {plan.assessments.map((a) => (
                <Link
                  key={a.id}
                  to={`/onboarding/${plan.id}/assessment/${a.id}`}
                  className="group flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-sm transition-all duration-150"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {a.title}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400 font-medium capitalize">
                      {a.assessment_type}
                    </p>
                  </div>
                  <svg className="shrink-0 text-slate-300 group-hover:text-indigo-500 transition-colors" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 font-medium">No assessments yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}