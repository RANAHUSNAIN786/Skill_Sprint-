import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../lib/api";
import { DUE_STAGES, MUST_TYPES, PRIORITIES, REQUIREMENT_TYPES } from "../../../lib/enums";

const EMPTY = {
  req_code: "",
  title: "",
  description: "",
  requirement_type: "policy",
  must_type: "must_know",
  priority: "medium",
  due_stage: "",
  competency: "",
  assessment_topic: "",
  source_document_id: "",
  source_section: "",
};

export default function Requirements() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [reqType, setReqType] = useState("");
  const [mustType, setMustType] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState(EMPTY);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (reqType) params.set("requirement_type", reqType);
      if (mustType) params.set("must_type", mustType);

      const q = params.toString() ? `?${params.toString()}` : "";
      const data = await api.get(`/api/requirements${q}`);

      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (k) => (e) => setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const onCreate = async (e) => {
    e.preventDefault();
    setFormError(null);
    setBusy(true);

    try {
      const payload = { ...form };

      Object.keys(payload).forEach((k) => {
        if (payload[k] === "") payload[k] = null;
      });

      if (payload.source_document_id !== null) {
        payload.source_document_id = Number(payload.source_document_id);
      }

      await api.post("/api/requirements", payload);

      setForm(EMPTY);
      setCreating(false);
      await load();
    } catch (err) {
      setFormError(err.message || "Failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-[radial-gradient(circle_at_5%_0%,rgba(79,70,229,0.11),transparent_60%),radial-gradient(circle_at_95%_5%,rgba(6,182,212,0.10),transparent_60%)] bg-slate-50 text-slate-900 font-sans">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-4">
        {/* Header */}
        <header className="flex items-end justify-between gap-5 flex-wrap">
          <div>
            <div className="text-indigo-600 text-xs font-extrabold uppercase tracking-[.14em] mb-1.5">
              Admin / Requirements
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Requirements <span className="text-slate-400 text-2xl font-bold">({total})</span>
            </h1>
          </div>

          <div className="flex gap-2.5 flex-wrap">
            <Link
              to="/admin"
              className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-2xl border border-slate-200 bg-white/90 text-sm font-extrabold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5"
            >
              Back
            </Link>
            <button
              type="button"
              onClick={() => setCreating((c) => !c)}
              className={`inline-flex items-center justify-center min-h-[44px] px-4 rounded-2xl text-sm font-extrabold transition-all duration-200 active:scale-95 ${
                creating
                  ? "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  : "bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-[0_10px_24px_rgba(79,70,229,0.18)] hover:-translate-y-0.5"
              }`}
            >
              {creating ? "Cancel" : "+ New requirement"}
            </button>
          </div>
        </header>

        {/* Filters */}
        <section className="p-4 rounded-3xl border border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(31,41,55,0.08)]">
          <form
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto] gap-2.5"
            onSubmit={(e) => {
              e.preventDefault();
              load();
            }}
          >
            <input
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
              value={reqType}
              onChange={(e) => setReqType(e.target.value)}
            >
              <option value="">All types</option>
              {REQUIREMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
              value={mustType}
              onChange={(e) => setMustType(e.target.value)}
            >
              <option value="">All must-types</option>
              {MUST_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
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

        {/* Create form */}
        {creating && (
          <section className="p-5 rounded-3xl border border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(31,41,55,0.08)]">
            <form className="flex flex-col gap-4" onSubmit={onCreate}>
              <div className="mb-1">
                <h2 className="font-extrabold text-slate-900 text-[17px]">New requirement</h2>
              </div>

              {formError && (
                <div role="alert" className="px-4 py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-semibold">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-slate-700 text-[13px] font-extrabold">Code</span>
                  <input
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                    value={form.req_code}
                    onChange={update("req_code")}
                    required
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-slate-700 text-[13px] font-extrabold">Title</span>
                  <input
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                    value={form.title}
                    onChange={update("title")}
                    required
                  />
                </label>

                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="text-slate-700 text-[13px] font-extrabold">Description</span>
                  <textarea
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150 min-h-[90px] resize-y"
                    value={form.description}
                    onChange={update("description")}
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-slate-700 text-[13px] font-extrabold">Requirement type</span>
                  <select
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                    value={form.requirement_type}
                    onChange={update("requirement_type")}
                  >
                    {REQUIREMENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-slate-700 text-[13px] font-extrabold">Must type</span>
                  <select
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                    value={form.must_type}
                    onChange={update("must_type")}
                  >
                    {MUST_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-slate-700 text-[13px] font-extrabold">Priority</span>
                  <select
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                    value={form.priority}
                    onChange={update("priority")}
                  >
                    {PRIORITIES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-slate-700 text-[13px] font-extrabold">Due stage</span>
                  <select
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                    value={form.due_stage}
                    onChange={update("due_stage")}
                  >
                    <option value="">—</option>
                    {DUE_STAGES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-slate-700 text-[13px] font-extrabold">Competency</span>
                  <input
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                    value={form.competency}
                    onChange={update("competency")}
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-slate-700 text-[13px] font-extrabold">Assessment topic</span>
                  <input
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                    value={form.assessment_topic}
                    onChange={update("assessment_topic")}
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-slate-700 text-[13px] font-extrabold">Source document id</span>
                  <input
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                    type="number"
                    value={form.source_document_id}
                    onChange={update("source_document_id")}
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-slate-700 text-[13px] font-extrabold">Source section</span>
                  <input
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                    value={form.source_section}
                    onChange={update("source_section")}
                  />
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white text-sm font-extrabold shadow-[0_10px_24px_rgba(79,70,229,0.18)] transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                >
                  {busy ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Table */}
        <section className="rounded-3xl bg-white/90 border border-slate-200/80 shadow-[0_18px_50px_rgba(31,41,55,0.08)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/70">
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Code</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Title</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Type</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Must</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Priority</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Stage</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Source</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>

              <tbody>
                {items.map((r) => (
                  <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{r.req_code}</td>
                    <td className="px-4 py-3 font-extrabold text-slate-800">{r.title}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border border-indigo-200 bg-indigo-50 text-indigo-600">
                        {r.requirement_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {r.must_type}
                      {r.is_mandatory_derived ? (
                        <span className="ml-1.5 text-rose-500 font-bold">●</span>
                      ) : (
                        ""
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{r.priority}</td>
                    <td className="px-4 py-3 text-slate-500">{r.due_stage || "—"}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {r.source_document_id
                        ? `${r.source_document_id}${r.source_section ? ` §${r.source_section}` : ""}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/admin/requirements/${r.id}`}
                        className="text-indigo-600 text-xs font-bold hover:text-indigo-800 transition-colors duration-150"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}

                {!loading && items.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-slate-400 font-medium">
                      No requirements.
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