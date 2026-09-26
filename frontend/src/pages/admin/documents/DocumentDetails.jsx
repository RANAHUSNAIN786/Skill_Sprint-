import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../../lib/api";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const CHUNKS_PER_PAGE = 25;

export default function DocumentDetails() {
  const { documentId } = useParams();
  const [detail, setDetail] = useState(null);
  const [chunks, setChunks] = useState({ total: 0, items: [] });
  const [chunkPage, setChunkPage] = useState(0);
  const [chunkVersionId, setChunkVersionId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [supersedeId, setSupersedeId] = useState("");

  const loadDetail = async () => {
    const d = await api.get(`/api/documents/${documentId}`);
    setDetail(d);
    if (chunkVersionId === null && d.current_version) {
      setChunkVersionId(d.current_version.id);
    }
    return d;
  };

  const loadChunks = async (versionId, page) => {
    const skip = page * CHUNKS_PER_PAGE;
    const params = new URLSearchParams({
      skip: String(skip),
      limit: String(CHUNKS_PER_PAGE),
    });
    if (versionId) params.set("version_id", String(versionId));
    const c = await api.get(
      `/api/documents/${documentId}/chunks?${params.toString()}`,
    );
    setChunks({ total: c.total || 0, items: c.items || [] });
  };

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await loadDetail();
      const vid = chunkVersionId ?? d.current_version?.id ?? null;
      if (vid) {
        await loadChunks(vid, 0);
        setChunkPage(0);
      } else {
        setChunks({ total: 0, items: [] });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [documentId]);

  useEffect(() => {
    if (chunkVersionId) {
      loadChunks(chunkVersionId, chunkPage).catch((err) => setError(err.message));
    }
  }, [chunkVersionId, chunkPage]);

  const promoteVersion = async (versionId) => {
    if (!confirm("Make this version current?")) return;
    setBusy(true);
    setError(null);
    try {
      await api.post(`/api/documents/versions/${versionId}/make-current`);
      await loadDetail();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const applySupersede = async () => {
    const value = supersedeId.trim();
    setBusy(true);
    setError(null);
    try {
      const qs = value ? `?superseded_by_id=${encodeURIComponent(value)}` : "";
      await api.post(`/api/documents/${documentId}/supersede${qs}`);
      await loadDetail();
      setSupersedeId("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const clearSupersede = async () => {
    if (!confirm("Clear supersede and reactivate this document?")) return;
    setBusy(true);
    setError(null);
    try {
      await api.post(`/api/documents/${documentId}/supersede`);
      await loadDetail();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400 font-semibold">
          <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Loading...
        </div>
      </div>
    );
  }

  if (error && !detail) {
    return (
      <div className="min-h-screen p-6 bg-slate-50 flex items-center justify-center">
        <div role="alert" className="px-4 py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-semibold">
          {error}
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen p-6 bg-slate-50 flex items-center justify-center">
        <div className="text-slate-400 font-semibold">Not found.</div>
      </div>
    );
  }

  const doc = detail.document;
  const current = detail.current_version;
  const totalChunkPages = Math.max(1, Math.ceil(chunks.total / CHUNKS_PER_PAGE));

  return (
    <div className="min-h-screen p-6 bg-[radial-gradient(circle_at_5%_0%,rgba(79,70,229,0.11),transparent_60%),radial-gradient(circle_at_95%_5%,rgba(6,182,212,0.10),transparent_60%)] bg-slate-50 text-slate-900 font-sans">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-4">
        {/* Header */}
        <header className="flex items-end justify-between gap-5 flex-wrap">
          <div>
            <div className="text-indigo-600 text-xs font-extrabold uppercase tracking-[.14em] mb-1.5">
              Admin / Documents
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
              <span className="font-mono text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg text-lg mr-2">{doc.doc_code}</span>
              {doc.name}
            </h1>
          </div>
          <Link
            to="/admin/documents"
            className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-2xl border border-slate-200 bg-white/90 text-sm font-extrabold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5"
          >
            Back
          </Link>
        </header>

        {error && (
          <div role="alert" className="px-4 py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-semibold">
            {error}
          </div>
        )}

        {/* Metadata */}
        <section className="p-5 rounded-3xl border border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(31,41,55,0.08)]">
          <div className="font-extrabold text-slate-900 text-[15px] mb-3.5">Metadata</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
            <div className="flex justify-between sm:justify-start gap-2">
              <span className="text-slate-400 font-semibold">Type</span>
              <span className="text-slate-800 font-bold">{doc.doc_type}</span>
            </div>
            <div className="flex justify-between sm:justify-start gap-2">
              <span className="text-slate-400 font-semibold">Department</span>
              <span className="text-slate-800 font-bold">{doc.department || "—"}</span>
            </div>
            <div className="flex justify-between sm:justify-start gap-2">
              <span className="text-slate-400 font-semibold">Category</span>
              <span className="text-slate-800 font-bold">{doc.category || "—"}</span>
            </div>
            <div className="flex justify-between sm:justify-start gap-2">
              <span className="text-slate-400 font-semibold">Active</span>
              {doc.is_active ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border border-emerald-200 bg-emerald-50 text-emerald-600">yes</span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border border-slate-200 bg-slate-100 text-slate-500">no</span>
              )}
            </div>
            <div className="flex justify-between sm:justify-start gap-2">
              <span className="text-slate-400 font-semibold">Superseded by</span>
              <span className="text-slate-800 font-bold">{doc.superseded_by_id ?? "—"}</span>
            </div>
            <div className="sm:col-span-2 flex flex-col gap-1">
              <span className="text-slate-400 font-semibold">Description</span>
              <span className="text-slate-700">{doc.description || "—"}</span>
            </div>
          </div>
        </section>

        {/* Supersede */}
        <section className="p-5 rounded-3xl border border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(31,41,55,0.08)]">
          <div className="font-extrabold text-slate-900 text-[15px]">Supersede</div>
          <p className="text-slate-500 text-xs mt-1 mb-3.5 max-w-xl leading-relaxed">
            Mark this document as replaced by another document. The document becomes inactive.
          </p>
          <div className="flex flex-wrap items-center gap-2.5">
            <input
              className="flex-1 min-w-[220px] px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
              type="number"
              placeholder="Replacement document id"
              value={supersedeId}
              onChange={(e) => setSupersedeId(e.target.value)}
            />
            <button
              onClick={applySupersede}
              disabled={busy || !supersedeId.trim()}
              type="button"
              className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-600 text-sm font-extrabold transition-all duration-200 hover:bg-rose-100 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mark superseded
            </button>
            {doc.superseded_by_id !== null && (
              <button
                onClick={clearSupersede}
                disabled={busy}
                type="button"
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-extrabold text-slate-700 transition-all duration-200 hover:bg-slate-50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear supersede
              </button>
            )}
          </div>
        </section>

        {/* Current version */}
        <section className="p-5 rounded-3xl border border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(31,41,55,0.08)]">
          <div className="font-extrabold text-slate-900 text-[15px] mb-3.5">Current version</div>
          {current ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
              <div className="flex justify-between sm:justify-start gap-2">
                <span className="text-slate-400 font-semibold">Version</span>
                <span className="text-slate-800 font-bold">#{current.version_number} ({current.version_label})</span>
              </div>
              <div className="flex justify-between sm:justify-start gap-2">
                <span className="text-slate-400 font-semibold">Effective</span>
                <span className="text-slate-800 font-bold">{current.effective_date || "—"}</span>
              </div>
              <div className="flex justify-between sm:justify-start gap-2">
                <span className="text-slate-400 font-semibold">Expiry</span>
                <span className="text-slate-800 font-bold">{current.expiry_date || "—"}</span>
              </div>
              <div className="flex justify-between sm:justify-start gap-2">
                <span className="text-slate-400 font-semibold">File</span>
                <span className="text-slate-800 font-bold">{current.original_filename} ({current.size_bytes} bytes)</span>
              </div>
              <div className="flex justify-between sm:justify-start gap-2">
                <span className="text-slate-400 font-semibold">Parse status</span>
                <span className="text-slate-800 font-bold">{current.parse_status}</span>
              </div>
              <div className="flex justify-between sm:justify-start gap-2">
                <span className="text-slate-400 font-semibold">Chars parsed</span>
                <span className="text-slate-800 font-bold">{current.parsed_char_count ?? "—"}</span>
              </div>
              <div className="sm:col-span-2 flex flex-col gap-1">
                <span className="text-slate-400 font-semibold">SHA-256</span>
                <span className="text-slate-600 font-mono text-xs break-all">{current.sha256}</span>
              </div>
              {current.parse_error && (
                <div className="sm:col-span-2 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-semibold">
                  Parse error: {current.parse_error}
                </div>
              )}
              <div className="sm:col-span-2 pt-1">
                <a  
                  href={`${BASE_URL}/api/documents/versions/${current.id}/download`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-indigo-600 text-sm font-bold hover:text-indigo-800 transition-colors duration-150"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download
                </a>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-sm">No current version.</p>
          )}
        </section>

        {/* All versions */}
        <section className="rounded-3xl bg-white/90 border border-slate-200/80 shadow-[0_18px_50px_rgba(31,41,55,0.08)] overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <h2 className="font-extrabold text-slate-900 text-[15px]">All versions ({detail.versions.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-slate-100 bg-slate-50/70">
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">#</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Label</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Effective</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Uploaded</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Current</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Download</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {detail.versions.map((v) => (
                  <tr key={v.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-4 py-3 font-bold text-slate-700">{v.version_number}</td>
                    <td className="px-4 py-3 text-slate-600">{v.version_label}</td>
                    <td className="px-4 py-3 text-slate-500">{v.effective_date || "—"}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{v.uploaded_at}</td>
                    <td className="px-4 py-3">
                      {v.is_current ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border border-emerald-200 bg-emerald-50 text-emerald-600">yes</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border border-slate-200 bg-slate-100 text-slate-500">no</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <a  
                        href={`${BASE_URL}/api/documents/versions/${v.id}/download`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 text-xs font-bold hover:text-indigo-800 transition-colors duration-150"
                      >
                        Download
                      </a>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!v.is_current && (
                        <button
                          disabled={busy}
                          onClick={() => promoteVersion(v.id)}
                          type="button"
                          className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold transition-all duration-200 hover:bg-indigo-100 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Make current
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Chunks */}
        <section className="p-5 rounded-3xl border border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(31,41,55,0.08)]">
          <div className="font-extrabold text-slate-900 text-[15px] mb-3.5">Chunks ({chunks.total})</div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <label className="flex items-center gap-2">
              <span className="text-slate-700 text-[13px] font-extrabold">Version:</span>
              <select
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                value={chunkVersionId ?? ""}
                onChange={(e) => {
                  setChunkPage(0);
                  setChunkVersionId(Number(e.target.value) || null);
                }}
              >
                {detail.versions.map((v) => (
                  <option key={v.id} value={v.id}>
                    v{v.version_number} — {v.version_label}
                    {v.is_current ? " (current)" : ""}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex items-center gap-2 ml-auto">
              <button
                disabled={chunkPage === 0}
                onClick={() => setChunkPage((p) => Math.max(0, p - 1))}
                type="button"
                className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-600 transition-all duration-200 hover:bg-slate-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <span className="text-slate-500 text-xs font-semibold">
                Page {chunkPage + 1} / {totalChunkPages}
              </span>
              <button
                disabled={chunkPage + 1 >= totalChunkPages}
                onClick={() => setChunkPage((p) => Math.min(totalChunkPages - 1, p + 1))}
                type="button"
                className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-600 transition-all duration-200 hover:bg-slate-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {chunks.items.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60">
                <h3 className="font-extrabold text-slate-800 text-sm">
                  {c.chunk_code}
                  {c.heading ? <span className="text-slate-500 font-semibold"> — {c.heading}</span> : ""}
                  {c.page_number ? <span className="text-slate-400 font-normal"> (p.{c.page_number})</span> : ""}
                </h3>
                {c.adversarial_flags && (
                  <div role="alert" className="mt-2 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-semibold">
                    Flags: {c.adversarial_flags}
                  </div>
                )}
                <pre className="whitespace-pre-wrap mt-2.5 text-slate-600 text-sm leading-relaxed font-sans">{c.content}</pre>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}