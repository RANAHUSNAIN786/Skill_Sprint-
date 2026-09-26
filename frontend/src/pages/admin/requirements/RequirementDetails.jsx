import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../../lib/api";
import {
  DUE_STAGES,
  MUST_TYPES,
  PRIORITIES,
  REQUIREMENT_TYPES,
} from "../../../lib/enums";

export default function RequirementDetails() {
  const { requirementId } = useParams();

  const [req, setReq] = useState(null);
  const [prereqIds, setPrereqIds] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const [addPrereqId, setAddPrereqId] = useState("");
  const [assignRoleId, setAssignRoleId] = useState("");
  const [assignMandatory, setAssignMandatory] = useState(true);

  const load = async () => {
    setError(null);

    try {
      const detail = await api.get(`/api/requirements/${requirementId}`);

      setReq(detail);
      setPrereqIds(detail.prerequisite_ids || []);

      const asg = await api.get(
        `/api/role-matrix/assignments?requirement_id=${requirementId}`
      );

      setAssignments(asg.items || []);

      const r = await api.get("/api/job-roles?limit=200");
      setRoles(r.items || []);
    } catch (err) {
      setError(err.message || "Failed to load requirement");
    }
  };

  useEffect(() => {
    load();
  }, [requirementId]);

  const update = (k) => (e) => {
    setReq({
      ...req,
      [k]: e.target.value,
    });
  };

  const save = async () => {
    setBusy(true);
    setError(null);

    try {
      const payload = {
        title: req.title,
        description: req.description,
        requirement_type: req.requirement_type,
        must_type: req.must_type,
        priority: req.priority,
        due_stage: req.due_stage || null,
        competency: req.competency || null,
        assessment_topic: req.assessment_topic || null,
        source_document_id: req.source_document_id
          ? Number(req.source_document_id)
          : null,
        source_section: req.source_section || null,
      };

      await api.put(`/api/requirements/${requirementId}`, payload);
      await load();
    } catch (err) {
      setError(err.message || "Failed to save");
    } finally {
      setBusy(false);
    }
  };

  const deactivate = async () => {
    if (!window.confirm("Deactivate this requirement?")) return;

    setBusy(true);

    try {
      await api.del(`/api/requirements/${requirementId}`);
      await load();
    } catch (err) {
      setError(err.message || "Failed to deactivate");
    } finally {
      setBusy(false);
    }
  };

  const addPrereq = async () => {
    const id = Number(addPrereqId);

    if (!id) return;

    setBusy(true);
    setError(null);

    try {
      await api.post(`/api/requirements/${requirementId}/prerequisites`, {
        prerequisite_id: id,
      });

      setAddPrereqId("");
      await load();
    } catch (err) {
      setError(err.message || "Failed to add prerequisite");
    } finally {
      setBusy(false);
    }
  };

  const removePrereq = async (id) => {
    setBusy(true);
    setError(null);

    try {
      await api.del(
        `/api/requirements/${requirementId}/prerequisites/${id}`
      );

      await load();
    } catch (err) {
      setError(err.message || "Failed to remove prerequisite");
    } finally {
      setBusy(false);
    }
  };

  const assign = async () => {
    const role_id = Number(assignRoleId);

    if (!role_id) return;

    setBusy(true);
    setError(null);

    try {
      await api.post("/api/role-matrix/assignments", {
        job_role_id: role_id,
        requirement_id: Number(requirementId),
        is_mandatory: assignMandatory,
      });

      setAssignRoleId("");
      await load();
    } catch (err) {
      setError(err.message || "Failed to assign");
    } finally {
      setBusy(false);
    }
  };

  const unassign = async (link_id) => {
    setBusy(true);
    setError(null);

    try {
      await api.del(`/api/role-matrix/assignments/${link_id}`);
      await load();
    } catch (err) {
      setError(err.message || "Failed to unassign");
    } finally {
      setBusy(false);
    }
  };

  const roleName = (id) =>
    roles.find((r) => r.id === id)?.name || `#${id}`;

  if (!req) {
    return (
      <div className="min-h-screen p-6 bg-[radial-gradient(circle_at_5%_0%,rgba(79,70,229,0.11),transparent_60%),radial-gradient(circle_at_95%_5%,rgba(6,182,212,0.10),transparent_60%)] bg-slate-50 text-slate-900 font-sans">
        <div className="w-full max-w-4xl mx-auto">
          <div className="p-10 rounded-3xl border border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(31,41,55,0.08)] flex flex-col items-center justify-center gap-3.5 text-center min-h-[220px]">
            {error ? (
              <div role="alert" className="w-full px-4 py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-semibold">
                {error}
              </div>
            ) : (
              <div className="flex items-center gap-2.5 text-slate-400 font-semibold">
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Loading...
              </div>
            )}

            <Link
              to="/admin/requirements"
              className="inline-flex items-center justify-center min-h-[40px] px-4 rounded-2xl border border-slate-200 bg-white/90 text-sm font-extrabold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-[radial-gradient(circle_at_5%_0%,rgba(79,70,229,0.11),transparent_60%),radial-gradient(circle_at_95%_5%,rgba(6,182,212,0.10),transparent_60%)] bg-slate-50 text-slate-900 font-sans">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-4">
        {/* Header */}
        <header className="flex items-end justify-between gap-5 flex-wrap">
          <div>
            <div className="text-indigo-600 text-xs font-extrabold uppercase tracking-[.14em] mb-1.5">
              Admin / Requirements
            </div>

            <h1 className="flex items-center gap-2.5 flex-wrap text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black text-indigo-600 bg-indigo-50 font-mono">
                {req.req_code || "REQ"}
              </span>
              <span>{req.title}</span>
            </h1>

            <div className="flex items-center gap-2 text-slate-500 text-sm mt-2">
              <span>Mandatory derived:</span>
              <span
                className={
                  req.is_mandatory_derived
                    ? "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-200 bg-emerald-50 text-emerald-600"
                    : "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border border-slate-200 bg-slate-100 text-slate-500"
                }
              >
                {req.is_mandatory_derived ? "yes" : "no"}
              </span>
            </div>
          </div>

          <div className="flex gap-2.5 flex-wrap justify-end">
            <Link
              to="/admin/requirements"
              className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-2xl border border-slate-200 bg-white/90 text-sm font-extrabold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5"
            >
              Back
            </Link>
            <button
              type="button"
              onClick={save}
              disabled={busy}
              className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white text-sm font-extrabold shadow-[0_10px_24px_rgba(79,70,229,0.18)] transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {busy ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={deactivate}
              disabled={busy}
              className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-2xl bg-rose-50 text-rose-600 text-sm font-extrabold transition-all duration-200 hover:bg-rose-100 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Deactivate
            </button>
          </div>
        </header>

        {error && (
          <div role="alert" className="px-4 py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-semibold">
            {error}
          </div>
        )}

        {/* Edit */}
        <section className="p-5 rounded-3xl border border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(31,41,55,0.08)]">
          <div className="mb-5 pb-4 border-b border-slate-100">
            <div className="font-extrabold text-slate-900 text-[15px]">Edit</div>
            <div className="text-slate-500 text-xs mt-1">Update requirement fields and save.</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Title" wide>
              <input
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                value={req.title || ""}
                onChange={update("title")}
              />
            </Field>

            <Field label="Description" wide>
              <textarea
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150 min-h-[100px] resize-y"
                value={req.description || ""}
                onChange={update("description")}
              />
            </Field>

            <Field label="Requirement type">
              <select
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                value={req.requirement_type || ""}
                onChange={update("requirement_type")}
              >
                {REQUIREMENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Must type">
              <select
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                value={req.must_type || ""}
                onChange={update("must_type")}
              >
                {MUST_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Priority">
              <select
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                value={req.priority || ""}
                onChange={update("priority")}
              >
                {PRIORITIES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Due stage">
              <select
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                value={req.due_stage || ""}
                onChange={update("due_stage")}
              >
                <option value="">—</option>
                {DUE_STAGES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Competency">
              <input
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                value={req.competency || ""}
                onChange={update("competency")}
              />
            </Field>

            <Field label="Assessment topic">
              <input
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                value={req.assessment_topic || ""}
                onChange={update("assessment_topic")}
              />
            </Field>

            <Field label="Source document id">
              <input
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                type="number"
                value={req.source_document_id || ""}
                onChange={update("source_document_id")}
              />
            </Field>

            <Field label="Source section">
              <input
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
                value={req.source_section || ""}
                onChange={update("source_section")}
              />
            </Field>
          </div>

          <div className="flex items-center gap-3 mt-5 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={save}
              disabled={busy}
              className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white text-sm font-extrabold shadow-[0_10px_24px_rgba(79,70,229,0.18)] transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {busy ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={deactivate}
              disabled={busy}
              className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-2xl bg-rose-50 text-rose-600 text-sm font-extrabold transition-all duration-200 hover:bg-rose-100 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Deactivate
            </button>
          </div>
        </section>

        {/* Prerequisites */}
        <section className="p-5 rounded-3xl border border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(31,41,55,0.08)]">
          <div className="mb-4 pb-4 border-b border-slate-100">
            <div className="font-extrabold text-slate-900 text-[15px]">Prerequisites</div>
            <div className="text-slate-500 text-xs mt-1">{prereqIds.length} total</div>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            {prereqIds.map((id) => (
              <div key={id} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-slate-100 bg-slate-50/70">
                <span className="font-mono text-xs text-slate-500">#{id}</span>
                <Link
                  to={`/admin/requirements/${id}`}
                  className="text-indigo-600 text-xs font-bold hover:text-indigo-800 transition-colors"
                >
                  view
                </Link>
                <button
                  type="button"
                  onClick={() => removePrereq(id)}
                  disabled={busy}
                  className="ml-auto px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold transition-all duration-200 hover:bg-rose-100 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  remove
                </button>
              </div>
            ))}

            {prereqIds.length === 0 && (
              <div className="text-slate-400 text-sm font-medium">None.</div>
            )}
          </div>

          <div className="flex flex-wrap gap-2.5">
            <input
              className="flex-1 min-w-[220px] px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
              type="number"
              placeholder="Prerequisite requirement id"
              value={addPrereqId}
              onChange={(e) => setAddPrereqId(e.target.value)}
            />
            <button
              type="button"
              onClick={addPrereq}
              disabled={busy || !addPrereqId}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white text-sm font-extrabold transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              Add prerequisite
            </button>
          </div>
        </section>

        {/* Assignments */}
        <section className="p-5 rounded-3xl border border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(31,41,55,0.08)]">
          <div className="mb-4 pb-4 border-b border-slate-100">
            <div className="font-extrabold text-slate-900 text-[15px]">Assigned to roles</div>
            <div className="text-slate-500 text-xs mt-1">{assignments.length} assignment(s)</div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-100 mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/70">
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Role</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Mandatory</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Priority override</th>
                  <th className="text-left font-bold text-slate-500 text-xs uppercase tracking-wide px-4 py-3">Due stage override</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>

              <tbody>
                {assignments.map((a) => (
                  <tr key={a.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-4 py-3 font-extrabold text-slate-800">{roleName(a.job_role_id)}</td>
                    <td className="px-4 py-3">
                      {a.is_mandatory ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-200 bg-emerald-50 text-emerald-600">
                          yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border border-slate-200 bg-slate-100 text-slate-500">
                          no
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{a.priority_override || "—"}</td>
                    <td className="px-4 py-3 text-slate-500">{a.due_stage_override || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => unassign(a.id)}
                        disabled={busy}
                        className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold transition-all duration-200 hover:bg-rose-100 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}

                {assignments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-400 font-medium">
                      Not assigned.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              className="flex-1 min-w-[200px] px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-150"
              value={assignRoleId}
              onChange={(e) => setAssignRoleId(e.target.value)}
            >
              <option value="">Select role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} {r.department ? `(${r.department})` : ""}
                </option>
              ))}
            </select>

            <label className="inline-flex items-center gap-2 text-slate-600 text-sm font-bold cursor-pointer whitespace-nowrap">
              <input
                type="checkbox"
                checked={assignMandatory}
                onChange={(e) => setAssignMandatory(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
              <span>Mandatory</span>
            </label>

            <button
              type="button"
              onClick={assign}
              disabled={busy || !assignRoleId}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white text-sm font-extrabold transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              Assign to role
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, wide, children }) {
  return (
    <label className={`flex flex-col gap-1.5 ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-slate-700 text-[13px] font-extrabold">{label}</span>
      {children}
    </label>
  );
}