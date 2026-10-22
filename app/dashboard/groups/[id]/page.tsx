"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useWorkspace, pct } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import type { Priority, Status, Task } from "@/lib/types";
import Kanban from "@/components/Kanban";
import ChatBox from "@/components/ChatBox";
import { groupGradient } from "@/components/ui";

export default function GroupPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isAdmin } = useAuth();
  const ws = useWorkspace();
  const group = ws.groups.find((g) => g.id === id);
  const memberIds = ws.members.filter((m) => m.group_id === id).map((m) => m.user_id);
  const memberProfiles = ws.profiles.filter((p) => memberIds.includes(p.id));
  const canManage = isAdmin || group?.leader_id === user.id;

  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => { setTasks(ws.tasks.filter((t) => t.group_id === id)); }, [ws.tasks, id]);

  const [tab, setTab] = useState<"board" | "chat" | "members">("board");
  const [form, setForm] = useState(false);
  const [t, setT] = useState({ title: "", description: "", assignee: "", priority: "medium" as Priority, due: "" });
  const [err, setErr] = useState("");
  const [addUser, setAddUser] = useState("");

  if (ws.loading) return <p className="text-slate-500">Loading…</p>;
  if (!group) return <p className="text-slate-500">Group not found, or you don&apos;t have access.</p>;

  async function createTask(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    const { error } = await supabase.from("tasks").insert({
      group_id: id, title: t.title.trim(), description: t.description.trim(),
      assignee_id: t.assignee || null, priority: t.priority, due_date: t.due || null, created_by: user.id,
    });
    if (error) return setErr(error.message);
    setT({ title: "", description: "", assignee: "", priority: "medium", due: "" }); setForm(false); ws.reload();
  }

  const setLeader = async (uid: string) => { await supabase.from("groups").update({ leader_id: uid || null }).eq("id", id); ws.reload(); };
  const addMember = async () => { if (!addUser) return; await supabase.from("group_members").insert({ group_id: id, user_id: addUser }); setAddUser(""); ws.reload(); };
  const removeMember = async (uid: string) => {
    if (uid === group.leader_id) return alert("Change the leader before removing them.");
    await supabase.from("group_members").delete().eq("group_id", id).eq("user_id", uid); ws.reload();
  };
  const deleteGroup = async () => {
    if (!confirm(`Delete group "${group.name}" and all its tasks and messages?`)) return;
    await supabase.from("groups").delete().eq("id", id);
    location.href = "/dashboard/groups";
  };
  const optimistic = (tid: string, status: Status) => setTasks((cur) => cur.map((x) => (x.id === tid ? { ...x, status } : x)));

  return (
    <>
      <Link href="/dashboard/groups" className="mb-3 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand"><span aria-hidden>←</span> Groups</Link>
      <div className={`relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br ${groupGradient(group.name)} p-7 text-white shadow-soft md:p-9`}>
        <div className="dot-grid-light absolute inset-0 opacity-60" />
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">{group.name}</h1>
            {group.description && <p className="mt-1.5 max-w-xl text-sm text-white/80">{group.description}</p>}
            <div className="mt-4 inline-flex rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-medium backdrop-blur">Leader · {ws.name(group.leader_id)}</div>
          </div>
          <div className="w-60">
            <div className="mb-1.5 flex justify-between text-xs text-white/80"><span>Progress</span><span>{pct(tasks)}%</span></div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/25"><div className="h-full rounded-full bg-white transition-all duration-700" style={{ width: `${pct(tasks)}%` }} /></div>
          </div>
        </div>
      </div>

      <div className="mb-5 flex gap-1 rounded-full bg-slate-200/70 p-1 text-sm font-medium md:w-fit">
        {(["board", "chat", "members"] as const).map((k) => (
          <button key={k} onClick={() => setTab(k)} className={`rounded-full px-5 py-1.5 capitalize transition ${tab === k ? "bg-white shadow-sm" : "text-slate-500"}`}>
            {k === "board" ? "Task board" : k}
          </button>
        ))}
      </div>

      {tab === "board" && (
        <>
          {canManage && (
            <div className="mb-4">
              <button className="btn btn-primary" onClick={() => setForm(!form)}>+ New task</button>
            </div>
          )}
          {form && (
            <form onSubmit={createTask} className="card mb-5 grid gap-3 md:grid-cols-4">
              <div className="md:col-span-2"><label className="label">Title</label><input className="input" required value={t.title} onChange={(e) => setT({ ...t, title: e.target.value })} /></div>
              <div>
                <label className="label">Assign to</label>
                <select className="input" value={t.assignee} onChange={(e) => setT({ ...t, assignee: e.target.value })}>
                  <option value="">Unassigned</option>
                  {memberProfiles.map((p) => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Priority</label>
                <select className="input" value={t.priority} onChange={(e) => setT({ ...t, priority: e.target.value as Priority })}>
                  <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                </select>
              </div>
              <div className="md:col-span-3"><label className="label">Description</label><input className="input" value={t.description} onChange={(e) => setT({ ...t, description: e.target.value })} /></div>
              <div><label className="label">Due date</label><input type="date" className="input" value={t.due} onChange={(e) => setT({ ...t, due: e.target.value })} /></div>
              {err && <p className="text-sm text-rose-600 md:col-span-4">{err}</p>}
              <div className="md:col-span-4"><button className="btn btn-primary">Create task</button></div>
            </form>
          )}
          <Kanban tasks={tasks} profiles={ws.profiles} userId={user.id} canManage={canManage} onChange={ws.reload} onOptimistic={optimistic} />
        </>
      )}

      {tab === "chat" && <ChatBox groupId={id} profiles={ws.profiles} className="h-[60vh]" />}

      {tab === "members" && (
        <div className="card max-w-2xl">
          <ul className="divide-y divide-slate-100">
            {memberProfiles.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2.5 text-sm">
                <span><b>{p.full_name}</b> <span className="text-slate-400">{p.email}</span> {p.id === group.leader_id && <span className="ml-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">Leader</span>}</span>
                {canManage && <button onClick={() => removeMember(p.id)} className="text-xl leading-none text-slate-400 hover:text-rose-600" aria-label="Remove">×</button>}
              </li>
            ))}
            {memberProfiles.length === 0 && <li className="py-3 text-sm text-slate-500">No members yet.</li>}
          </ul>
          {canManage && (
            <div className="mt-4 flex gap-2">
              <select className="input" value={addUser} onChange={(e) => setAddUser(e.target.value)}>
                <option value="">Add a member…</option>
                {ws.profiles.filter((p) => !memberIds.includes(p.id)).map((p) => <option key={p.id} value={p.id}>{p.full_name} ({p.email})</option>)}
              </select>
              <button className="btn btn-primary" onClick={addMember}>Add</button>
            </div>
          )}
          {isAdmin && (
            <div className="mt-6 border-t border-slate-100 pt-4">
              <label className="label">Group leader</label>
              <select className="input" value={group.leader_id ?? ""} onChange={(e) => setLeader(e.target.value)}>
                <option value="">No leader</option>
                {ws.profiles.map((p) => <option key={p.id} value={p.id}>{p.full_name}</option>)}
              </select>
              <button onClick={deleteGroup} className="mt-6 text-sm font-medium text-rose-600 hover:underline">Delete this group</button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
