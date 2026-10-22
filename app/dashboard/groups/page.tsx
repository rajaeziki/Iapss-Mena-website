"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useWorkspace, pct } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { Empty, PageHead, Progress, groupGradient } from "@/components/ui";

export default function Groups() {
  const { isAdmin, user } = useAuth();
  const { groups, members, tasks, profiles, loading, reload, name } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [gname, setGname] = useState("");
  const [desc, setDesc] = useState("");
  const [leader, setLeader] = useState("");
  const [err, setErr] = useState("");

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const { error } = await supabase.from("groups").insert({ name: gname.trim(), description: desc.trim(), leader_id: leader || null });
    if (error) return setErr(error.message);
    setGname(""); setDesc(""); setLeader(""); setOpen(false); reload();
  }

  return (
    <>
      <PageHead title="Groups" sub="Each group has one leader, its members and its own tasks.">
        {isAdmin && <button className="btn btn-primary" onClick={() => setOpen(!open)}>+ New group</button>}
      </PageHead>

      {open && (
        <form onSubmit={create} className="card mb-6 grid gap-3 md:grid-cols-2">
          <div><label className="label">Name</label><input className="input" required value={gname} onChange={(e) => setGname(e.target.value)} /></div>
          <div>
            <label className="label">Leader (optional, can be set later)</label>
            <select className="input" value={leader} onChange={(e) => setLeader(e.target.value)}>
              <option value="">— none —</option>
              {profiles.map((p) => <option key={p.id} value={p.id}>{p.full_name}</option>)}
            </select>
          </div>
          <div className="md:col-span-2"><label className="label">Description</label><input className="input" value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
          {err && <p className="text-sm text-rose-600 md:col-span-2">{err}</p>}
          <div className="md:col-span-2"><button className="btn btn-primary">Create group</button></div>
        </form>
      )}

      {loading ? <p className="text-slate-500">Loading…</p> : groups.length === 0 ? (
        <Empty>{isAdmin ? "No groups yet. Create the first one." : "You haven't been added to a group yet."}</Empty>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((g) => {
            const gt = tasks.filter((t) => t.group_id === g.id);
            const n = members.filter((m) => m.group_id === g.id).length;
            return (
              <Link key={g.id} href={`/dashboard/groups/${g.id}`} className="card group block overflow-hidden !p-0 transition hover:-translate-y-1 hover:shadow-soft">
                <div className={`relative h-20 bg-gradient-to-br ${groupGradient(g.name)}`}>
                  <div className="dot-grid-light absolute inset-0 opacity-70" />
                  <span className="absolute bottom-3 left-5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">{n} member{n === 1 ? "" : "s"}</span>
                </div>
                <div className="p-5">
                <h3 className="text-xl font-bold text-brand">{g.name}</h3>
                <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm text-slate-500">{g.description || "No description"}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-slate-600">
                  <span>Leader: <b className="text-slate-800">{name(g.leader_id)}{g.leader_id === user.id ? " (you)" : ""}</b></span>
                </div>
                <div className="mt-4"><Progress value={pct(gt)} /></div>
                <div className="mt-1 text-xs text-slate-500">{gt.filter((t) => t.status === "done").length} of {gt.length} tasks done</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
