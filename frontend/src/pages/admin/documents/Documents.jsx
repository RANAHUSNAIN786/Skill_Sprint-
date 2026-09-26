import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../lib/api";

const DOC_TYPES = [
  "",
  "policy",
  "hr_policy",
  "leave_policy",
  "info_security",
  "workplace_conduct",
  "data_privacy",
  "sop",
  "process_manual",
  "role_description",
  "faq",
  "compliance",
  "handbook",
  "department_guideline",
  "safety",
  "other",
];

export default function Documents() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [docType, setDocType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (docType) params.set("doc_type", docType);
      const q = params.toString() ? `?${params.toString()}` : "";
      const data = await api.get(`/api/documents${q}`);
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
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    load();
  };

  return (
    <div className="min-h-screen p-6 bg-[radial-gradient(circle_at_5%_0%,rgba(79,70,229,0.11),transparent_60%),radial-gradient(circle_at_95%_5%,rgba(6,182,212,0.10),transparent_60%)] bg-slate-50 text-slate-900 font-sans">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-4">
        {/* Header */}
        <header className="flex items-end justify-between gap-5 flex-wrap">
          <div>
            <div className="text-indigo-600 text-xs font-extrabold uppercase tracking-[.14em] mb-1.5">
              Admin / Documents
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Documents <span className="text-slate-400 text-2xl font-bold">({total})</span>
            </h1>
          </div>

          <div className="flex gap-2.5 flex-wrap">
            <Link
              to="/admin/documents/upload"
              className="inline-flex items-center gap-1.5 justify-center min-h-[44px] px-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white text-sm font-extrabold shadow-[0_10px_24px_rgba(79,70,229,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:saturate-110"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Upload document
            </Link>
            <Link
              to="/admin"
              className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-2xl border border-slate-200 bg-white/90 text-sm font-extrabold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5"
            >
              Back
            </Link>
          </div>
        </header>

        {/* Filters */}
        <section className="p-4 rounded-3xl border border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(31,41,55,0.08)]">
          <form className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr_auto] gap-2.5" onSubmit={onSubmit}>
            <input
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
            >
              {DOC_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t || "All types"}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold transition-all duration-200 hover:bg-slate-800 active:scale-95 whitespace-nowrap"
            >
              Filter
            </button>
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
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Name</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Type</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Department</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Active</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((d) => (
                  <tr key={d.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{d.doc_code}</td>
                    <td className="px-4 py-3 font-extrabold text-slate-800">{d.name}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border border-indigo-200 bg-indigo-50 text-indigo-600">
                        {d.doc_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{d.department || "—"}</td>
                    <td className="px-4 py-3">
                      {d.is_active ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border border-emerald-200 bg-emerald-50 text-emerald-600">yes</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border border-slate-200 bg-slate-100 text-slate-500">no</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/admin/documents/${d.id}`}
                        className="text-indigo-600 text-xs font-bold hover:text-indigo-800 transition-colors duration-150"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
                {!loading && items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-400 font-medium">
                      No documents.
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