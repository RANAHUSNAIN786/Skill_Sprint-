import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { uploadForm } from "../../../lib/uploadApi";

const DOC_TYPES = [
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

export default function UploadDocuments() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    doc_code: "",
    name: "",
    doc_type: "policy",
    department: "",
    category: "",
    description: "",
    version_label: "",
    effective_date: "",
    expiry_date: "",
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("File is required");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      Object.entries(form).forEach(([k, v]) => {
        if (v !== "" && v !== null) fd.append(k, v);
      });
      const result = await uploadForm("/api/documents/upload", fd);
      navigate(`/admin/documents/${result.document.id}`);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-[radial-gradient(circle_at_5%_0%,rgba(79,70,229,0.11),transparent_60%),radial-gradient(circle_at_95%_5%,rgba(6,182,212,0.10),transparent_60%)] bg-slate-50 text-slate-900 font-sans">
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
        {/* Header */}
        <header className="flex items-end justify-between gap-5 flex-wrap">
          <div>
            <div className="text-indigo-600 text-xs font-extrabold uppercase tracking-[.14em] mb-1.5">
              Admin / Documents
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Upload document
            </h1>
          </div>

          <Link
            to="/admin/documents"
            className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-2xl border border-slate-200 bg-white/90 text-sm font-extrabold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5"
          >
            Back
          </Link>
        </header>

        {/* Form Card */}
        <section className="p-5 md:p-6 rounded-3xl border border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(31,41,55,0.08)]">
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {/* File */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                File (PDF or DOCX)
              </label>
              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-600 file:font-bold file:text-xs hover:file:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
              />
            </div>

            {/* Doc Code + Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Document code
                </label>
                <input
                  value={form.doc_code}
                  onChange={update("doc_code")}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Name
                </label>
                <input
                  value={form.name}
                  onChange={update("name")}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                />
              </div>
            </div>

            {/* Type + Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Type
                </label>
                <select
                  value={form.doc_type}
                  onChange={update("doc_type")}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                >
                  {DOC_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Department
                </label>
                <input
                  value={form.department}
                  onChange={update("department")}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                />
              </div>
            </div>

            {/* Category + Version */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Category
                </label>
                <input
                  value={form.category}
                  onChange={update("category")}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Version label
                </label>
                <input
                  value={form.version_label}
                  onChange={update("version_label")}
                  placeholder="v1"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={update("description")}
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150 resize-none"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Effective date
                </label>
                <input
                  type="date"
                  value={form.effective_date}
                  onChange={update("effective_date")}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Expiry date
                </label>
                <input
                  type="date"
                  value={form.expiry_date}
                  onChange={update("expiry_date")}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="px-4 py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-semibold"
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white text-sm font-extrabold shadow-[0_10px_24px_rgba(79,70,229,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:saturate-110 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}