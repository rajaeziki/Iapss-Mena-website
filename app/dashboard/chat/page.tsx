"use client";
import { useState } from "react";
import { useWorkspace } from "@/lib/data";
import ChatBox from "@/components/ChatBox";
import { PageHead } from "@/components/ui";

export default function ChatPage() {
  const { groups, profiles } = useWorkspace();
  const [channel, setChannel] = useState<string | null>(null);
  const label = channel ? groups.find((g) => g.id === channel)?.name : "General";

  return (
    <>
      <PageHead title="Chat" sub="Messages appear instantly for everyone in the channel." />
      <div className="grid gap-4 md:grid-cols-[14rem_1fr]">
        <div className="card h-fit !p-2">
          {[{ id: null as string | null, name: "General" }, ...groups.map((g) => ({ id: g.id as string | null, name: g.name }))].map((c) => (
            <button key={c.id ?? "general"} onClick={() => setChannel(c.id)}
              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium ${channel === c.id ? "bg-brand text-white" : "text-slate-600 hover:bg-slate-100"}`}>
              <span className="opacity-50">#</span> <span className="truncate">{c.name}</span>
            </button>
          ))}
        </div>
        <div>
          <div className="mb-2 text-sm font-semibold text-slate-600"># {label}</div>
          <ChatBox groupId={channel} profiles={profiles} className="h-[60vh]" />
        </div>
      </div>
    </>
  );
}
