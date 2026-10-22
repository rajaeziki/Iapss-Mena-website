"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { isOverdue, PRIORITY_STYLE, STATUSES, type Profile, type Status, type Task } from "@/lib/types";

type Props = {
  tasks: Task[];
  profiles: Profile[];
  userId: string;
  canManage: boolean;      // admin or group leader
  onChange: () => void;
  onOptimistic: (id: string, status: Status) => void;
};

export default function Kanban({ tasks, profiles, userId, canManage, onChange, onOptimistic }: Props) {
  const [over, setOver] = useState<Status | null>(null);
  const who = (id: string | null) => profiles.find((p) => p.id === id)?.full_name ?? "Unassigned";
  const canMove = (t: Task) => canManage || t.assignee_id === userId;

  async function move(t: Task, status: Status) {
    if (t.status === status || !canMove(t)) return;
    onOptimistic(t.id, status);
    const { error } = await supabase.from("tasks").update({ status }).eq("id", t.id);
    if (error) onChange(); // roll back to server state
  }
  async function remove(t: Task) {
    if (!confirm(`Delete "${t.title}"?`)) return;
    await supabase.from("tasks").delete().eq("id", t.id);
    onChange();
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {STATUSES.map((col) => {
        const items = tasks.filter((t) => t.status === col.key);
        return (
          <div key={col.key}
            onDragOver={(e) => { e.preventDefault(); setOver(col.key); }}
            onDragLeave={() => setOver(null)}
            onDrop={(e) => {
              e.preventDefault(); setOver(null);
              const t = tasks.find((x) => x.id === e.dataTransfer.getData("text/plain"));
              if (t) move(t, col.key);
            }}
            className={`rounded-2xl bg-slate-100/70 p-3 transition ${over === col.key ? "ring-2 ring-brand-500" : ""}`}>
            <div className="mb-3 flex items-center gap-2 px-1 text-sm font-semibold">
              <span className={`h-2.5 w-2.5 rounded-full ${col.dot}`} /> {col.label}
              <span className="ml-auto rounded-full bg-white px-2 text-xs text-slate-500">{items.length}</span>
            </div>
            <div className="min-h-[3rem] space-y-2">
              {items.map((t) => (
                <article key={t.id} draggable={canMove(t)}
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", t.id)}
                  className={`rounded-xl border border-slate-200 bg-white p-3 shadow-sm ${canMove(t) ? "cursor-grab active:cursor-grabbing" : ""}`}>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold leading-snug">{t.title}</h4>
                    {canManage && <button onClick={() => remove(t)} className="text-lg leading-none text-slate-300 hover:text-rose-600" aria-label="Delete task">×</button>}
                  </div>
                  {t.description && <p className="mt-1 line-clamp-2 text-xs text-slate-500">{t.description}</p>}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className={`rounded-full px-2 py-0.5 font-medium capitalize ${PRIORITY_STYLE[t.priority]}`}>{t.priority}</span>
                    {t.due_date && (
                      <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 ${isOverdue(t) ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-600"}`}>
                        Due {t.due_date}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-xs text-slate-600">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-brand text-[10px] text-white">{who(t.assignee_id)[0]}</span>
                      {who(t.assignee_id)}
                    </span>
                    {canMove(t) && (
                      <select value={t.status} onChange={(e) => move(t, e.target.value as Status)}
                        className="rounded-lg border border-slate-200 bg-white px-1.5 py-1 text-[11px]" aria-label="Move task">
                        {STATUSES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                      </select>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
