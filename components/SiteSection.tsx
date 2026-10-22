"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { SiteItem } from "@/lib/types";

const initials = (s: string) => s.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

/** Shows admin-managed items (team / partner / project) on the public page. */
export default function SiteSection({ kind, empty }: { kind: SiteItem["kind"]; empty: string }) {
  const [items, setItems] = useState<SiteItem[] | null>(null);

  useEffect(() => {
    supabase.from("site_items").select("*").eq("kind", kind).order("sort").order("created_at")
      .then(({ data }) => setItems((data ?? []) as SiteItem[]));
  }, [kind]);

  if (items === null) return <div className="h-32 animate-pulse rounded-3xl bg-slate-100" />;
  if (items.length === 0)
    return <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-slate-500">{empty}</div>;

  const wrap = (i: SiteItem, children: React.ReactNode, cls: string) =>
    i.link ? (
      <a key={i.id} href={i.link} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>
    ) : (
      <article key={i.id} className={cls}>{children}</article>
    );

  if (kind === "team")
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) =>
          wrap(i, (
            <>
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand to-teal2 font-serif text-xl font-bold text-white">{initials(i.title)}</div>
              <h3 className="mt-4 text-lg font-bold text-brand">{i.title}</h3>
              {i.subtitle && <div className="text-sm font-medium text-teal2">{i.subtitle}</div>}
              {i.description && <p className="mt-2 text-sm text-slate-600">{i.description}</p>}
            </>
          ), "block rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl"))}
      </div>
    );

  if (kind === "partner")
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) =>
          wrap(i, (
            <>
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">{i.subtitle || "Partner"}</div>
              <h3 className="mt-2 text-xl font-bold text-brand">{i.title}</h3>
              {i.description && <p className="mt-2 text-sm text-slate-600">{i.description}</p>}
            </>
          ), "block rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-brand-50 p-6 transition hover:-translate-y-1 hover:shadow-xl"))}
      </div>
    );

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((i, n) =>
        wrap(i, (
          <>
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-4xl font-bold text-teal2">0{n + 1}</span>
              {i.subtitle && <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand">{i.subtitle}</span>}
            </div>
            <h3 className="mt-3 text-xl font-bold text-brand">{i.title}</h3>
            {i.description && <p className="mt-2 text-sm text-slate-600">{i.description}</p>}
          </>
        ), "block rounded-3xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl"))}
    </div>
  );
}
