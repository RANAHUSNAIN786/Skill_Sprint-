import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../../lib/api";

const SYSTEM_ROLES = [
  "employee",
  "manager",
  "reviewer",
  "training_manager",
  "admin",
];

const EXPERIENCE_LEVELS = ["", "beginner", "intermediate", "advanced"];

const EMPTY = {
  employee_id: "",
  name: "",
  email: "",
  password: "",
  system_role: "employee",
  job_role_id: "",
  department: "",
  experience_level: "",
  location: "",
  joining_date: "",
  reporting_manager_id: "",
  previous_experience: "",
};

export default function CreateUser() {
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [jobRoles, setJobRoles] = useState([]);
  const [managers, setManagers] = useState([]);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [jobRolesData, managersData] = await Promise.all([
          api.get("/api/job-roles?limit=200"),
          api.get("/api/users?limit=200"),
        ]);

        setJobRoles(jobRolesData.items || []);
        setManagers(managersData.items || []);
      } catch {
        // Silent fail
      }
    };

    loadOptions();
  }, []);

  const update = (key) => (event) => {
    setForm((prev) => ({
      ...prev,
      [key]: event.target.value,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setBusy(true);

    try {
      const payload = { ...form };

      Object.keys(payload).forEach((key) => {
        if (payload[key] === "") payload[key] = null;
      });

      if (payload.job_role_id !== null) {
        payload.job_role_id = Number(payload.job_role_id);
      }

      if (payload.reporting_manager_id !== null) {
        payload.reporting_manager_id = Number(payload.reporting_manager_id);
      }

      const created = await api.post("/api/users", payload);
      navigate(`/admin/users/${created.id}`);
    } catch (err) {
      setError(err.message || "Failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-[radial-gradient(circle_at_5%_0%,rgba(79,70,229,0.11),transparent_60%),radial-gradient(circle_at_95%_5%,rgba(6,182,212,0.10),transparent_60%)] bg-slate-50 text-slate-900 font-sans">
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <header className="flex items-end justify-between gap-5 mb-5 flex-wrap">
          <div>
            <div className="text-indigo-600 text-xs font-extrabold uppercase tracking-[.14em]">
              Admin / Users
            </div>
            <h1 className="mt-1.5 mb-1 text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              New user
            </h1>
            <p className="text-slate-500 text-sm">
              Create a new employee account and assign profile details.
            </p>
          </div>

          <Link
            to="/admin/users"
            className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-2xl border border-slate-200 bg-white/90 text-sm font-extrabold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5"
          >
            Back
          </Link>
        </header>

        <form className="flex flex-col gap-3.5" onSubmit={onSubmit}>
          {error && (
            <div role="alert" className="flex flex-col gap-0.5 px-4 py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700">
              <strong className="text-sm font-extrabold">Unable to create user</strong>
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
                <h2 className="text-[17px] font-bold m-0">Basic information</h2>
                <p className="text-slate-500 text-xs mt-0.5">Enter the employee account details.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Employee ID" required>
                <input
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                  value={form.employee_id}
                  onChange={update("employee_id")}
                  placeholder="e.g. EMP-1023"
                  required
                />
              </Field>

              <Field label="Name" required>
                <input
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                  value={form.name}
                  onChange={update("name")}
                  placeholder="e.g. Muhammad Ali"
                  required
                />
              </Field>

              <Field label="Email" required>
                <input
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="e.g. ali@company.com"
                  required
                />
              </Field>

              <Field label="Password" required hint="Minimum 8 characters">
                <input
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                  type="password"
                  value={form.password}
                  onChange={update("password")}
                  placeholder="Enter password"
                  minLength={8}
                  required
                />
              </Field>
            </div>
          </section>

          {/* Section 02 */}
          <section className="p-5 rounded-3xl border border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(31,41,55,0.08)]">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 text-xs font-black">
                02
              </div>
              <div>
                <h2 className="text-[17px] font-bold m-0">Role and department</h2>
                <p className="text-slate-500 text-xs mt-0.5">Assign access and job-related information.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="System role">
                <select
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                  value={form.system_role}
                  onChange={update("system_role")}
                >
                  {SYSTEM_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Job role">
                <select
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                  value={form.job_role_id}
                  onChange={update("job_role_id")}
                >
                  <option value="">— Select job role —</option>
                  {jobRoles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                      {role.department ? ` (${role.department})` : ""}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Department">
                <input
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                  value={form.department}
                  onChange={update("department")}
                  placeholder="e.g. HR, IT, Finance"
                />
              </Field>

              <Field label="Experience level">
                <select
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                  value={form.experience_level}
                  onChange={update("experience_level")}
                >
                  {EXPERIENCE_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level || "— Select experience level —"}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </section>

          {/* Section 03 */}
          <section className="p-5 rounded-3xl border border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(31,41,55,0.08)]">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-50 text-amber-600 text-xs font-black">
                03
              </div>
              <div>
                <h2 className="text-[17px] font-bold m-0">Work profile</h2>
                <p className="text-slate-500 text-xs mt-0.5">Add joining and reporting information.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Location">
                <input
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                  value={form.location}
                  onChange={update("location")}
                  placeholder="e.g. Lahore"
                />
              </Field>

              <Field label="Joining date">
                <input
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                  type="date"
                  value={form.joining_date}
                  onChange={update("joining_date")}
                />
              </Field>

              <Field label="Reporting manager">
                <select
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                  value={form.reporting_manager_id}
                  onChange={update("reporting_manager_id")}
                >
                  <option value="">— Select manager —</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name} ({manager.email})
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Previous experience" hint="Maximum 500 characters">
                <textarea
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150 min-h-[125px] resize-y"
                  value={form.previous_experience}
                  onChange={update("previous_experience")}
                  maxLength={500}
                  placeholder="Write previous experience or relevant background..."
                />
              </Field>
            </div>
          </section>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-1 pb-3">
            <Link
              to="/admin/users"
              className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-2xl border border-slate-200 bg-white/90 text-sm font-extrabold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white text-sm font-extrabold shadow-[0_10px_24px_rgba(79,70,229,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:saturate-110 active:scale-95 disabled:opacity-65 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {busy ? "Creating..." : "Create user"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, required, hint, children }) {
  return (
    <label className="flex flex-col gap-1.5 min-w-0">
      <span className="text-slate-700 text-[13px] font-extrabold">
        {label} {required && <b className="text-rose-600">*</b>}
      </span>
      {children}
      {hint && <span className="text-slate-400 text-xs">{hint}</span>}
    </label>
  );
}