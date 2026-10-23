"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import type { Todo } from "@/lib/types";
import { Empty, PageHead, Progress } from "@/components/ui";

export default function TodoPage() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [due, setDue] = useState("");

  const load = async () => {
    const { data } = await supabase.from("todos").select("*").order("done").order("created_at", { ascending: false });
    setTodos((data ?? []) as Todo[]);
  };
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    await supabase.from("todos").insert({ user_id: user.id, text: text.trim(), due_date: due || null });
    setText(""); setDue(""); load();
  }
  const toggle = async (t: Todo) => { await supabase.from("todos").update({ done: !t.done }).eq("id", t.id); load(); };
  const remove = async (t: Todo) => { await supabase.from("todos").delete().eq("id", t.id); load(); };

  const done = todos.filter((t) => t.done).length;
  return (
    <div className="max-w-2xl">
      <PageHead title="My to-do list" sub="Private to you. Nobody else can see it." />
      <form onSubmit={add} className="card mb-5 flex flex-wrap gap-2 !p-3">
        <input className="input min-w-0 flex-1" placeholder="Add a to-do…" value={text} onChange={(e) => setText(e.target.value)} />
        <input className="input !w-40" type="date" value={due} onChange={(e) => setDue(e.target.value)} aria-label="Due date" />
        <button className="btn btn-primary">Add</button>
      </form>
      {todos.length > 0 && (
        <div className="mb-5">
          <div className="mb-1 text-xs text-slate-500">{done} of {todos.length} done</div>
          <Progress value={Math.round((done / todos.length) * 100)} />
        </div>
      )}
      {todos.length === 0 ? <Empty>Nothing here yet. Add your first to-do above.</Empty> : (
        <ul className="space-y-2">
          {todos.map((t) => (
            <li key={t.id} className="card flex items-center gap-3 !p-3.5">
              <input type="checkbox" className="h-5 w-5 accent-[#061a3b]" checked={t.done} onChange={() => toggle(t)} aria-label="Done" />
              <div className="min-w-0 flex-1">
                <div className={`text-sm ${t.done ? "text-slate-400 line-through" : "font-medium"}`}>{t.text}</div>
                {t.due_date && <div className="text-xs text-slate-400">Due {t.due_date}</div>}
              </div>
              <button onClick={() => remove(t)} className="text-xl leading-none text-slate-400 hover:text-rose-600" aria-label="Delete">×</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
