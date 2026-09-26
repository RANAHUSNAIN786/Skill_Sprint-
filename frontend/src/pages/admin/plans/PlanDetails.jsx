import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../../lib/api";

export default function PlanDetails() {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setError(null);
    try {
      const p = await api.get(`/api/plans/${planId}`);
      setPlan(p);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, [planId]);

  const archive = async () => {
    if (!confirm("Archive this plan?")) return;
    setBusy(true);
    try {
      await api.del(`/api/plans/${planId}`);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!plan) {
    return (
      <div className="min-h-screen p-6 bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          {error && (
            <div role="alert" className="px-4 py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-semibold">
              {error}
            </div>
          )}
          <div className="flex items-center gap-2.5 text-slate-400 font-semibold">
            <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  const summary = plan.summary_json ? JSON.parse(plan.summary_json) : {};

  const statusPill = (status) => {
    const map = {
      archived: "border-slate-200 bg-slate-100 text-slate-500",
      active: "border-emerald-200 bg-emerald-50 text-emerald-600",
      draft: "border-amber-200 bg-amber-50 text-amber-600",
      completed: "border-indigo-200 bg-indigo-50 text-indigo-600",
      failed: "border-rose-200 bg-rose-50 text-rose-600",
    };
    const cls = map[status] || "border-cyan-200 bg-cyan-50 text-cyan-600";
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${cls}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen p-6 bg-[radial-gradient(circle_at_5%_0%,rgba(79,70,229,0.11),transparent_60%),radial-gradient(circle_at_95%_5%,rgba(6,182,212,0.10),transparent_60%)] bg-slate-50 text-slate-900 font-sans">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-4">
        {/* Header */}
        <header className="flex items-end justify-between gap-5 flex-wrap">
          <div>
            <div className="text-indigo-600 text-xs font-extrabold uppercase tracking-[.14em] mb-1.5">
              Admin / Plans
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-mono">
              {plan.plan_code}
            </h1>
          </div>
          <div className="flex gap-2.5">
            <Link
              to="/admin/plans"
              className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-2xl border border-slate-200 bg-white/90 text-sm font-extrabold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5"
            >
              Back
            </Link>
            {plan.status !== "archived" && (
              <button
                onClick={archive}
                disabled={busy}
                type="button"
                className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-2xl bg-rose-50 text-rose-600 text-sm font-extrabold transition-all duration-200 hover:bg-rose-100 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {busy ? "Archiving..." : "Archive"}
              </button>
            )}
          </div>
        </header>

        {error && (
          <div role="alert" className="px-4 py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-semibold">
            {error}
          </div>
        )}

        {/* Overview */}
        <section className="p-5 rounded-3xl border border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(31,41,55,0.08)]">
          <div className="font-extrabold text-slate-900 text-[15px] mb-3.5">Overview</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
            <div className="flex justify-between sm:justify-start gap-2">
              <span className="text-slate-400 font-semibold">Employee</span>
              <span className="text-slate-800 font-bold">{plan.employee_name} (#{plan.employee_user_id})</span>
            </div>
            <div className="flex justify-between sm:justify-start gap-2">
              <span className="text-slate-400 font-semibold">Role</span>
              <span className="text-slate-800 font-bold">{plan.job_role_name} (#{plan.job_role_id})</span>
            </div>
            <div className="flex items-center justify-between sm:justify-start gap-2">
              <span className="text-slate-400 font-semibold">Status</span>
              {statusPill(plan.status)}
            </div>
            <div className="flex justify-between sm:justify-start gap-2">
              <span className="text-slate-400 font-semibold">Created</span>
              <span className="text-slate-600 font-mono text-xs">{plan.created_at}</span>
            </div>
            <div className="sm:col-span-2 flex flex-col gap-1">
              <span className="text-slate-400 font-semibold">Note</span>
              <span className="text-slate-700">{plan.notes || "—"}</span>
            </div>
            <div className="sm:col-span-2 flex flex-col gap-1">
              <span className="text-slate-400 font-semibold">Summary</span>
              <span className="text-slate-700">{summary.summary_text || "—"}</span>
            </div>
          </div>
        </section>

        {/* Generation run */}
        {plan.generation_run && (
          <section className="p-5 rounded-3xl border border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(31,41,55,0.08)]">
            <div className="font-extrabold text-slate-900 text-[15px] mb-3.5">
              Generation run <span className="text-slate-400 font-mono">#{plan.generation_run.id}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-100">
                <div className="text-slate-400 text-xs font-semibold">Status</div>
                <div className="text-slate-800 font-bold text-sm mt-0.5">{plan.generation_run.status}</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-100">
                <div className="text-slate-400 text-xs font-semibold">Model</div>
                <div className="text-slate-800 font-bold text-sm mt-0.5">{plan.generation_run.model_name}</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-100">
                <div className="text-slate-400 text-xs font-semibold">Latency</div>
                <div className="text-slate-800 font-bold text-sm mt-0.5">{plan.generation_run.latency_ms} ms</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-100">
                <div className="text-slate-400 text-xs font-semibold">Retries</div>
                <div className="text-slate-800 font-bold text-sm mt-0.5">{plan.generation_run.retries}</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-100">
                <div className="text-slate-400 text-xs font-semibold">Tokens</div>
                <div className="text-slate-800 font-bold text-sm mt-0.5">{plan.generation_run.token_estimate ?? "—"}</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-100">
                <div className="text-slate-400 text-xs font-semibold">Docs</div>
                <div className="text-slate-800 font-bold text-sm mt-0.5">{plan.generation_run.source_document_ids || "—"}</div>
              </div>
            </div>
            <div className="mt-3 text-slate-600 text-sm">
              <span className="text-slate-400 font-semibold">Input: </span>
              {plan.generation_run.input_summary}
            </div>
            {plan.generation_run.parse_error && (
              <div className="mt-2 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-semibold">
                Error: {plan.generation_run.parse_error}
              </div>
            )}
          </section>
        )}

        {/* Stages */}
        <section className="p-5 rounded-3xl border border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(31,41,55,0.08)]">
          <div className="font-extrabold text-slate-900 text-[15px] mb-3.5">
            Stages <span className="text-slate-400 font-semibold">({plan.stages.length})</span>
          </div>
          <div className="flex flex-col gap-2">
            {plan.stages.map((s) => (
              <div key={s.id} className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl border border-slate-100 bg-slate-50/70">
                <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-extrabold text-indigo-600 bg-indigo-50 whitespace-nowrap">
                  {s.stage}
                </span>
                <span className="text-slate-600 text-sm">{s.description || "—"}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Modules */}
        <section className="p-5 rounded-3xl border border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(31,41,55,0.08)]">
          <div className="font-extrabold text-slate-900 text-[15px] mb-3.5">
            Modules <span className="text-slate-400 font-semibold">({plan.modules.length})</span>
          </div>
          <div className="flex flex-col gap-4">
            {plan.modules.map((m) => (
              <div key={m.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60">
                <h3 className="flex items-center gap-2 flex-wrap font-extrabold text-slate-800 text-sm">
                  <span className="font-mono text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">{m.module_code}</span>
                  {m.title}
                  {m.is_mandatory && (
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">● mandatory</span>
                  )}
                </h3>
                <p className="text-slate-400 text-xs mt-1.5">
                  Source: doc #{m.source_document_id || "?"}
                  {m.source_section ? ` §${m.source_section}` : ""}
                  {m.source_chunk_ids ? ` chunks=${m.source_chunk_ids}` : ""}
                </p>
                {m.purpose && <p className="text-slate-600 text-sm mt-2"><span className="text-slate-400 font-semibold">Purpose: </span>{m.purpose}</p>}
                {m.key_concepts && <p className="text-slate-600 text-sm mt-1"><span className="text-slate-400 font-semibold">Key concepts: </span>{m.key_concepts}</p>}
                {m.estimated_minutes && <p className="text-slate-600 text-sm mt-1"><span className="text-slate-400 font-semibold">Duration: </span>{m.estimated_minutes} min</p>}
                {m.completion_criteria && <p className="text-slate-600 text-sm mt-1"><span className="text-slate-400 font-semibold">Completion: </span>{m.completion_criteria}</p>}

                {m.objectives.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">Objectives</h4>
                    <ol className="list-decimal list-inside flex flex-col gap-1 text-sm text-slate-700">
                      {m.objectives.map((o) => (
                        <li key={o.id}>{o.text}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {m.activities.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">Activities</h4>
                    <ol className="list-decimal list-inside flex flex-col gap-1 text-sm text-slate-700">
                      {m.activities.map((a) => (
                        <li key={a.id}>{a.description}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Checklists */}
        <section className="p-5 rounded-3xl border border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(31,41,55,0.08)]">
          <div className="font-extrabold text-slate-900 text-[15px] mb-3.5">
            Checklists <span className="text-slate-400 font-semibold">({plan.checklists.length})</span>
          </div>
          <div className="flex flex-col gap-4">
            {plan.checklists.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60">
                <h3 className="font-extrabold text-slate-800 text-sm">{c.title}</h3>
                {c.description && <p className="text-slate-500 text-xs mt-1">{c.description}</p>}
                <ul className="mt-2.5 flex flex-col gap-1.5">
                  {c.items.map((i) => (
                    <li key={i.id} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded whitespace-nowrap ${i.is_required ? "text-rose-600 bg-rose-50" : "text-slate-400 bg-slate-100"}`}>
                        {i.is_required ? "required" : "optional"}
                      </span>
                      <span>
                        {i.activity}
                        {i.due_stage ? <span className="text-slate-400"> — due {i.due_stage}</span> : ""}
                        {i.source_document_id ? (
                          <span className="text-slate-400"> (doc #{i.source_document_id}{i.source_section ? ` §${i.source_section}` : ""})</span>
                        ) : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Tasks */}
        <section className="p-5 rounded-3xl border border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(31,41,55,0.08)]">
          <div className="font-extrabold text-slate-900 text-[15px] mb-3.5">
            Tasks <span className="text-slate-400 font-semibold">({plan.tasks.length})</span>
          </div>
          <div className="flex flex-col gap-4">
            {plan.tasks.map((t) => (
              <div key={t.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60">
                <h3 className="flex items-center gap-2 flex-wrap font-extrabold text-slate-800 text-sm">
                  <span className="font-mono text-xs text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-lg">{t.task_code}</span>
                  {t.title}
                  {t.is_scenario && (
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">scenario</span>
                  )}
                </h3>
                <p className="text-slate-500 text-xs mt-1.5">Difficulty: {t.difficulty || "—"} · Due: {t.due_stage || "—"}</p>
                {t.description && <p className="text-slate-600 text-sm mt-2">{t.description}</p>}
                {t.expected_outcome && <p className="text-slate-600 text-sm mt-1"><span className="text-slate-400 font-semibold">Expected: </span>{t.expected_outcome}</p>}
                {t.completion_criteria && <p className="text-slate-600 text-sm mt-1"><span className="text-slate-400 font-semibold">Completion: </span>{t.completion_criteria}</p>}
                <p className="text-slate-400 text-xs mt-2">
                  Source: doc #{t.source_document_id || "?"}
                  {t.source_section ? ` §${t.source_section}` : ""}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Quizzes */}
        <section className="p-5 rounded-3xl border border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(31,41,55,0.08)]">
          <div className="font-extrabold text-slate-900 text-[15px] mb-3.5">
            Quizzes <span className="text-slate-400 font-semibold">({plan.quizzes.length})</span>
          </div>
          <div className="flex flex-col gap-4">
            {plan.quizzes.map((q) => (
              <div key={q.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60">
                <h3 className="font-extrabold text-slate-800 text-sm">
                  {q.title}
                  <span className="text-slate-400 font-semibold text-xs ml-2">
                    pass ≥ {q.passing_score}, total {q.total_points} pts
                  </span>
                </h3>
                {q.description && <p className="text-slate-500 text-xs mt-1">{q.description}</p>}

                <div className="mt-3 flex flex-col gap-3">
                  {q.questions.map((qu, i) => (
                    <div key={qu.id} className="p-3 rounded-xl bg-white border border-slate-100">
                      <p className="text-sm text-slate-800">
                        <strong className="font-extrabold">Q{i + 1}.</strong> {qu.prompt_text}{" "}
                        <span className="text-slate-400 text-xs">({qu.question_type}, {qu.points} pts)</span>
                      </p>
                      <ul className="mt-2 flex flex-col gap-1">
                        {qu.options.map((o) => (
                          <li key={o.id} className={`text-sm flex items-center gap-1.5 ${o.is_correct ? "text-emerald-600 font-bold" : "text-slate-500"}`}>
                            <span>{o.is_correct ? "✓" : "·"}</span>
                            <span>{o.text}</span>
                          </li>
                        ))}
                      </ul>
                      {qu.explanation && <p className="text-slate-500 text-xs mt-2">Explanation: {qu.explanation}</p>}
                      <p className="text-slate-400 text-xs mt-1.5">
                        Source: doc #{qu.source_document_id || "?"}
                        {qu.source_section ? ` §${qu.source_section}` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Assessments */}
        <section className="p-5 rounded-3xl border border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(31,41,55,0.08)]">
          <div className="font-extrabold text-slate-900 text-[15px] mb-3.5">
            Assessments <span className="text-slate-400 font-semibold">({plan.assessments.length})</span>
          </div>
          <div className="flex flex-col gap-4">
            {plan.assessments.map((a) => (
              <div key={a.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60">
                <h3 className="font-extrabold text-slate-800 text-sm">
                  {a.title} <span className="text-slate-400 font-semibold text-xs">({a.assessment_type})</span>
                </h3>
                {a.description && <p className="text-slate-500 text-xs mt-1">{a.description}</p>}
                <p className="text-slate-600 text-sm mt-2">Passing score: {a.passing_score}</p>
                <p className="text-slate-400 text-xs mt-1">
                  Source: doc #{a.source_document_id || "?"}
                  {a.source_section ? ` §${a.source_section}` : ""}
                </p>

                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wide mt-3 mb-1.5">Rubric</h4>
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-100/70">
                        <th className="text-left font-bold text-slate-500 text-xs uppercase px-3 py-2">Criterion</th>
                        <th className="text-left font-bold text-slate-500 text-xs uppercase px-3 py-2">Weight</th>
                        <th className="text-left font-bold text-slate-500 text-xs uppercase px-3 py-2">Expected</th>
                        <th className="text-left font-bold text-slate-500 text-xs uppercase px-3 py-2">Pass condition</th>
                      </tr>
                    </thead>
                    <tbody>
                      {a.rubric.map((r) => (
                        <tr key={r.id} className="border-t border-slate-100">
                          <td className="px-3 py-2 font-semibold text-slate-700">{r.criterion}</td>
                          <td className="px-3 py-2 text-slate-500">{r.weight}</td>
                          <td className="px-3 py-2 text-slate-500">{r.expected_performance || "—"}</td>
                          <td className="px-3 py-2 text-slate-500">{r.pass_condition || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}