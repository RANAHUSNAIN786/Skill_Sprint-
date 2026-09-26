import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../../lib/api";

const SYSTEM_ROLES = ["employee", "manager", "reviewer", "training_manager", "admin"];
const EXPERIENCE_LEVELS = ["", "beginner", "intermediate", "advanced"];
const TRAINING_STATUSES = [
  "not_started",
  "in_progress",
  "on_track",
  "requires_attention",
  "behind_schedule",
  "assessment_required",
  "completed",
];

export default function UserDetails() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [jobRoles, setJobRoles] = useState([]);
  const [managers, setManagers] = useState([]);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setError(null);
    setLoading(true);
    try {
      const u = await api.get(`/api/users/${userId}`);
      setUser(u);

      const jr = await api.get("/api/job-roles?limit=200");
      setJobRoles(jr.items || []);

      const mg = await api.get("/api/users?limit=200");
      setManagers((mg.items || []).filter((m) => m.id !== u.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const update = (k) => (e) => setUser({ ...user, [k]: e.target.value });

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      const payload = {
        name: user.name,
        system_role: user.system_role,
        job_role_id: user.job_role_id ? Number(user.job_role_id) : null,
        department: user.department || null,
        experience_level: user.experience_level || null,
        location: user.location || null,
        joining_date: user.joining_date || null,
        reporting_manager_id: user.reporting_manager_id
          ? Number(user.reporting_manager_id)
          : null,
        previous_experience: user.previous_experience || null,
        training_status: user.training_status,
      };
      await api.put(`/api/users/${userId}`, payload);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const deactivate = async () => {
    if (!confirm("Deactivate this user?")) return;
    setBusy(true);
    try {
      await api.del(`/api/users/${userId}`);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen p-5 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl border border-slate-200 bg-white/85 shadow-[0_2px_10px_rgba(15,23,42,0.04)] p-6">
            <div className="h-4 w-1/2 rounded-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-pulse" />
            <div className="h-4 w-4/5 rounded-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-pulse mt-2.5" />
            <div className="h-24 rounded-2xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-pulse mt-3.5" />
            <div className="h-24 rounded-2xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-pulse mt-3" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen p-5 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl border border-slate-200 bg-white/85 shadow-[0_2px_10px_rgba(15,23,42,0.04)] p-6">
            {error && (
              <div role="alert" className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-semibold mb-3">
                {error}
              </div>
            )}
            <div className="text-slate-400 font-medium">No user loaded.</div>
            <div className="mt-2.5">
              <Link to="/admin/users" className="text-indigo-600 font-bold text-sm hover:text-indigo-800 transition-colors">
                ← Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activePill = user.is_active ? (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-200 bg-emerald-50 text-emerald-600">
      active
    </span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border border-slate-200 bg-slate-100 text-slate-500">
      inactive
    </span>
  );

  return (
    <div className="min-h-screen p-5 bg-[radial-gradient(circle_at_10%_0%,rgba(124,58,237,0.08),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(6,182,212,0.08),transparent_45%)] bg-slate-50 text-slate-900 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col gap-4">
        {/* Top header */}
        <header className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <div className="text-indigo-500 text-xs font-bold uppercase tracking-[.18em] mb-2">
              Admin / Users
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2.5 flex-wrap">
              {user.name}
              <span className="text-slate-400 font-semibold text-lg">({user.employee_id})</span>
              {activePill}
            </h1>
            <div className="text-slate-500 text-sm mt-1">Manage user profile, role and training status.</div>
          </div>

          <div className="flex gap-2.5 flex-wrap justify-end">
            <Link
              to="/admin/users"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-slate-200 bg-white text-sm font-bold text-slate-600 transition-all duration-200 hover:bg-slate-50 active:scale-95"
            >
              ← Back
            </Link>
            <button
              onClick={save}
              disabled={busy}
              type="button"
              className="px-4 py-2.5 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 text-white text-sm font-bold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {busy ? "Saving..." : "Save changes"}
            </button>
            {user.is_active && (
              <button
                onClick={deactivate}
                disabled={busy}
                type="button"
                className="px-4 py-2.5 rounded-full bg-rose-50 text-rose-600 text-sm font-bold transition-all duration-200 hover:bg-rose-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {busy ? "Please wait..." : "Deactivate"}
              </button>
            )}
          </div>
        </header>

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

        {/* Read-only */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-3xl border border-slate-200 bg-white/85 shadow-[0_2px_10px_rgba(15,23,42,0.04)] p-5">
            <div className="font-extrabold text-slate-900 text-[15px]">Read-only</div>
            <div className="grid grid-cols-[140px_1fr] gap-x-3 gap-y-2.5 mt-3">
              <div className="text-slate-400 text-sm">Email</div>
              <div className="font-bold text-sm text-slate-800">{user.email}</div>

              <div className="text-slate-400 text-sm">Created</div>
              <div className="font-mono text-xs text-slate-600 flex items-center">{user.created_at || "—"}</div>

              <div className="text-slate-400 text-sm">Updated</div>
              <div className="font-mono text-xs text-slate-600 flex items-center">{user.updated_at || "—"}</div>

              <div className="text-slate-400 text-sm">Active</div>
              <div className="font-bold text-sm text-slate-800">{user.is_active ? "yes" : "no"}</div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/85 shadow-[0_2px_10px_rgba(15,23,42,0.04)] p-5">
            <div className="font-extrabold text-slate-900 text-[15px]">Quick profile</div>
            <div className="grid grid-cols-[140px_1fr] gap-x-3 gap-y-2.5 mt-3 items-center">
              <div className="text-slate-400 text-sm">System role</div>
              <div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border border-indigo-200 bg-indigo-50 text-indigo-600">
                  {user.system_role || "—"}
                </span>
              </div>

              <div className="text-slate-400 text-sm">Department</div>
              <div className="font-bold text-sm text-slate-800">{user.department || "—"}</div>

              <div className="text-slate-400 text-sm">Experience</div>
              <div className="font-bold text-sm text-slate-800">{user.experience_level || "—"}</div>

              <div className="text-slate-400 text-sm">Training</div>
              <div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border border-cyan-200 bg-cyan-50 text-cyan-600">
                  {user.training_status || "—"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Edit form */}
        <section className="rounded-3xl border border-slate-200 bg-white/85 shadow-[0_2px_10px_rgba(15,23,42,0.04)] p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <div className="font-extrabold text-slate-900 text-[15px]">Edit profile</div>
              <div className="text-slate-500 text-xs mt-1">Update fields and click "Save changes".</div>
            </div>
            {loading ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border border-slate-200 bg-slate-100 text-slate-500 whitespace-nowrap">
                Refreshing…
              </span>
            ) : null}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Name">
              <input
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                value={user.name || ""}
                onChange={update("name")}
              />
            </Field>

            <Field label="System role">
              <select
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                value={user.system_role}
                onChange={update("system_role")}
              >
                {SYSTEM_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Job role">
              <select
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                value={user.job_role_id || ""}
                onChange={update("job_role_id")}
              >
                <option value="">—</option>
                {jobRoles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Department">
              <input
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                value={user.department || ""}
                onChange={update("department")}
                placeholder="e.g. HR / IT"
              />
            </Field>

            <Field label="Experience level">
              <select
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                value={user.experience_level || ""}
                onChange={update("experience_level")}
              >
                {EXPERIENCE_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l || "—"}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Location">
              <input
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                value={user.location || ""}
                onChange={update("location")}
                placeholder="e.g. Lahore / Karachi"
              />
            </Field>

            <Field label="Joining date">
              <input
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                type="date"
                value={user.joining_date || ""}
                onChange={update("joining_date")}
              />
            </Field>

            <Field label="Reporting manager">
              <select
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                value={user.reporting_manager_id || ""}
                onChange={update("reporting_manager_id")}
              >
                <option value="">—</option>
                {managers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field className="md:col-span-2" label="Previous experience">
              <textarea
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150 min-h-[90px] resize-y"
                value={user.previous_experience || ""}
                onChange={update("previous_experience")}
                maxLength={500}
                placeholder="Max 500 characters..."
              />
              <div className="text-slate-400 text-xs mt-1">Max 500 characters.</div>
            </Field>

            <Field label="Training status">
              <select
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                value={user.training_status}
                onChange={update("training_status")}
              >
                {TRAINING_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="flex items-center gap-3 flex-wrap mt-5 pt-5 border-t border-slate-100">
            <button
              onClick={save}
              disabled={busy}
              type="button"
              className="px-4 py-2.5 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 text-white text-sm font-bold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {busy ? "Saving..." : "Save"}
            </button>
            {user.is_active && (
              <button
                onClick={deactivate}
                disabled={busy}
                type="button"
                className="px-4 py-2.5 rounded-full bg-rose-50 text-rose-600 text-sm font-bold transition-all duration-200 hover:bg-rose-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Deactivate
              </button>
            )}
            <Link to="/admin/users" className="text-slate-500 font-bold text-sm hover:text-slate-700 transition-colors ml-1">
              Cancel
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, children, className }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className || ""}`}>
      <span className="text-sm font-bold text-slate-600">{label}</span>
      {children}
    </label>
  );
}