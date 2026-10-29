"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/components/Lang";

export const CONTACT = "pr.mena@iapss.org";
export const mail = (subject: string) => `mailto:${CONTACT}?subject=${encodeURIComponent(subject)}`;

export const wrap = "mx-auto max-w-[1280px] px-5 md:px-8";
export const h2cls = "mt-5 max-w-3xl font-serif text-[clamp(2.2rem,4.6vw,3.9rem)] font-medium leading-[1.06] text-brand";
export const btnPrimary = "rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-500 hover:shadow-[0_14px_30px_rgba(6,26,59,.25)]";
export const btnGhost = "rounded-full border border-brand/20 bg-white/60 px-7 py-3.5 text-sm font-bold text-brand backdrop-blur transition hover:-translate-y-0.5 hover:border-brand hover:bg-white";
export const btnCyan = "rounded-full bg-cyan px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-teal2 hover:shadow-[0_14px_30px_rgba(0,174,180,.35)]";
export const btnLight = "rounded-full bg-white px-7 py-3.5 text-sm font-bold text-brand transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(0,0,0,.25)]";
export const btnOutlineLight = "rounded-full border border-white/40 px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10";

// [english, arabic] pairs, taken from the official IAPSS MENA site
export const RESEARCH_AREAS: [string, string][] = [
  ["Governance and political reform", "الحوكمة والإصلاح السياسي"],
  ["Elections and political participation", "الانتخابات والمشاركة السياسية"],
  ["Political institutions", "المؤسسات السياسية"],
  ["Political economy", "الاقتصاد السياسي"],
  ["Youth and politics", "الشباب والسياسة"],
  ["Leadership and populism", "القيادة والشعبوية"],
  ["Public policy", "السياسات العامة"],
  ["Political communication and media", "الاتصال السياسي والإعلام"],
  ["Digital governance and technology", "الحوكمة الرقمية والتكنولوجيا"],
  ["Climate crisis", "أزمة المناخ"],
  ["Regional conflicts and resource security", "النزاعات الإقليمية وأمن الموارد"],
  ["Grassroots movements and civil society", "الحركات الشعبية والمجتمع المدني"],
  ["Democratization and democratic backsliding", "التحول الديمقراطي والتراجع الديمقراطي"],
  ["Evaluation and AI policy", "التقييم وسياسة الذكاء الاصطناعي"],
];

// Listed on the official IAPSS Global partners page (with the website each one links to). NOT IAPSS MENA partners.
export const GLOBAL_PARTNERS: [string, string][] = [
  ["Advent Group", "https://accessmba.com/"],
  ["ASEAN Youth Organization", "https://aseanyouth.net/"],
  ["Asia-Europe Foundation (ASEF)", "https://asef.org/"],
  ["Asian Law Students’ Association", "https://alsainternational.org/"],
  ["Circle of Sustainable Europe", "https://sustainableeurope.eu/"],
  ["Concordia University", "https://concordia.ca/"],
  ["Disability Unite", "https://disabilityunite.org/"],
  ["European Academy of Diplomacy", "https://diplomacy.pl/"],
  ["European Student Think Tank", "https://esthinktank.com/"],
  ["European Horizons", "https://europeanhorizons.org/"],
  ["Global Campus of Human Rights", "https://gchumanrights.org/"],
  ["Global Policy Insights", "https://globalpolicyinsights.org/"],
  ["International Political Science Association (IPSA)", "https://ipsa.org/"],
  ["International Studies Association (ISA)", "https://isanet.org/"],
  ["Instats", "https://instats.org/"],
  ["JASON Institute for Peace and Security Studies", "https://jasoninstitute.com/"],
  ["Leading Women of Tomorrow", "https://leadingwomenoftomorrow.com/"],
  ["North-West University", "https://nwu.ac.za/"],
  ["POLITICO EU Studies & Career Fair", "https://politico.eu/"],
  ["Student Think-Tank for Europe-Asia Relations", "https://stear.org/"],
  ["The SDG Accord", "https://sdgaccord.org/"],
  ["The Young Diplomat", "https://theyoungdiplomat.com/"],
  ["UNESCO", "https://unesco.org/"],
  ["Voters Without Borders", "https://voterswithoutborders.eu/"],
  ["Yale University", "https://www.yale.edu/"],
];

/** Number that counts up once when scrolled into view. */
export function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(to); return; }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - t0) / 1400, 1);
        setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{v.toLocaleString("en-US")}{suffix}</span>;
}

/** Headline whose words rise in one after another. */
export function Words({ text, start = 0 }: { text: string; start?: number }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i}>
          <span className="word" style={{ animationDelay: `${(start + i) * 90 + 150}ms` }}>{w}</span>{" "}
        </span>
      ))}
    </>
  );
}

export function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[.16em] ${dark ? "bg-white/10 text-sky" : "bg-brand/5 text-teal2"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dark ? "bg-sky" : "bg-cyan"}`} /> {children}
    </p>
  );
}

/** Compact dark banner at the top of every inner page. */
export function PageHero({ eyebrow, title, lead, children }: { eyebrow: string; title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-[#04142f] to-[#0a2a57] px-5 pb-16 pt-36 text-white md:px-8 md:pb-20 md:pt-44">
      <div className="pattern-dark pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom_left,black,transparent_55%)]" />
      <div className="pointer-events-none absolute -end-32 -top-24 h-[420px] w-[420px] rounded-full bg-cyan/25 blur-[110px]" />
      <div className="relative mx-auto max-w-[1280px]">
        <Eyebrow dark>{eyebrow}</Eyebrow>
        <h1 className="mt-6 max-w-4xl font-serif text-[clamp(2.6rem,6vw,5rem)] font-medium leading-[1.02]">{title}</h1>
        {lead && <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">{lead}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}

/** Row of in-page anchor pills shown under an inner page banner. */
export function SubNav({ items }: { items: [string, string][] }) {
  return (
    <nav aria-label="On this page" className="mx-auto flex max-w-[1280px] flex-wrap gap-2 px-5 pt-8 md:px-8">
      {items.map(([href, label]) => (
        <a key={href} href={href} className="rounded-full border border-brand/15 bg-white px-4 py-2 text-sm font-bold text-brand transition hover:border-brand hover:bg-brand hover:text-white">{label}</a>
      ))}
    </nav>
  );
}

export type EventItem = {
  cat: "soon" | "partner" | "ended"; img?: string; tag: string; title: string; text: string; meta: string; href?: string;
};

/** The programs & events list (bilingual). Links are in-page anchors for the Programs page. */
export function useEvents(): EventItem[] {
  const { l } = useLang();
  const soon = l("Coming soon", "قريبًا");
  const tba = l("Official date to be announced", "سيُعلن الموعد رسميًا");
  return [
    { cat: "soon", img: "/img/arabic-dialogue.jpg", tag: soon, title: l("Arabic Political Dialogue Series", "سلسلة الحوار السياسي العربي"),
      text: l("An Arabic-language series connecting academics, researchers, diplomats, policy experts, decision-makers and political professionals.", "سلسلة باللغة العربية تجمع الأكاديميين والباحثين والدبلوماسيين وخبراء السياسات وصنّاع القرار والمهنيين السياسيين."),
      meta: l("Register interest", "سجّل اهتمامك"), href: mail("Register interest: Arabic Political Dialogue Series") },
    { cat: "soon", tag: soon, title: l("IAPSS MENA Regional Congress", "المؤتمر الإقليمي لـ IAPSS MENA"),
      text: l("The regional chapter's upcoming congress. Date, venue and registration details will be published once confirmed.", "مؤتمر الفرع الإقليمي القادم. سيتم نشر التاريخ والمكان وتفاصيل التسجيل بعد التأكيد."), meta: tba },
    { cat: "soon", tag: soon, title: l("Leadership Program", "برنامج القيادة"),
      text: l("An upcoming leadership development program for political science students and young professionals across the region.", "برنامج قادم لتنمية مهارات القيادة لدى طلاب العلوم السياسية والمهنيين الشباب في المنطقة."),
      meta: tba, href: "#opportunities" },
    { cat: "partner", img: "/img/yale.jpg", tag: l("Partner event · IAPSS Global", "فعالية شريكة · IAPSS Global"), title: l("Yale Annual YGJP Conference 2026", "مؤتمر YGJP السنوي من Yale 2026"),
      text: l("An IAPSS Global partner event under the announced partnership with Yale University. It is not presented as an IAPSS MENA-organized event.", "فعالية شريكة لـ IAPSS Global ضمن الشراكة المعلنة مع جامعة ييل. ولا تُعرض كفعالية منظَّمة من IAPSS MENA."),
      meta: l("5–8 November 2026", "5–8 نوفمبر 2026") },
    { cat: "partner", img: "/img/best-diplomats.jpg", tag: l("Member benefit", "ميزة للأعضاء"), title: l("Exclusive Member Benefit with Best Diplomats", "ميزة حصرية للأعضاء مع Best Diplomats"),
      text: l("Eligible members may request discounted rates for Türkiye Conference and the UN Immersion Program.", "يمكن للأعضاء المؤهلين طلب أسعار مخفّضة لمؤتمر تركيا وبرنامج الانغماس في الأمم المتحدة."),
      meta: l("For eligible members", "للأعضاء المؤهلين"), href: "#opportunities" },
    { cat: "ended", img: "/img/policy-brief.jpg", tag: l("Ended", "انتهت"), title: l("IAPSS MENA Policy Brief Competition 2026", "مسابقة موجز السياسات 2026"),
      text: l("An opportunity for students and emerging researchers to turn evidence-based analysis into practical recommendations on governance and political change in MENA.", "فرصة للطلاب والباحثين الشباب لتحويل التحليل القائم على الأدلة إلى توصيات عملية حول الحوكمة والتغيير السياسي في المنطقة."),
      meta: l("Deadline: 1 October 2026", "الموعد النهائي: 1 أكتوبر 2026"), href: "#projects" },
  ];
}

/** One event card. `href` may be an in-page anchor, an internal route, a mailto or an external link. */
export function EventCard({ c, i = 0, className = "", href }: { c: EventItem; i?: number; className?: string; href?: string }) {
  const { rtl } = useLang();
  const target = href ?? c.href;
  const inner = (
    <>
      <div className="relative h-[300px] overflow-hidden bg-[#e8f0f2]">
        {c.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.img} alt={c.title} loading="lazy" className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105" />
        ) : (
          <div className="relative grid h-full place-items-center bg-gradient-to-br from-[#04142f] to-[#0a2a57]">
            <div className="pattern-dark absolute inset-0 opacity-70" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mena.png" alt="" className="relative h-20 w-auto brightness-0 invert" />
          </div>
        )}
        <span className="absolute start-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-brand backdrop-blur">{c.tag}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-2xl font-medium leading-tight text-brand">{c.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{c.text}</p>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-brand/10 pt-4">
          <span className="text-xs font-bold uppercase tracking-wide text-brand/60">{c.meta}</span>
          {target && <span className="grid h-9 w-9 place-items-center rounded-full bg-brand/5 text-sm text-brand transition group-hover:bg-brand group-hover:text-white">{rtl ? "←" : "→"}</span>}
        </div>
      </div>
    </>
  );
  const cls = `group flex flex-col overflow-hidden rounded-3xl border border-brand/10 bg-paper transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_70px_rgba(6,26,59,.16)] fade-up ${className}`;
  const style = { animationDelay: `${i * 70}ms` };
  if (!target) return <article className={cls} style={style}>{inner}</article>;
  if (target.startsWith("/")) return <Link href={target} className={cls} style={style}>{inner}</Link>;
  return <a href={target} className={cls} style={style}>{inner}</a>;
}
