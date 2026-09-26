import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";

export default function PolicyImpact() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState("");
  const [requirements, setRequirements] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  useEffect(() => {
    api
      .get("/api/documents?limit=200")
      .then((d) => setDocuments(d.items || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingDocs(false));
  }, []);

  const onAnalyze = async (e) => {
    e.preventDefault();
    if (!selectedDocId) return;
    setError(null);
    setRequirements([]);
    setHasAnalyzed(false);
    setAnalyzing(true);
    try {
      const data = await api.get(
        `/api/requirements?source_document_id=${selectedDocId}&limit=200`
      );
      setRequirements(data.items || []);
      setHasAnalyzed(true);
    } catch (err) {
      setError(err.message || "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const selectedDoc = documents.find((d) => String(d.id) === String(selectedDocId));

  const priorityStyles = {
    high: "border-rose-200 bg-rose-50 text-rose-700",
    medium: "border-amber-200 bg-amber-50 text-amber-700",
    low: "border-sky-200 bg-sky-50 text-sky-700",
  };

  return (
    <div className="min-h-screen p-6 bg-[radial-gradient(circle_at_5%_0%,rgba(79,70,229,0.11),transparent_60%),radial-gradient(circle_at_95%_5%,rgba(6,182,212,0.10),transparent_60%)] bg-slate-50 text-slate-900 font-sans">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-5">
        {/* Header */}
        <header className="flex items-end justify-between gap-5 flex-wrap">
          <div>
            <div className="text-indigo-600 text-xs font-extrabold uppercase tracking-[.14em] mb-1.5">
              Admin / Analysis
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Policy impact analysis
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 font-medium">
              See which requirements are derived from a selected policy or document.
            </p>
          </div>

          <Link
            to="/admin"
            className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-2xl border border-slate-200 bg-white/90 text-sm font-extrabold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5"
          >
            Back
          </Link>
        </header>

        {/* Select + Analyze */}
        <section className="p-5 rounded-3xl border border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(31,41,55,0.07)]">
          <form onSubmit={onAnalyze} className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Document / Policy
              </label>
              <select
                value={selectedDocId}
                onChange={(e) => {
                  setSelectedDocId(e.target.value);
                  setHasAnalyzed(false);
                  setRequirements([]);
                }}
                disabled={loadingDocs}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 disabled:opacity-60"
              >
                <option value="">
                  {loadingDocs ? "Loading documents..." : "Select a document"}
                </option>
                {documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.doc_code} — {d.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={!selectedDocId || analyzing}
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white text-sm font-extrabold shadow-[0_10px_24px_rgba(79,70,229,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:saturate-110 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {analyzing ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                "Analyze impact"
              )}
            </button>
          </form>
        </section>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 px-4 py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-semibold"
          >
            <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Results */}
        {hasAnalyzed && (
          <>
            {/* Summary */}
            <section className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl border border-slate-200 bg-white/90 text-center">
                <div className="text-2xl font-extrabold text-slate-900">
                  {requirements.length}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                  Requirements
                </div>
              </div>
              <div className="p-4 rounded-2xl border border-slate-200 bg-white/90 text-center">
                <div className="text-2xl font-extrabold text-slate-900">
                  {requirements.filter((r) => r.is_mandatory_derived || r.must_type === "must").length}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                  Mandatory
                </div>
              </div>
              <div className="p-4 rounded-2xl border border-slate-200 bg-white/90 text-center col-span-2 sm:col-span-1">
                <div className="text-sm font-extrabold text-slate-900 truncate px-2">
                  {selectedDoc?.doc_code || "—"}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                  Selected document
                </div>
              </div>
            </section>

            {/* Requirements list */}
            <section className="p-5 rounded-3xl border border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(31,41,55,0.07)]">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Linked requirements ({requirements.length})
              </h2>

              {requirements.length === 0 ? (
                <p className="text-sm text-slate-400 font-medium">
                  No requirements are linked to this document.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {requirements.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-start justify-between gap-3 p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-sm font-extrabold text-slate-800">
                            {r.req_code}: {r.title}
                          </span>
                          {r.priority && (
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${
                                priorityStyles[r.priority] || priorityStyles.medium
                              }`}
                            >
                              {r.priority}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-medium">
                          {r.requirement_type}
                          {r.must_type ? ` · ${r.must_type}` : ""}
                          {r.source_section ? ` · § ${r.source_section}` : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}