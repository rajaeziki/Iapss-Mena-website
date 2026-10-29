"use client";
import { useState } from "react";
import SiteSection from "@/components/SiteSection";
import PartnerLogo, { domainOf } from "@/components/PartnerLogo";
import { useLang } from "@/components/Lang";
import { wrap, GLOBAL_PARTNERS, Eyebrow, PageHero } from "../shared";

export default function PartnershipsPage() {
  const { l } = useLang();
  const [q, setQ] = useState("");
  const filtered = GLOBAL_PARTNERS.filter(([n]) => n.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <>
      <PageHero
        eyebrow={l("Together", "معًا")}
        title={l("Our partnerships", "شراكاتنا")}
        lead={l("Organisations IAPSS MENA works with, and the wider IAPSS Global partner network.", "جهات يتعاون معها IAPSS MENA، وشبكة شركاء IAPSS Global الأوسع.")}
      />

      <section className={`${wrap} py-20`}>
        <Eyebrow>IAPSS MENA</Eyebrow>
        <h2 className="mb-8 mt-4 font-serif text-3xl font-medium text-brand md:text-4xl">{l("Partners of IAPSS MENA", "شركاء IAPSS MENA")}</h2>
        <SiteSection kind="partner" empty={l("Our partners will be listed here soon.", "سيتم عرض شركائنا هنا قريبًا.")} />
      </section>

      <section className="bg-white py-24">
        <div className={wrap}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>IAPSS Global</Eyebrow>
              <h2 className="mt-4 font-serif text-3xl font-medium text-brand md:text-4xl">{l("Partners of IAPSS Global", "شركاء IAPSS Global")}</h2>
            </div>
            <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} aria-label={l("Search partners", "ابحث في الشركاء")}
                placeholder={l("Search partners…", "ابحث في الشركاء…")}
                className="w-full rounded-full border border-brand/15 bg-paper px-5 py-3 text-sm outline-none transition focus:border-cyan focus:ring-4 focus:ring-cyan/15 sm:w-64" />
              <span className="whitespace-nowrap rounded-full bg-brand/5 px-4 py-3 text-xs font-bold text-brand" aria-live="polite">
                {q.trim() ? `${filtered.length} / ${GLOBAL_PARTNERS.length}` : GLOBAL_PARTNERS.length} {l("organisations", "جهة")}
              </span>
            </div>
          </div>
          <p className="mt-5 max-w-3xl rounded-2xl bg-paper px-5 py-4 text-sm leading-7 text-slate-600">{l(
            "Organizations listed on the official IAPSS Global partners page. These organizations are partners of IAPSS Global and are not automatically attributed to IAPSS MENA.",
            "الجهات المدرجة في صفحة شركاء IAPSS Global الرسمية. هذه الجهات شركاء لـ IAPSS Global ولا تُنسب تلقائيًا إلى IAPSS MENA."
          )}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map(([name, url]) => (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer" data-rv
                className="group flex items-center gap-4 rounded-2xl border border-brand/10 bg-paper p-4 transition duration-300 hover:-translate-y-1 hover:border-cyan hover:bg-white hover:shadow-[0_20px_50px_rgba(6,26,59,.12)]">
                <PartnerLogo domain={domainOf(url)} name={name} />
                <span className="min-w-0">
                  <strong className="block text-sm font-bold leading-snug text-brand">{name}</strong>
                  <small className="mt-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {name === "Yale University" ? l("Announced partnership", "شراكة معلنة") : l("IAPSS Global Partner", "شريك IAPSS Global")}
                  </small>
                </span>
              </a>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="mt-8 rounded-3xl border border-dashed border-brand/20 p-8 text-center text-slate-500">{l("No partner matches your search.", "لا توجد جهة مطابقة لبحثك.")}</p>
          )}
        </div>
      </section>
    </>
  );
}
