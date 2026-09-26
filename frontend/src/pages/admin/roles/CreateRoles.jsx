import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../../lib/api";

export default function CreateRoles() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    department: "",
    description: "",
  });

  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const update = (key) => (event) => {
    setForm((previousForm) => ({
      ...previousForm,
      [key]: event.target.value,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setBusy(true);

    try {
      const payload = {
        name: form.name.trim(),
        department: form.department.trim() || null,
        description: form.description.trim() || null,
      };

      const created = await api.post("/api/job-roles", payload);

      navigate(`/admin/roles/${created.id}`);
    } catch (err) {
      setError(err.message || "Failed to create job role");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-[radial-gradient(circle_at_5%_0%,rgba(79,70,229,0.11),transparent_60%),radial-gradient(circle_at_95%_5%,rgba(6,182,212,0.10),transparent_60%)] bg-slate-50 text-slate-900 font-sans">
      <div className="w-full max-w-3xl mx-auto">
        {/* Header */}
        <header className="flex items-end justify-between gap-5 mb-5 flex-wrap">
          <div>
            <div className="text-indigo-600 text-xs font-extrabold uppercase tracking-[.14em]">
              Admin / Job roles
            </div>
            <h1 className="mt-1.5 mb-1 text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              New job role
            </h1>
            <p className="text-slate-500 text-sm">
              Create a new role for your organization.
            </p>
          </div>

          <Link
            to="/admin/roles"
            className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-2xl border border-slate-200 bg-white/90 text-sm font-extrabold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5"
          >
            ← Back to roles
          </Link>
        </header>

        <form className="flex flex-col gap-3.5" onSubmit={onSubmit}>
          {error && (
            <div role="alert" className="flex flex-col gap-0.5 px-4 py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700">
              <strong className="text-sm font-extrabold">Unable to create role</strong>
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Section 01 */}
          <section className="p-5 rounded-3xl border border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(31,41,55,0.08)]">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-black">
                01
              </div>
              <div>
                <h2 className="text-[18px] font-bold m-0">Role information</h2>
                <p className="text-slate-500 text-xs mt-1">Add the basic details of this job role.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-slate-700 text-[13px] font-extrabold">
                  Name <b className="text-rose-600">*</b>
                </span>
                <input
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                  value={form.name}
                  onChange={update("name")}
                  placeholder="e.g. Software Engineer"
                  required
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-slate-700 text-[13px] font-extrabold">Department</span>
                <input
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                  value={form.department}
                  onChange={update("department")}
                  placeholder="e.g. IT, HR, Finance"
                />
              </label>

              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="text-slate-700 text-[13px] font-extrabold">Description</span>
                <textarea
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150 min-h-[140px] resize-y"
                  value={form.description}
                  onChange={update("description")}
                  placeholder="Write a short description of this role..."
                />
              </label>
            </div>
          </section>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-1 pb-3">
            <Link
              to="/admin/roles"
              className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-2xl border border-slate-200 bg-white/90 text-sm font-extrabold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white text-sm font-extrabold shadow-[0_10px_24px_rgba(79,70,229,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:saturate-110 active:scale-95 disabled:opacity-65 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {busy ? "Creating..." : "Create role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}