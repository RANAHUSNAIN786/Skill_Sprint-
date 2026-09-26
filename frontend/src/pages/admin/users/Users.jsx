import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../lib/api";

const SYSTEM_ROLES = ["", "admin", "training_manager", "reviewer", "manager", "employee"];

export default function Users() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [systemRole, setSystemRole] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (systemRole) params.set("system_role", systemRole);
      if (department) params.set("department", department);
      const q = params.toString() ? `?${params.toString()}` : "";
      const data = await api.get(`/api/users${q}`);
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen p-5 bg-[radial-gradient(circle_at_10%_0%,rgba(124,58,237,0.08),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(6,182,212,0.08),transparent_45%)] bg-slate-50 text-slate-900 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col gap-4">
        {/* Header */}
        <header className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <div className="text-indigo-500 text-xs font-bold uppercase tracking-[.18em] mb-2">
              Admin
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-700 to-slate-900 bg-clip-text text-transparent">
              Users <span className="text-slate-400">({total})</span>
            </h1>
            <div className="text-slate-500 text-sm mt-1">Search, filter and manage user accounts.</div>
          </div>

          <div className="flex gap-2.5 flex-wrap">
            <Link
              to="/admin/users/new"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 text-white text-sm font-bold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New user
            </Link>
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-slate-200 bg-white text-sm font-bold text-slate-600 transition-all duration-200 hover:bg-slate-50 active:scale-95"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back
            </Link>
          </div>
        </header>

        {/* Card */}
        <section className="rounded-3xl bg-white/85 backdrop-blur border border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.04)] p-4">
          <form
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_0.9fr_0.9fr_auto_auto] gap-2.5 items-center"
            onSubmit={(e) => {
              e.preventDefault();
              load();
            }}
          >
            <div className="relative">
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                placeholder="Search name/email/emp id"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
              value={systemRole}
              onChange={(e) => setSystemRole(e.target.value)}
            >
              {SYSTEM_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r || "All roles"}
                </option>
              ))}
            </select>

            <input
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />

            <button
              className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold transition-all duration-200 hover:bg-slate-800 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
              type="submit"
              disabled={loading}
            >
              {loading ? "Filtering..." : "Filter"}
            </button>

            <button
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 transition-all duration-200 hover:bg-slate-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
              type="button"
              disabled={loading}
              onClick={() => {
                setSearch("");
                setSystemRole("");
                setDepartment("");
                // load with cleared filters
                setTimeout(load, 0);
              }}
            >
              Clear
            </button>
          </form>

          {error && (
            <div
              className="mt-3 flex items-center gap-2 px-4 py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-semibold"
              role="alert"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {loading ? (
            <div className="mt-3 flex flex-col gap-2.5" aria-label="Loading users">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/90">
                  <div className="h-3 w-2/5 rounded-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-pulse" />
                  <div className="h-3 w-[70%] mt-2.5 rounded-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50/90 overflow-auto">
              <table className="w-full min-w-[980px] border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th className="sticky top-0 z-10 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide px-3 py-3 border-b border-slate-100 bg-slate-50/95">Employee ID</th>
                    <th className="sticky top-0 z-10 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide px-3 py-3 border-b border-slate-100 bg-slate-50/95">Name</th>
                    <th className="sticky top-0 z-10 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide px-3 py-3 border-b border-slate-100 bg-slate-50/95">Email</th>
                    <th className="sticky top-0 z-10 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide px-3 py-3 border-b border-slate-100 bg-slate-50/95">System role</th>
                    <th className="sticky top-0 z-10 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide px-3 py-3 border-b border-slate-100 bg-slate-50/95">Job role</th>
                    <th className="sticky top-0 z-10 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide px-3 py-3 border-b border-slate-100 bg-slate-50/95">Dept</th>
                    <th className="sticky top-0 z-10 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide px-3 py-3 border-b border-slate-100 bg-slate-50/95">Active</th>
                    <th className="sticky top-0 z-10 px-3 py-3 border-b border-slate-100 bg-slate-50/95"></th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((u) => (
                    <tr key={u.id} className="group">
                      <td className="px-3 py-3 border-b border-slate-100 bg-white/60 group-hover:bg-white/95 transition-colors duration-150 font-mono text-xs text-slate-500">
                        {u.employee_id}
                      </td>
                      <td className="px-3 py-3 border-b border-slate-100 bg-white/60 group-hover:bg-white/95 transition-colors duration-150 font-extrabold text-slate-800">
                        {u.name}
                      </td>
                      <td className="px-3 py-3 border-b border-slate-100 bg-white/60 group-hover:bg-white/95 transition-colors duration-150 text-slate-600">
                        {u.email}
                      </td>
                      <td className="px-3 py-3 border-b border-slate-100 bg-white/60 group-hover:bg-white/95 transition-colors duration-150">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border border-indigo-200 bg-indigo-50 text-indigo-600 whitespace-nowrap">
                          {u.system_role || "—"}
                        </span>
                      </td>
                      <td className="px-3 py-3 border-b border-slate-100 bg-white/60 group-hover:bg-white/95 transition-colors duration-150 font-mono text-xs text-slate-500">
                        {u.job_role_id || "—"}
                      </td>
                      <td className="px-3 py-3 border-b border-slate-100 bg-white/60 group-hover:bg-white/95 transition-colors duration-150 text-slate-600">
                        {u.department || "—"}
                      </td>
                      <td className="px-3 py-3 border-b border-slate-100 bg-white/60 group-hover:bg-white/95 transition-colors duration-150">
                        {u.is_active ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-200 bg-emerald-50 text-emerald-600">
                            yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border border-slate-200 bg-slate-100 text-slate-500">
                            no
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 border-b border-slate-100 bg-white/60 group-hover:bg-white/95 transition-colors duration-150 text-right">
                        <Link
                          to={`/admin/users/${u.id}`}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors duration-150"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {items.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-5 py-10 text-center text-slate-400 font-semibold">
                        No users.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}