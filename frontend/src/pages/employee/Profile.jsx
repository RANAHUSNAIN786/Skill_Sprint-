import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";

export default function Profile() {
  const { user, refresh } = useAuth();
  const [pwForm, setPwForm] = useState({
    current_password: "",
    new_password: "",
  });
  const [pwError, setPwError] = useState(null);
  const [pwMsg, setPwMsg] = useState(null);
  const [pwBusy, setPwBusy] = useState(false);

  const onChangePassword = async (e) => {
    e.preventDefault();
    setPwError(null);
    setPwMsg(null);
    setPwBusy(true);
    try {
      await api.put("/api/users/me/password", pwForm);
      setPwForm({ current_password: "", new_password: "" });
      setPwMsg("Password updated.");
      await refresh();
    } catch (err) {
      setPwError(err.message);
    } finally {
      setPwBusy(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen p-6 bg-[radial-gradient(circle_at_5%_0%,rgba(79,70,229,0.11),transparent_60%),radial-gradient(circle_at_95%_5%,rgba(6,182,212,0.10),transparent_60%)] bg-slate-50 text-slate-900 font-sans">
        <div className="w-full max-w-3xl mx-auto flex items-center gap-2.5 text-slate-400 text-sm font-bold">
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-[radial-gradient(circle_at_5%_0%,rgba(79,70,229,0.11),transparent_60%),radial-gradient(circle_at_95%_5%,rgba(6,182,212,0.10),transparent_60%)] bg-slate-50 text-slate-900 font-sans">
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-5">
        {/* Header */}
        <header className="flex items-end justify-between gap-5 flex-wrap">
          <div>
            <div className="text-indigo-600 text-xs font-extrabold uppercase tracking-[.14em] mb-1.5">
              Employee / Profile
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Profile
            </h1>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-2xl border border-slate-200 bg-white/90 text-sm font-extrabold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5"
          >
            Back
          </Link>
        </header>

        {/* Details Card */}
        <section className="p-5 md:p-6 rounded-3xl border border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(31,41,55,0.07)]">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Employee ID
              </span>
              <span className="text-sm font-extrabold text-slate-800">
                {user.employee_id}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Full name
              </span>
              <span className="text-sm font-extrabold text-slate-800">
                {user.name}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Email
              </span>
              <span className="text-sm font-extrabold text-slate-800">
                {user.email}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                System role
              </span>
              <span className="inline-flex items-center w-fit px-2.5 py-0.5 rounded-full text-xs font-bold border border-indigo-200 bg-indigo-50 text-indigo-600 capitalize">
                {user.system_role}
              </span>
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Department
              </span>
              <span className="text-sm font-extrabold text-slate-800">
                {user.department || "—"}
              </span>
            </div>
          </div>
        </section>

        {/* Change Password Card */}
        <section className="p-5 md:p-6 rounded-3xl border border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(31,41,55,0.07)]">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            Change password
          </h2>

          <form onSubmit={onChangePassword} className="flex flex-col gap-4 max-w-md">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Current password
              </label>
              <input
                type="password"
                value={pwForm.current_password}
                onChange={(e) =>
                  setPwForm({ ...pwForm, current_password: e.target.value })
                }
                minLength={8}
                required
                autoComplete="current-password"
                className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                New password
              </label>
              <input
                type="password"
                value={pwForm.new_password}
                onChange={(e) =>
                  setPwForm({ ...pwForm, new_password: e.target.value })
                }
                minLength={8}
                required
                autoComplete="new-password"
                className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200"
              />
              <p className="text-[11px] text-slate-400 font-medium">
                Minimum 8 characters
              </p>
            </div>

            {/* Error */}
            {pwError && (
              <div
                role="alert"
                className="flex items-start gap-2.5 px-4 py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-semibold"
              >
                <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{pwError}</span>
              </div>
            )}

            {/* Success */}
            {pwMsg && (
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-semibold">
                <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>{pwMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={pwBusy}
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white text-sm font-extrabold shadow-[0_10px_24px_rgba(79,70,229,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:saturate-110 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 w-fit"
            >
              {pwBusy ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Updating...
                </>
              ) : (
                "Update password"
              )}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}