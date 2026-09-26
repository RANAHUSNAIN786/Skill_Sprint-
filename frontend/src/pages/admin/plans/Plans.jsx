import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../lib/api";

export default function Plans() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [genForm, setGenForm] = useState({
    employee_user_id: "",
    job_role_id: "",
    max_chunks: 40,
    plan_note: "",
  });
  const [genBusy, setGenBusy] = useState(false);
  const [genError, setGenError] = useState(null);
  const [genMsg, setGenMsg] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await api.get("/api/plans");
      setItems(d.items || []);
      setTotal(d.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    api
      .get("/api/users?limit=200")
      .then((d) => setEmployees(d.items || []))
      .catch(() => {});
    api
      .get("/api/job-roles?limit=200")
      .then((d) => setRoles(d.items || []))
      .catch(() => {});
  }, []);

  const generate = async (e) => {
    e.preventDefault();
    setGenError(null);
    setGenMsg(null);
    setGenBusy(true);
    try {
      const payload = {
        employee_user_id: Number(genForm.employee_user_id),
        job_role_id: Number(genForm.job_role_id),
        max_chunks: Number(genForm.max_chunks),
        plan_note: genForm.plan_note || null,
      };
      const plan = await api.post("/api/plans/generate", payload);
      setGenMsg(`Plan ${plan.plan_code} created.`);
      setGenForm({
        employee_user_id: "",
        job_role_id: "",
        max_chunks: 40,
        plan_note: "",
      });
      await load();
    } catch (err) {
      setGenError(err.message || "Generation failed");
    } finally {
      setGenBusy(false);
    }
  };

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
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border whitespace-nowrap ${cls}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen p-6 bg-[radial-gradient(circle_at_5%_0%,rgba(79,70,229,0.11),transparent_60%),radial-gradient(circle_at_95%_5%,rgba(6,182,212,0.10),transparent_60%)] bg-slate-50 text-slate-900 font-sans">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-4">
        {/* Header */}
        <header className="flex items-end justify-between gap-5 flex-wrap">
          <div>
            <div className="text-indigo-600 text-xs font-extrabold uppercase tracking-[.14em] mb-1.5">
              Admin / Plans
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Onboarding plans <span className="text-slate-400 text-2xl font-bold">({total})</span>
            </h1>
          </div>
          <Link
            to="/admin"
            className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-2xl border border-slate-200 bg-white/90 text-sm font-extrabold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5"
          >
            Back
          </Link>
        </header>

        {/* Generate form */}
        <section className="p-5 rounded-3xl border border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(31,41,55,0.08)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white text-sm font-black">
              +
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-[16px]">Generate new plan</h2>
              <p className="text-slate-500 text-xs mt-0.5">Create an AI-generated onboarding plan for an employee.</p>
            </div>
          </div>

          {genError && (
            <div role="alert" className="mb-3.5 px-4 py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-semibold">
              {genError}
            </div>
          )}
          {genMsg && (
            <div className="mb-3.5 px-4 py-3 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-semibold">
              {genMsg}
            </div>
          )}

          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={generate}>
            <label className="flex flex-col gap-1.5">
              <span className="text-slate-700 text-[13px] font-extrabold">Employee</span>
              <select
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                value={genForm.employee_user_id}
                onChange={(e) => setGenForm({ ...genForm, employee_user_id: e.target.value })}
                required
              >
                <option value="">Select employee</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} — {e.employee_id}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-slate-700 text-[13px] font-extrabold">Job role</span>
              <select
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                value={genForm.job_role_id}
                onChange={(e) => setGenForm({ ...genForm, job_role_id: e.target.value })}
                required
              >
                <option value="">Select role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-slate-700 text-[13px] font-extrabold">Max source chunks</span>
              <input
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                type="number"
                min={5}
                max={200}
                value={genForm.max_chunks}
                onChange={(e) => setGenForm({ ...genForm, max_chunks: e.target.value })}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-slate-700 text-[13px] font-extrabold">Note</span>
              <input
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                value={genForm.plan_note}
                onChange={(e) => setGenForm({ ...genForm, plan_note: e.target.value })}
              />
            </label>

            <div className="sm:col-span-2 pt-1">
              <button
                type="submit"
                disabled={genBusy}
                className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white text-sm font-extrabold shadow-[0_10px_24px_rgba(79,70,229,0.18)] transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                {genBusy ? "Generating..." : "Generate plan"}
              </button>
            </div>
          </form>
        </section>

        {error && (
          <div role="alert" className="px-4 py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-semibold">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-2.5 text-slate-400 text-sm font-bold">
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Loading...
          </div>
        )}

        {/* Table */}
        <section className="rounded-3xl bg-white/90 border border-slate-200/80 shadow-[0_18px_50px_rgba(31,41,55,0.08)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/70">
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Code</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Employee</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Role</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Status</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Modules</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Tasks</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Quizzes</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Assessments</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Created</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.plan_code}</td>
                    <td className="px-4 py-3 font-extrabold text-slate-800">{p.employee_name}</td>
                    <td className="px-4 py-3 text-slate-600">{p.job_role_name}</td>
                    <td className="px-4 py-3">{statusPill(p.status)}</td>
                    <td className="px-4 py-3 text-slate-600">{p.module_count}</td>
                    <td className="px-4 py-3 text-slate-600">{p.task_count}</td>
                    <td className="px-4 py-3 text-slate-600">{p.quiz_count}</td>
                    <td className="px-4 py-3 text-slate-600">{p.assessment_count}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{p.created_at}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/admin/plans/${p.id}`}
                        className="text-indigo-600 text-xs font-bold hover:text-indigo-800 transition-colors duration-150"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
                {!loading && items.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-4 py-10 text-center text-slate-400 font-medium">
                      No plans yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}