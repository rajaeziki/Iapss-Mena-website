"use client";
import { useEffect, useRef, useState } from "react";

type M = { role: "user" | "assistant"; content: string };

export default function Chatbot({ context = "public" }: { context?: "public" | "admin" }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<M[]>([
    { role: "assistant", content: "Hi! I'm the IAPSS assistant. Ask me about the World Congress, Model UN, Politikon or how to join." },
  ]);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { if (open) end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, open]);

  async function send(q: string) {
    if (!q.trim() || busy) return;
    const next: M[] = [...msgs, { role: "user", content: q }];
    setMsgs(next); setText(""); setBusy(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(1), context }),
      });
      const j = await r.json();
      setMsgs([...next, { role: "assistant", content: j.reply }]);
    } catch {
      setMsgs([...next, { role: "assistant", content: "Sorry, I couldn't reach the server. Try again." }]);
    }
    setBusy(false);
  }

  const chips = context === "admin"
    ? ["How do I create a task?", "How do groups work?"]
    : ["What is the World Congress?", "How do I join?"];

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[28rem] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-brand px-4 py-3 text-white">
            <div className="flex items-center gap-2 text-sm font-semibold"><span className="h-2 w-2 rounded-full bg-emerald-400" /> IAPSS Assistant</div>
            <button aria-label="Close" className="text-xl leading-none text-white/80 hover:text-white" onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex"}>
                <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 ${m.role === "user" ? "bg-brand text-white" : "bg-slate-100 text-slate-800"}`}>{m.content}</div>
              </div>
            ))}
            {busy && <div className="text-xs text-slate-400">Typing…</div>}
            {msgs.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {chips.map((c) => (
                  <button key={c} onClick={() => send(c)} className="rounded-full border border-slate-200 px-3 py-1 text-xs text-brand hover:bg-brand-50">{c}</button>
                ))}
              </div>
            )}
            <div ref={end} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="flex gap-2 border-t border-slate-100 p-3">
            <input className="input !py-2" placeholder="Ask something…" value={text} onChange={(e) => setText(e.target.value)} />
            <button className="btn btn-primary !px-3" aria-label="Send" disabled={busy}>Send</button>
          </form>
        </div>
      )}
      <button onClick={() => setOpen(!open)} aria-label="Open chatbot"
        className="fixed bottom-5 right-4 z-50 rounded-full bg-gradient-to-r from-brand to-[#3a4f8f] px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:scale-105">
        {open ? "Close" : "Ask IAPSS"}
      </button>
    </>
  );
}
