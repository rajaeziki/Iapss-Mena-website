"use client";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { SiteItem } from "@/lib/types";
import { Empty, PageHead } from "@/components/ui";

const KINDS = [
  { key: "team", label: "Team members", subtitle: "Role (e.g. Liaison Coordinator)", help: "People shown in the “Our team” section." },
  { key: "partner", label: "Partners", subtitle: "Type (e.g. University, NGO)", help: "Organisations shown in “Our partnerships”." },
  { key: "project", label: "Projects", subtitle: "Year (e.g. 2025)", help: "Past and current work shown in “Our projects”." },
] as const;

export default function ContentPage() {
  const { isAdmin } = useAuth();
  const [kind, setKind] = useState<SiteItem["kind"]>("team");
  const [items, setItems] = useState<SiteItem[]>([]);
  const [f, setF] = useState({ title: "", subtitle: "", description: "", link: "" });
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("site_items").select("*").order("sort").order("created_at");
    setItems((data ?? []) as SiteItem[]);
  }, []);
  useEffect(() => { load(); }, [load]);

  if (!isAdmin) return <p className="text-slate-500">Only super admins can edit the public site.</p>;
  const cfg = KINDS.find((k) => k.key === kind)!;
  const list = items.filter((i) => i.kind === kind);

  async function add(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    const { error } = await supabase.from("site_items").insert({
      kind, title: f.title.trim(), subtitle: f.subtitle.trim(), description: f.description.trim(),
      link: f.link.trim(), sort: list.length,
    });
    if (error) return setErr(error.message + " (did you run 002_approval_and_content.sql?)");
    setF({ title: "", subtitle: "", description: "", link: "" }); load();
  }
  async function remove(i: SiteItem) {
    if (!confirm(`Remove "${i.title}" from the public site?`)) return;
    await supabase.from("site_items").delete().eq("id", i.id); load();
  }

  return (
    <>
      <PageHead title="Site content" sub="What visitors see on the public IAPSS MENA page." />
      <div className="mb-5 flex w-fit gap-1 rounded-full bg-slate-200/70 p-1 text-sm font-medium">
        {KINDS.map((k) => (
          <button key={k.key} onClick={() => setKind(k.key)} className={`rounded-full px-5 py-1.5 transition ${kind === k.key ? "bg-white shadow-sm" : "text-slate-500"}`}>
            {k.label} <span className="text-slate-400">{items.filter((i) => i.kind === k.key).length}</span>
          </button>
        ))}
      </div>
      <p className="mb-4 text-sm text-slate-500">{cfg.help}</p>

      <form onSubmit={add} className="card mb-6 grid gap-3 md:grid-cols-2">
        <div><label className="label">{kind === "team" ? "Full name" : "Name"}</label><input className="input" required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
        <div><label className="label">{cfg.subtitle}</label><input className="input" value={f.subtitle} onChange={(e) => setF({ ...f, subtitle: e.target.value })} /></div>
        <div className="md:col-span-2"><label className="label">Description</label><textarea className="input min-h-[5rem]" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
        <div className="md:col-span-2"><label className="label">Link (optional)</label><input className="input" type="url" placeholder="https://…" value={f.link} onChange={(e) => setF({ ...f, link: e.target.value })} /></div>
        {err && <p className="text-sm text-rose-600 md:col-span-2">{err}</p>}
        <div className="md:col-span-2"><button className="btn btn-primary">Add to the site</button></div>
      </form>

      {list.length === 0 ? <Empty>Nothing added yet. Visitors will see “coming soon” in this section.</Empty> : (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((i) => (
            <div key={i.id} className="card flex items-start justify-between gap-3 !p-4">
              <div className="min-w-0">
                <div className="font-semibold">{i.title}</div>
                {i.subtitle && <div className="text-xs font-medium text-teal2">{i.subtitle}</div>}
                {i.description && <p className="mt-1 line-clamp-2 text-sm text-slate-500">{i.description}</p>}
              </div>
              <button onClick={() => remove(i)} className="text-xl leading-none text-slate-300 hover:text-rose-600" aria-label="Remove">×</button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
