"use client";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useWorkspace, pct } from "@/lib/data";
import { isOverdue, STATUSES } from "@/lib/types";
import { Empty, Progress, Stat } from "@/components/ui";

export default function Overview() {
  const { user, profile, isAdmin } = useAuth();
  const { groups, tasks, loading, name } = useWorkspace();
  if (loading) return <p className="text-slate-500">Loading…</p>;

  const mine = tasks.filter((t) => t.assignee_id === user.id && t.status !== "done");
  const overdue = tasks.filter(isOverdue);

  return (
    <>
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-[#0a2a57] to-teal2 p-8 text-white shadow-soft md:p-10">
        <div className="dot-grid-light absolute inset-0 opacity-60" />
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-24 right-24 h-56 w-56 rounded-full bg-teal-300/20 blur-2xl" />
        <div className="relative">
          <div className="text-xs font-semibold uppercase tracking-[.2em] text-white/60">{new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}</div>
          <h1 className="mt-2 text-4xl font-bold md:text-5xl">Hello, {profile.full_name.split(" ")[0]}</h1>
          <p className="mt-2 max-w-md text-white/75">{isAdmin ? "Here is how every group is doing." : "Here is what's on your plate."}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-white/15 px-4 py-1.5 backdrop-blur">{mine.length} task{mine.length === 1 ? "" : "s"} for you</span>
            <span className="rounded-full bg-white/15 px-4 py-1.5 backdrop-blur">{overdue.length} overdue</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Groups" value={groups.length} accent="brand" />
        <Stat label="Open tasks" value={tasks.filter((t) => t.status !== "done").length} accent="teal" tone="text-teal2" />
        <Stat label="Completed" value={`${pct(tasks)}%`} tone="text-emerald-600" accent="green" />
        <Stat label="Overdue" value={overdue.length} tone={overdue.length ? "text-rose-600" : "text-slate-400"} accent={overdue.length ? "rose" : "slate"} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-xl font-bold">Progress by group</h2>
          {groups.length === 0 ? (
            <Empty>{isAdmin ? <>No groups yet. <Link className="font-semibold text-brand" href="/dashboard/groups">Create the first one</Link>.</> : "You haven't been added to a group yet."}</Empty>
          ) : (
            <div className="space-y-3">
              {groups.map((g) => {
                const gt = tasks.filter((t) => t.group_id === g.id);
                return (
                  <Link key={g.id} href={`/dashboard/groups/${g.id}`} className="card block transition hover:shadow-soft">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-semibold">{g.name}</span>
                      <span className="text-slate-500">{gt.filter((t) => t.status === "done").length}/{gt.length} done</span>
                    </div>
                    <Progress value={pct(gt)} />
                    <div className="mt-2 text-xs text-slate-500">Leader: {name(g.leader_id)}</div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold">My open tasks</h2>
          {mine.length === 0 ? (
            <Empty>Nothing assigned to you right now.</Empty>
          ) : (
            <div className="space-y-2">
              {mine.slice(0, 8).map((t) => (
                <Link key={t.id} href={`/dashboard/groups/${t.group_id}`} className="card flex items-center justify-between !p-4 transition hover:shadow-soft">
                  <div>
                    <div className="text-sm font-semibold">{t.title}</div>
                    <div className="text-xs text-slate-500">{groups.find((g) => g.id === t.group_id)?.name}{t.due_date ? ` · due ${t.due_date}` : ""}</div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${isOverdue(t) ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-600"}`}>
                    {isOverdue(t) ? "Overdue" : STATUSES.find((s) => s.key === t.status)?.label}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
