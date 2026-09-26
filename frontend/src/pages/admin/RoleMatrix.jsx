import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";

export default function RoleMatrix() {
  const [rows, setRows] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get("/api/role-matrix");
      setRows(data.rows || []);
      if ((data.rows || []).length > 0 && selectedRoleId === null) {
        setSelectedRoleId(data.rows[0].job_role_id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400 font-semibold">
          <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Loading role matrix...
        </div>
      </div>
    );
  }

  const active = rows.find((r) => r.job_role_id === selectedRoleId) || null;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_0%,rgba(124,58,237,0.08),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(6,182,212,0.08),transparent_45%)] bg-slate-50 text-slate-900 font-sans">
      <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col gap-6">
        {/* Header */}
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors duration-200 mb-3"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to dashboard
          </Link>

          <div className="text-indigo-500 text-xs font-bold uppercase tracking-[.18em] mb-2">
            Role matrix
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-700 to-slate-900 bg-clip-text text-transparent">
            Role requirement matrix
          </h1>
          <p className="text-slate-500 text-sm mt-2 max-w-xl">
            See how requirements map to each job role and track mandatory coverage at a glance.
          </p>
        </div>

        {error && (
          <div role="alert" className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-semibold">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* Summary table */}
        <section className="rounded-3xl bg-white border border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.04)] overflow-hidden">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <h2 className="font-extrabold text-slate-900 text-[15px]">Summary by role</h2>
            <span className="text-xs text-slate-400 font-semibold">{rows.length} roles</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-slate-100 bg-slate-50/60">
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-5 py-3">Role</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-5 py-3">Department</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-5 py-3">Mandatory</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-5 py-3">Total</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-5 py-3">Coverage</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const coverage = r.total_count > 0 ? Math.round((r.mandatory_count / r.total_count) * 100) : null;
                  const isActive = r.job_role_id === selectedRoleId;
                  return (
                    <tr
                      key={r.job_role_id}
                      className={`border-t border-slate-100 transition-colors duration-150 ${isActive ? "bg-indigo-50/60" : "hover:bg-slate-50"}`}
                    >
                      <td className="px-5 py-3 font-bold text-slate-800">{r.job_role_name}</td>
                      <td className="px-5 py-3 text-slate-500">{r.department || "—"}</td>
                      <td className="px-5 py-3 text-slate-700 font-semibold">{r.mandatory_count}</td>
                      <td className="px-5 py-3 text-slate-700 font-semibold">{r.total_count}</td>
                      <td className="px-5 py-3">
                        {coverage !== null ? (
                          <span className="inline-flex items-center gap-2">
                            <span className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <span
                                className="block h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                                style={{ width: `${coverage}%` }}
                              />
                            </span>
                            <span className="text-xs font-bold text-emerald-600">{coverage}%</span>
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => setSelectedRoleId(r.job_role_id)}
                          type="button"
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                            isActive
                              ? "bg-indigo-600 text-white shadow-sm"
                              : "bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-700"
                          }`}
                        >
                          {isActive ? "Viewing" : "View"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-slate-400 font-medium">
                      No roles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Detail table */}
        {active && (
          <section className="rounded-3xl bg-white border border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.04)] overflow-hidden">
            <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h2 className="font-extrabold text-slate-900 text-[15px]">
                  {active.job_role_name}
                  {active.department ? (
                    <span className="text-slate-400 font-semibold"> — {active.department}</span>
                  ) : null}
                </h2>
                <p className="text-slate-500 text-xs mt-1">
                  {active.mandatory_count} mandatory / {active.total_count} total requirements
                </p>
              </div>
              <span className="text-[11px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                {active.cells.length} rows
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-slate-100 bg-slate-50/60">
                    <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-5 py-3">Code</th>
                    <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-5 py-3">Title</th>
                    <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-5 py-3">Type</th>
                    <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-5 py-3">Must</th>
                    <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-5 py-3">Mandatory</th>
                    <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-5 py-3">Priority</th>
                    <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-5 py-3">Due stage</th>
                    <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-5 py-3">Source</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {active.cells.map((c) => (
                    <tr key={c.requirement_id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors duration-150">
                      <td className="px-5 py-3 font-mono text-xs text-slate-500">{c.req_code}</td>
                      <td className="px-5 py-3 font-semibold text-slate-800">{c.title}</td>
                      <td className="px-5 py-3 text-slate-500">{c.requirement_type}</td>
                      <td className="px-5 py-3 text-slate-500">{c.must_type}</td>
                      <td className="px-5 py-3">
                        {c.is_mandatory ? (
                          <span className="text-[11px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg">Yes</span>
                        ) : (
                          <span className="text-[11px] font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">No</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-slate-500">{c.effective_priority}</td>
                      <td className="px-5 py-3 text-slate-500">{c.effective_due_stage || "—"}</td>
                      <td className="px-5 py-3 text-slate-400 text-xs">
                        {c.source_document_id
                          ? `#${c.source_document_id}${c.source_section ? ` §${c.source_section}` : ""}`
                          : "—"}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link
                          to={`/admin/requirements/${c.requirement_id}`}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors duration-150"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {active.cells.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-5 py-10 text-center text-slate-400 font-medium">
                        No requirements assigned.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}