"use client";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { VolunteerApplication, VolunteerRole } from "@/lib/types";
import { Empty, PageHead } from "@/components/ui";

const STATUS: VolunteerApplication["status"][] = ["new", "contacted", "accepted", "declined"];
const STATUS_STYLE: Record<VolunteerApplication["status"], string> = {
  new: "bg-amber-50 text-amber-700",
  contacted: "bg-blue-50 text-blue-700",
  accepted: "bg-emerald-50 text-emerald-700",
  declined: "bg-slate-100 text-slate-500",
};

export default function VolunteersPage() {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState<"applications" | "roles">("applications");
  const [apps, setApps] = useState<VolunteerApplication[]>([]);
  const [roles, setRoles] = useState<VolunteerRole[]>([]);
  const [filter, setFilter] = useState<"all" | VolunteerApplication["status"]>("all");
  const [open, setOpen] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [f, setF] = useState({ title: "", team: "", description: "", commitment: "", skills: "" });

  const load = useCallback(async () => {
    const [a, r] = await Promise.all([
      supabase.from("volunteer_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("volunteer_roles").select("*").order("sort").order("created_at"),
    ]);
    if (a.error || r.error) setErr((a.error ?? r.error)!.message + " (did you run 006_volunteering.sql?)");
    setApps((a.data ?? []) as VolunteerApplication[]);
    setRoles((r.data ?? []) as VolunteerRole[]);
  }, []);
  useEffect(() => { load(); }, [load]);

  if (!isAdmin) return <p className="text-slate-500">Only super admins can manage volunteers.</p>;

  const newCount = apps.filter((a) => a.status === "new").length;
  const list = apps.filter((a) => filter === "all" || a.status === filter);

  async function setStatus(id: string, status: VolunteerApplication["status"]) {
    await supabase.from("volunteer_applications").update({ status }).eq("id", id);
    load();
  }
  async function removeApp(a: VolunteerApplication) {
    if (!confirm(`Delete the application from ${a.full_name}? This cannot be undone.`)) return;
    await supabase.from("volunteer_applications").delete().eq("id", a.id);
    load();
  }
  async function addRole(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    const { error } = await supabase.from("volunteer_roles").insert({
      title: f.title.trim(), team: f.team.trim(), description: f.description.trim(),
      commitment: f.commitment.trim(), skills: f.skills.trim(), status: "open", sort: roles.length,
    });
    if (error) return setErr(error.message);
    setF({ title: "", team: "", description: "", commitment: "", skills: "" });
    load();
  }
  async function toggleRole(r: VolunteerRole) {
    await supabase.from("volunteer_roles").update({ status: r.status === "open" ? "closed" : "open" }).eq("id", r.id);
    load();
  }
  async function removeRole(r: VolunteerRole) {
    if (!confirm(`Delete the role "${r.title}"? Existing applications keep its name.`)) return;
    await supabase.from("volunteer_roles").delete().eq("id", r.id);
    load();
  }

  return (
    <>
      <PageHead title="Volunteers" sub="Publish the roles where you need help and review the applications." />
      {err && <p className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{err}</p>}

      <div className="mb-6 flex w-fit gap-1 rounded-full bg-slate-200/70 p-1 text-sm font-medium">
        <button onClick={() => setTab("applications")} className={`rounded-full px-5 py-1.5 transition ${tab === "applications" ? "bg-white shadow-sm" : "text-slate-500"}`}>
          Applications {newCount > 0 && <span className="ml-1 rounded-full bg-amber-500 px-2 py-0.5 text-[11px] font-semibold text-white">{newCount}</span>}
        </button>
        <button onClick={() => setTab("roles")} className={`rounded-full px-5 py-1.5 transition ${tab === "roles" ? "bg-white shadow-sm" : "text-slate-500"}`}>
          Roles <span className="text-slate-400">{roles.length}</span>
        </button>
      </div>

      {tab === "applications" && (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {(["all", ...STATUS] as const).map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition ${filter === s ? "bg-brand text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-brand"}`}>
                {s} {s !== "all" && <span className="opacity-60">{apps.filter((a) => a.status === s).length}</span>}
              </button>
            ))}
          </div>
          {list.length === 0 ? <Empty>No applications here yet.</Empty> : (
            <div className="space-y-3">
              {list.map((a) => (
                <article key={a.id} className="card !p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-brand">{a.full_name}</h3>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLE[a.status]}`}>{a.status}</span>
                      </div>
                      <a href={`mailto:${a.email}`} className="text-sm text-teal2 hover:underline">{a.email}</a>
                      <div className="mt-1 text-xs text-slate-500">
                        {a.role_title ? <>Role: <b className="text-slate-700">{a.role_title}</b></> : <b className="text-slate-700">Open application</b>}
                        {" · "}{new Date(a.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select className="input !w-auto !py-1.5 capitalize" value={a.status} onChange={(e) => setStatus(a.id, e.target.value as VolunteerApplication["status"])} aria-label="Status">
                        {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button onClick={() => setOpen(open === a.id ? null : a.id)} className="btn btn-ghost !px-4 !py-1.5">{open === a.id ? "Hide" : "Details"}</button>
                      <button onClick={() => removeApp(a)} className="text-xl leading-none text-slate-300 hover:text-rose-600" aria-label="Delete application">×</button>
                    </div>
                  </div>
                  {open === a.id && (
                    <div className="mt-4 grid gap-4 border-t border-slate-100 pt-4 text-sm md:grid-cols-2">
                      <dl className="space-y-2">
                        {[["Country", a.country], ["University / organization", a.university], ["Languages", a.languages], ["Availability", a.availability]].map(([k, v]) => (
                          <div key={k}><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{k}</dt><dd className="text-slate-700">{v || "Not given"}</dd></div>
                        ))}
                      </dl>
                      <div><div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Motivation</div><p className="mt-1 whitespace-pre-wrap leading-6 text-slate-700">{a.motivation}</p></div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "roles" && (
        <>
          <form onSubmit={addRole} className="card mb-6 grid gap-3 md:grid-cols-2">
            <div><label className="label">Role title</label><input className="input" required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
            <div><label className="label">Team (e.g. Media, Research, Events)</label><input className="input" value={f.team} onChange={(e) => setF({ ...f, team: e.target.value })} /></div>
            <div className="md:col-span-2"><label className="label">What the volunteer will do</label><textarea className="input min-h-[5rem]" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
            <div><label className="label">Time commitment</label><input className="input" placeholder="e.g. 3 hours per week" value={f.commitment} onChange={(e) => setF({ ...f, commitment: e.target.value })} /></div>
            <div><label className="label">Useful skills</label><input className="input" placeholder="e.g. Arabic and English writing" value={f.skills} onChange={(e) => setF({ ...f, skills: e.target.value })} /></div>
            <div className="md:col-span-2"><button className="btn btn-primary">Publish role</button></div>
          </form>
          {roles.length === 0 ? <Empty>No roles yet. Visitors will see an invitation to send an open application.</Empty> : (
            <div className="grid gap-3 md:grid-cols-2">
              {roles.map((r) => (
                <div key={r.id} className="card !p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold">{r.title}</div>
                      {r.team && <div className="text-xs font-medium text-teal2">{r.team}</div>}
                      {r.description && <p className="mt-1 line-clamp-2 text-sm text-slate-500">{r.description}</p>}
                    </div>
                    <button onClick={() => removeRole(r)} className="text-xl leading-none text-slate-300 hover:text-rose-600" aria-label="Delete role">×</button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${r.status === "open" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{r.status === "open" ? "Open" : "Closed"}</span>
                    <button onClick={() => toggleRole(r)} className="text-xs font-semibold text-brand hover:underline">{r.status === "open" ? "Close this role" : "Reopen"}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
