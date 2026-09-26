import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../lib/api";

export default function Roles() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [includeInactive, setIncludeInactive] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        limit: "200",
      });

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (includeInactive) {
        params.set("include_inactive", "true");
      }

      const data = await api.get(`/api/job-roles?${params.toString()}`);

      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message || "Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const clearFilters = () => {
    setSearch("");
    setIncludeInactive(false);

    setTimeout(() => {
      load();
    }, 0);
  };

  return (
    <div className="min-h-screen p-6 bg-[radial-gradient(circle_at_5%_0%,rgba(79,70,229,0.11),transparent_60%),radial-gradient(circle_at_95%_5%,rgba(6,182,212,0.10),transparent_60%)] bg-slate-50 text-slate-900 font-sans">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex items-end justify-between gap-5 mb-5 flex-wrap">
          <div>
            <div className="text-indigo-600 text-xs font-extrabold uppercase tracking-[.14em]">
              Admin / Management
            </div>
            <h1 className="mt-1.5 mb-1 text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Job roles <span className="text-slate-400 text-2xl font-bold">({total})</span>
            </h1>
            <p className="text-slate-500 text-sm">
              Manage job roles and their active status from one place.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
            <Link
              to="/admin/roles/new"
              className="flex-1 sm:flex-none inline-flex items-center justify-center min-h-[44px] px-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white text-sm font-extrabold shadow-[0_10px_24px_rgba(79,70,229,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:saturate-110"
            >
              + New role
            </Link>
            <Link
              to="/admin"
              className="flex-1 sm:flex-none inline-flex items-center justify-center min-h-[44px] px-4 rounded-2xl border border-slate-200 bg-white/90 text-sm font-extrabold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5"
            >
              Back
            </Link>
          </div>
        </header>

        {/* Content card */}
        <section className="p-4 rounded-3xl border border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(31,41,55,0.08)]">
          <form
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(260px,1fr)_auto_auto_auto] items-center gap-2.5 mb-3.5"
            onSubmit={(event) => {
              event.preventDefault();
              load();
            }}
          >
            <div className="relative sm:col-span-2 lg:col-span-1">
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="w-full h-[46px] pl-10 pr-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                placeholder="Search name or department"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <label className="inline-flex items-center gap-2 min-h-[44px] text-slate-600 text-[13px] font-bold whitespace-nowrap cursor-pointer">
              <input
                type="checkbox"
                checked={includeInactive}
                onChange={(event) => setIncludeInactive(event.target.checked)}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
              <span>Include inactive</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full lg:w-auto min-h-[44px] px-4 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white text-sm font-extrabold transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {loading ? "Filtering..." : "Filter"}
            </button>

            <button
              type="button"
              onClick={clearFilters}
              disabled={loading}
              className="w-full lg:w-auto min-h-[44px] px-4 rounded-xl border border-slate-200 bg-white text-sm font-extrabold text-slate-700 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Clear
            </button>
          </form>

          {error && (
            <div role="alert" className="flex flex-col gap-0.5 mb-3.5 px-4 py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700">
              <strong className="text-sm font-extrabold">Unable to load roles</strong>
              <span className="text-sm">{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center gap-2.5 min-h-[230px] text-slate-400 text-sm font-bold">
              <svg className="animate-spin" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              <span>Loading roles...</span>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full min-w-[650px] border-collapse">
                <thead>
                  <tr>
                    <th className="text-left px-4 py-3.5 border-b border-slate-100 bg-slate-50/80 text-slate-400 text-[11px] font-black uppercase tracking-wide">Name</th>
                    <th className="text-left px-4 py-3.5 border-b border-slate-100 bg-slate-50/80 text-slate-400 text-[11px] font-black uppercase tracking-wide">Department</th>
                    <th className="text-left px-4 py-3.5 border-b border-slate-100 bg-slate-50/80 text-slate-400 text-[11px] font-black uppercase tracking-wide">Active</th>
                    <th className="text-right px-4 py-3.5 border-b border-slate-100 bg-slate-50/80 text-slate-400 text-[11px] font-black uppercase tracking-wide">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((role) => (
                    <tr key={role.id} className="group">
                      <td className="px-4 py-3.5 border-b border-slate-50 bg-white group-hover:bg-slate-50/60 transition-colors duration-150">
                        <div className="flex items-center gap-2.5 font-extrabold text-slate-800">
                          <div className="flex items-center justify-center w-8.5 h-8.5 w-[34px] h-[34px] rounded-[11px] bg-indigo-50 text-indigo-600 text-[13px] font-black">
                            {role.name?.charAt(0)?.toUpperCase() || "R"}
                          </div>
                          <span>{role.name}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 border-b border-slate-50 bg-white group-hover:bg-slate-50/60 transition-colors duration-150 text-slate-500">
                        {role.department || "—"}
                      </td>

                      <td className="px-4 py-3.5 border-b border-slate-50 bg-white group-hover:bg-slate-50/60 transition-colors duration-150">
                        {role.is_active ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold text-emerald-600 bg-emerald-50">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold text-rose-600 bg-rose-50">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 border-b border-slate-50 bg-white group-hover:bg-slate-50/60 transition-colors duration-150 text-right">
                        <Link
                          to={`/admin/roles/${role.id}`}
                          className="text-indigo-600 text-[13px] font-extrabold hover:text-indigo-800 transition-colors duration-150"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {!loading && items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-0">
                        <div className="flex flex-col items-center justify-center gap-1.5 min-h-[220px] text-slate-400">
                          <div className="flex items-center justify-center w-12 h-12 mb-1 rounded-2xl bg-indigo-50 text-indigo-600 text-2xl">
                            ▣
                          </div>
                          <strong className="text-slate-800 text-[15px] font-bold">No roles found</strong>
                          <span className="text-sm">Try changing the search or filter options.</span>
                        </div>
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