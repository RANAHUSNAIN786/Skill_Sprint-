import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { PRECEDENCE_SOURCE_TYPES } from "../../lib/enums";

export default function Settings() {
  const [rules, setRules] = useState([]);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [newRule, setNewRule] = useState({
    source_type: PRECEDENCE_SOURCE_TYPES[0],
    rank: 10,
    label: "",
  });
  const [edits, setEdits] = useState({});

  const load = async () => {
    setError(null);
    try {
      const data = await api.get("/api/precedence-rules?include_inactive=true");
      setRules(data.items || []);
      const e = {};
      (data.items || []).forEach((r) => {
        e[r.id] = { rank: r.rank, label: r.label || "", is_active: r.is_active };
      });
      setEdits(e);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    setBusy(true);
    setError(null);
    try {
      await api.post("/api/precedence-rules", {
        source_type: newRule.source_type,
        rank: Number(newRule.rank),
        label: newRule.label || null,
      });
      setNewRule({ source_type: PRECEDENCE_SOURCE_TYPES[0], rank: 10, label: "" });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const saveRow = async (id) => {
    setBusy(true);
    setError(null);
    try {
      const e = edits[id];
      await api.put(`/api/precedence-rules/${id}`, {
        rank: Number(e.rank),
        label: e.label || null,
        is_active: e.is_active,
      });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const deleteRow = async (id) => {
    if (!confirm("Delete this rule?")) return;
    setBusy(true);
    try {
      await api.del(`/api/precedence-rules/${id}`);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const updateEdit = (id, key, value) => {
    setEdits({ ...edits, [id]: { ...edits[id], [key]: value } });
  };

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
            System preferences
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-700 to-slate-900 bg-clip-text text-transparent">
            Settings
          </h1>
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

        {/* Precedence rules */}
        <section className="rounded-3xl bg-white border border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.04)] overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <h2 className="font-extrabold text-slate-900 text-[15px]">Policy precedence rules</h2>
            <p className="text-slate-500 text-xs mt-1.5 max-w-2xl leading-relaxed">
              Lower rank wins when two source documents conflict. Used by the validation pipeline to resolve contradictions.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-slate-100 bg-slate-50/60">
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-5 py-3">Source type</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-5 py-3">Rank</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-5 py-3">Label</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-5 py-3">Active</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {rules.map((r) => {
                  const e = edits[r.id] || {};
                  return (
                    <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors duration-150">
                      <td className="px-5 py-3">
                        <span className="text-[11px] font-extrabold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                          {r.source_type}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <input
                          type="number"
                          value={e.rank ?? r.rank}
                          onChange={(ev) => updateEdit(r.id, "rank", ev.target.value)}
                          className="w-20 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                        />
                      </td>
                      <td className="px-5 py-3">
                        <input
                          value={e.label ?? ""}
                          onChange={(ev) => updateEdit(r.id, "label", ev.target.value)}
                          placeholder="Optional label"
                          className="w-full min-w-[160px] px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                        />
                      </td>
                      <td className="px-5 py-3">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!e.is_active}
                            onChange={(ev) => updateEdit(r.id, "is_active", ev.target.checked)}
                            className="sr-only peer"
                          />
                          <span className="w-9 h-5 rounded-full bg-slate-200 peer-checked:bg-emerald-500 transition-colors duration-200 relative">
                            <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 peer-checked:translate-x-4" />
                          </span>
                        </label>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => saveRow(r.id)}
                            disabled={busy}
                            type="button"
                            className="px-3.5 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-bold transition-all duration-200 hover:bg-indigo-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => deleteRow(r.id)}
                            disabled={busy}
                            type="button"
                            className="px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-600 text-xs font-bold transition-all duration-200 hover:bg-rose-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {rules.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-slate-400 font-medium">
                      No rules yet — add one below.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add rule */}
          <div className="px-5 py-5 border-t border-slate-100 bg-slate-50/60">
            <h3 className="font-extrabold text-slate-900 text-sm mb-3">Add a new rule</h3>
            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={newRule.source_type}
                onChange={(e) => setNewRule({ ...newRule, source_type: e.target.value })}
                className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
              >
                {PRECEDENCE_SOURCE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={newRule.rank}
                onChange={(e) => setNewRule({ ...newRule, rank: e.target.value })}
                className="w-24 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
              />

              <input
                placeholder="Label (optional)"
                value={newRule.label}
                onChange={(e) => setNewRule({ ...newRule, label: e.target.value })}
                className="flex-1 min-w-[180px] px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
              />

              <button
                onClick={create}
                disabled={busy}
                type="button"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-bold shadow-sm transition-all duration-200 hover:bg-slate-800 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add rule
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}