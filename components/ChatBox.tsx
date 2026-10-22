"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import type { Message, Profile } from "@/lib/types";

/** Live chat for one channel. groupId = null is the General channel. */
export default function ChatBox({ groupId, profiles, className = "" }: { groupId: string | null; profiles: Profile[]; className?: string }) {
  const { user } = useAuth();
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    setMsgs([]);
    const q = supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(100);
    (groupId ? q.eq("group_id", groupId) : q.is("group_id", null)).then(({ data }) => {
      if (alive) setMsgs(((data ?? []) as Message[]).reverse());
    });
    const ch = supabase
      .channel("chat-" + (groupId ?? "general") + "-" + Math.random().toString(36).slice(2))
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (p) => {
        const m = p.new as Message;
        if ((m.group_id ?? null) !== groupId) return;
        setMsgs((cur) => (cur.some((x) => x.id === m.id) ? cur : [...cur, m]));
      })
      .subscribe();
    return () => { alive = false; supabase.removeChannel(ch); };
  }, [groupId]);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;
    setText(""); setErr("");
    const { data, error } = await supabase
      .from("messages").insert({ group_id: groupId, sender_id: user.id, content }).select().single();
    if (error) { setErr(error.message); setText(content); }
    else if (data) setMsgs((cur) => (cur.some((x) => x.id === data.id) ? cur : [...cur, data as Message]));
  }

  const who = (id: string) => profiles.find((p) => p.id === id)?.full_name ?? "Member";
  const time = (s: string) => new Date(s).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white ${className}`}>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {msgs.length === 0 && <p className="py-10 text-center text-sm text-slate-400">No messages yet. Say hello 👋</p>}
        {msgs.map((m) => {
          const mine = m.sender_id === user.id;
          return (
            <div key={m.id} className={mine ? "flex justify-end" : "flex"}>
              <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${mine ? "bg-brand text-white" : "bg-slate-100"}`}>
                {!mine && <div className="mb-0.5 text-xs font-semibold text-teal2">{who(m.sender_id)}</div>}
                <div className="whitespace-pre-wrap break-words">{m.content}</div>
                <div className={`mt-0.5 text-right text-[10px] ${mine ? "text-white/60" : "text-slate-400"}`}>{time(m.created_at)}</div>
              </div>
            </div>
          );
        })}
        <div ref={bottom} />
      </div>
      {err && <p className="px-4 pb-1 text-xs text-rose-600">{err}</p>}
      <form onSubmit={send} className="flex gap-2 border-t border-slate-100 p-3">
        <input className="input" placeholder="Write a message…" value={text} onChange={(e) => setText(e.target.value)} maxLength={4000} />
        <button className="btn btn-primary !px-4" aria-label="Send">Send</button>
      </form>
    </div>
  );
}
