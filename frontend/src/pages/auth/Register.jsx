import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    employee_id: "",
    name: "",
    email: "",
    password: "",
    department: "",
  });

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register({
        employee_id: form.employee_id.trim(),
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        department: form.department.trim() || null,
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-[radial-gradient(circle_at_5%_0%,rgba(79,70,229,0.11),transparent_60%),radial-gradient(circle_at_95%_5%,rgba(6,182,212,0.10),transparent_60%)] bg-slate-50 text-slate-900 font-sans">
      <div className="w-full max-w-md mx-auto flex flex-col gap-5 pt-4 md:pt-10">
        {/* Card */}
        <section className="relative overflow-hidden p-6 md:p-8 rounded-3xl border border-slate-200/80 bg-white/90 shadow-[0_25px_60px_rgba(31,41,55,0.10)] backdrop-blur-sm">
          {/* subtle top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-400" />

          {/* Header */}
          <div className="mb-7 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-[0_10px_25px_rgba(79,70,229,0.25)] mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </div>
            <div className="text-indigo-600 text-xs font-extrabold uppercase tracking-[.16em] mb-2">
              Employee Portal
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              Create account
            </h1>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              Fill in your details to get started
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {/* Employee ID + Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Employee ID
                </label>
                <input
                  value={form.employee_id}
                  onChange={update("employee_id")}
                  required
                  placeholder="EMP-1023"
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Department
                </label>
                <input
                  value={form.department}
                  onChange={update("department")}
                  placeholder="HR / IT"
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200"
                />
              </div>
            </div>

            {/* Full name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Full name
              </label>
              <input
                value={form.name}
                onChange={update("name")}
                required
                placeholder="Muhammad Ali"
                className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={update("email")}
                required
                autoComplete="email"
                placeholder="ali@company.com"
                className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={update("password")}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
                className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200"
              />
              <p className="text-[11px] text-slate-400 font-medium pl-0.5">
                At least 8 characters required
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 px-4 py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-semibold"
              >
                <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-1 inline-flex items-center justify-center gap-2.5 min-h-[52px] w-full px-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white text-[15px] font-extrabold shadow-[0_12px_28px_rgba(79,70,229,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(79,70,229,0.35)] hover:saturate-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_12px_28px_rgba(79,70,229,0.28)]"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>

            {/* Bottom link */}
            <div className="pt-3 text-center border-t border-slate-100 mt-1">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors duration-150"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </section>

        <p className="text-center text-[11px] text-slate-400 font-medium tracking-wide">
          Clean • Light • VIP one-look theme
        </p>
      </div>
    </div>
  );
}