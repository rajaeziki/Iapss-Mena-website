"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useWorkspace, pct } from "@/lib/data";
import { isOverdue, PRIORITY_STYLE, STATUSES } from "@/lib/types";
import { Empty, PageHead, Progress, Stat } from "@/components/ui";

export default function TasksPage() {
  const { user } = useAuth();
  const { tasks, groups, profiles, loading, name } = useWorkspace();
  const [status, setStatus] = useState("");
  const [group, setGroup] = useState("");
  const [mine, setMine] = useState(false);

  if (loading) return <p className="text-slate-500">Loading…</p>;

  const list = tasks.filter((t) =>
    (!status || (status === "overdue" ? isOverdue(t) : t.status === status)) &&
    (!group || t.group_id === group) && (!mine || t.assignee_id === user.id));

  // workload per person: open vs done
  const workload = profiles
    .map((p) => {
      const pt = tasks.filter((t) => t.assignee_id === p.id);
      return { p, total: pt.length, done: pt.filter((t) => t.status === "done").length, pct: pct(pt) };
    })
    .filter((w) => w.total > 0);

  return (
    <>
      <PageHead title="Task tracking" sub="Every task you can see, with live status." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATUSES.map((s, i) => <Stat key={s.key} label={s.label} value={tasks.filter((t) => t.status === s.key).length} accent={(["slate", "brand", "teal", "green"] as const)[i]} />)}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <select className="input !w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          <option value="overdue">Overdue</option>
        </select>
        <select className="input !w-auto" value={group} onChange={(e) => setGroup(e.target.value)}>
          <option value="">All groups</option>
          {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm">
          <input type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} /> Only mine
        </label>
      </div>

      <div className="mt-4 grid gap-6 xl:grid-cols-[1fr_20rem]">
        <div className="card overflow-x-auto !p-0">
          {list.length === 0 ? <div className="p-6"><Empty>No tasks match.</Empty></div> : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="p-3">Task</th><th className="p-3">Group</th><th className="p-3">Assignee</th><th className="p-3">Priority</th><th className="p-3">Due</th><th className="p-3">Status</th></tr>
              </thead>
              <tbody>
                {list.map((t) => {
                  const st = STATUSES.find((s) => s.key === t.status)!;
                  return (
                    <tr key={t.id} className="border-t border-slate-100">
                      <td className="p-3 font-medium">{t.title}</td>
                      <td className="p-3"><Link className="text-brand hover:underline" href={`/dashboard/groups/${t.group_id}`}>{groups.find((g) => g.id === t.group_id)?.name}</Link></td>
                      <td className="p-3 text-slate-600">{name(t.assignee_id)}</td>
                      <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${PRIORITY_STYLE[t.priority]}`}>{t.priority}</span></td>
                      <td className={`p-3 ${isOverdue(t) ? "font-semibold text-rose-600" : "text-slate-500"}`}>{t.due_date ?? "No date"}</td>
                      <td className="p-3"><span className="flex items-center gap-1.5"><span className={`h-2 w-2 rounded-full ${st.dot}`} />{st.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <aside className="card h-fit">
          <h3 className="mb-3 text-lg font-bold">Workload by person</h3>
          {workload.length === 0 ? <p className="text-sm text-slate-500">No assigned tasks yet.</p> : (
            <div className="space-y-4">
              {workload.map((w) => (
                <div key={w.p.id}>
                  <div className="mb-1 flex justify-between text-sm"><span className="font-medium">{w.p.full_name}</span><span className="text-slate-500">{w.done}/{w.total}</span></div>
                  <Progress value={w.pct} />
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
