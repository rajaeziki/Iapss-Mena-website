"use client";
import Link from "next/link";
import SiteSection from "@/components/SiteSection";
import { useLang } from "@/components/Lang";
import { wrap, btnPrimary, btnGhost, PageHero } from "../shared";

export default function NewsPage() {
  const { l } = useLang();
  return (
    <>
      <PageHero
        eyebrow={l("Updates", "المستجدات")}
        title={l("News", "الأخبار")}
        lead={l("News and institutional updates from the regional chapter.", "أخبار الفرع الإقليمي وتحديثاته المؤسسية.")}
      />
      <section className={`${wrap} py-20`}>
        <SiteSection kind="news" empty={
          <div className="rounded-[2rem] border border-dashed border-brand/20 bg-white p-10 text-center">
            <p className="mx-auto max-w-xl text-slate-600">{l(
              "No news articles have been published yet. Explore current programs and events or visit our publications.",
              "لا توجد أخبار منشورة حاليًا. يمكنك الاطلاع على البرامج والفعاليات الحالية أو زيارة مساحة المنشورات."
            )}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/programs" className={btnPrimary}>{l("Programs & events", "البرامج والفعاليات")}</Link>
              <Link href="/programs#publications" className={btnGhost}>{l("Publications", "المنشورات")}</Link>
            </div>
          </div>
        } />
      </section>
    </>
  );
}
