"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SiteSection from "@/components/SiteSection";
import PartnerLogo, { domainOf } from "@/components/PartnerLogo";
import { useLang } from "@/components/Lang";
import {
  CONTACT, mail, wrap, h2cls, btnPrimary, btnGhost, btnCyan, btnLight, btnOutlineLight,
  GLOBAL_PARTNERS, CountUp, Words, Eyebrow, EventCard, useEvents,
} from "../shared";

export default function HomePage() {
  const { l, rtl } = useLang();
  const events = useEvents();
  const heroBg = useRef<HTMLDivElement>(null);
  const heroMouse = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const soon = l("Coming soon", "قريبًا");
  const arrow = rtl ? "←" : "→";

  // hero photo parallax on scroll
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (heroBg.current && y < 800) heroBg.current.style.transform = `translate3d(0, ${Math.min(60, Math.round(y * 0.1))}px, 0)`;
      });
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, []);

  // "happening next" card advances by itself
  useEffect(() => {
    if (paused || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setSlide((n) => (n + 1) % 3), 5500);
    return () => clearInterval(t);
  }, [paused]);

  // the photo drifts gently against the cursor
  const heroMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = heroMouse.current;
    if (!el || !matchMedia("(hover: hover) and (pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `translate3d(${(-x * 22).toFixed(1)}px, ${(-y * 14).toFixed(1)}px, 0) scale(1.05)`;
  };
  const heroLeave = () => { if (heroMouse.current) heroMouse.current.style.transform = ""; };

  const slides = [
    { tag: soon, title: l("Arabic Political Dialogue Series", "سلسلة الحوار السياسي العربي"), sub: l("Arabic Dialogue. Global Perspectives.", "الحوار العربي، رؤية عالمية"), cta: l("Register interest", "سجّل اهتمامك"), href: mail("Register interest: Arabic Political Dialogue Series"), internal: false },
    { tag: soon, title: l("IAPSS MENA Regional Congress", "المؤتمر الإقليمي لـ IAPSS MENA"), sub: l("Date, venue and registration will be published once confirmed.", "سيتم نشر التاريخ والمكان وتفاصيل التسجيل بعد التأكيد."), cta: l("See all programs", "كل البرامج"), href: "/programs", internal: true },
    { tag: l("Partner event · IAPSS Global", "فعالية شريكة · IAPSS Global"), title: l("Yale Annual YGJP Conference 2026", "مؤتمر YGJP السنوي من Yale 2026"), sub: l("5–8 November 2026", "5–8 نوفمبر 2026"), cta: l("See all programs", "كل البرامج"), href: "/programs", internal: true },
  ];
  const cur = slides[slide];
  const nextUp = events.filter((e) => e.cat === "soon");

  return (
    <>
      {/* HERO: full screen, cinematic */}
      <section id="hero" onMouseMove={heroMove} onMouseLeave={heroLeave}
        className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-[#04142f]">
        <div ref={heroBg} className="absolute inset-x-0 -top-[8%] h-[116%] will-change-transform">
          <div ref={heroMouse} className="h-full w-full transition-transform duration-500 ease-out will-change-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/hero.jpg" alt={l("Cairo skyline at sunset", "أفق القاهرة عند الغروب")} className="hero-photo h-full w-full object-cover" style={{ objectPosition: "62% 48%" }} />
          </div>
        </div>
        <div className="hero-shade absolute inset-0" />
        <div className="absolute inset-0 bg-[#04142f]/45 lg:hidden" />
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#04142f] via-[#04142f]/60 to-transparent" />
        <div className="pattern-dark pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom_left,black,transparent_45%)]" />
        <div className="pointer-events-none absolute -end-40 top-1/4 h-[620px] w-[620px] rounded-full bg-cyan/20 blur-[120px]" />

        <div className={`${wrap} relative z-[2] w-full grid items-end gap-8 pb-8 pt-28 lg:grid-cols-[minmax(0,1fr)_360px]`}>
          <div>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-xl">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky opacity-70" /><span className="relative inline-flex h-2 w-2 rounded-full bg-sky" /></span>
              {l("IAPSS · Middle East & North Africa", "IAPSS · الشرق الأوسط وشمال أفريقيا")}
            </span>
            <h1 className="mt-6 font-serif text-[clamp(2.9rem,6.3vw,6rem)] font-medium leading-[.98] text-white">
              <Words text={l("Regional voices.", "من المنطقة،")} />
              <span className="block italic text-[#7ee8ea]"><Words text={l("Global dialogue.", "نصنع الحوار")} start={2} /></span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/80 md:text-lg md:leading-8">
              {l(
                "IAPSS MENA is the Middle East and North Africa Regional Chapter of the International Association for Political Science Students (IAPSS).",
                "IAPSS MENA هو الفرع الإقليمي للرابطة الدولية لطلاب العلوم السياسية (IAPSS) في الشرق الأوسط وشمال أفريقيا."
              )}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/programs" className={btnLight}>{l("Explore opportunities", "استكشف الفرص")}</Link>
              <Link href="/about" className={btnOutlineLight}>{l("Our regional role", "دورنا الإقليمي")}</Link>
            </div>
          </div>

          <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
            className="rounded-[2rem] border border-white/20 bg-white/10 p-5 text-white shadow-[0_30px_80px_rgba(0,0,0,.35)] backdrop-blur-2xl lg:mb-2">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[.16em] text-white/70">
              <span>{l("Happening next", "ما القادم")}</span>
              <span>0{slide + 1} / 03</span>
            </div>
            <div key={slide} className="fade-up">
              <span className="mt-4 inline-block rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sky">{cur.tag}</span>
              <h3 className="mt-3 font-serif text-xl font-medium leading-snug md:text-2xl">{cur.title}</h3>
              <p className="mt-2 min-h-[3rem] text-sm leading-6 text-white/70">{cur.sub}</p>
              {cur.internal
                ? <Link href={cur.href} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white hover:text-sky">{cur.cta} <span>{arrow}</span></Link>
                : <a href={cur.href} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white hover:text-sky">{cur.cta} <span>{arrow}</span></a>}
            </div>
            <div className="mt-4 flex gap-2">
              {[0, 1, 2].map((i) => (
                <button key={i} onClick={() => setSlide(i)} aria-label={`${i + 1}`} className="group py-2">
                  <span className={`block h-1 rounded-full transition-all duration-300 ${slide === i ? "w-10 bg-sky" : "w-5 bg-white/30 group-hover:bg-white/60"}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`${wrap} relative z-[2] w-full pb-8`}>
          <dl className="grid grid-cols-3 divide-x divide-white/15 rounded-3xl border border-white/15 bg-white/10 py-4 backdrop-blur-xl rtl:divide-x-reverse">
            {[
              [10000, "+", l("members worldwide", "عضو حول العالم")],
              [40, "+", l("countries", "دولة")],
              [GLOBAL_PARTNERS.length, "", l("global partners", "شريكًا عالميًا")],
            ].map(([n, suf, label]) => (
              <div key={String(label)} className="px-4 text-center md:px-8 md:text-start">
                <dt className="font-serif text-[clamp(1.6rem,3.6vw,3rem)] font-medium leading-none text-white"><CountUp to={n as number} suffix={suf as string} /></dt>
                <dd className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-white/60 md:text-xs">{label}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-[11px] text-white/50">{l("Figures describe the global IAPSS network that IAPSS MENA is part of.", "الأرقام تصف شبكة IAPSS العالمية التي ينتمي إليها IAPSS MENA.")}</p>
        </div>
      </section>

      {/* PARTNER STRIP */}
      <section aria-label={l("Partners of IAPSS Global", "شركاء IAPSS Global")} className="overflow-hidden border-b border-brand/10 bg-white/70 py-7">
        <p className="mb-5 text-center text-[11px] font-bold uppercase tracking-[.2em] text-slate-400">{l("Partners of IAPSS Global", "شركاء IAPSS Global")}</p>
        <div dir="ltr" className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
          {[...GLOBAL_PARTNERS, ...GLOBAL_PARTNERS].map(([n, u], i) => (
            <div key={i} className="group flex items-center gap-3 rounded-full border border-brand/10 bg-white py-2 ps-2 pe-5">
              <PartnerLogo domain={domainOf(u)} name={n} size={36} />
              <span className="whitespace-nowrap text-sm font-semibold text-brand">{n}</span>
            </div>
          ))}
        </div>
      </section>

      {/* THREE DOORS */}
      <section className={`${wrap} py-20`}>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [l("Engage", "شارك"), l("Programs & events", "البرامج والفعاليات"), "/programs"],
            [l("Discover", "اكتشف"), l("Research & publications", "البحث والمنشورات"), "/programs#publications"],
            [l("Collaborate", "تعاون"), l("Regional partnerships", "الشراكات الإقليمية"), "/partnerships"],
          ].map(([word, title, href], i) => (
            <Link key={title} href={href}
              className={`group relative flex min-h-[170px] flex-col justify-between overflow-hidden rounded-3xl p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_60px_rgba(6,26,59,.16)] ${i === 0 ? "bg-cyan text-white" : "border border-brand/10 bg-white text-brand"}`}>
              <span className={`text-xs font-bold tracking-widest ${i === 0 ? "text-white/70" : "text-slate-400"}`}>0{i + 1} · {word.toUpperCase()}</span>
              <span className="flex items-end justify-between gap-4">
                <strong className="font-serif text-2xl font-medium leading-tight">{title}</strong>
                <span className={`grid h-11 w-11 flex-none place-items-center rounded-full text-lg transition group-hover:translate-x-1 ${i === 0 ? "bg-white/20" : "bg-brand/5"}`}>{arrow}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* NEXT UP */}
      <section className="bg-white py-24">
        <div className={wrap}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>{l("Coming soon", "قريبًا")}</Eyebrow>
              <h2 className={h2cls}>{l("What's next", "ما القادم")}</h2>
            </div>
            <Link href="/programs" className={btnGhost}>{l("All programs & events", "كل البرامج والفعاليات")}</Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {nextUp.map((c, i) => (
              <EventCard key={c.title} c={c} i={i} href={c.href?.startsWith("mailto:") ? c.href : "/programs"} />
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT TEASER */}
      <section className={`${wrap} py-24`}>
        <article data-spot className="spot relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#04142f] to-[#0a2a57] p-8 text-white md:p-14">
          <div className="pattern-dark pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom_left,black,transparent_60%)]" />
          <div className="relative grid items-end gap-8 lg:grid-cols-[1.3fr_.7fr]">
            <div>
              <Eyebrow dark>{l("Our regional role", "دورنا الإقليمي")}</Eyebrow>
              <p className="mt-6 font-serif text-[clamp(1.6rem,3vw,2.6rem)] font-medium leading-snug">{l(
                "We connect political science students, researchers and young professionals across MENA through dialogue, research and leadership.",
                "نربط طلاب العلوم السياسية والباحثين والمهنيين الشباب في المنطقة عبر الحوار والبحث والقيادة."
              )}</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/about" className={btnLight}>{l("About us", "من نحن")}</Link>
              <Link href="/about#leadership" className={btnOutlineLight}>{l("Meet the leadership", "تعرّف على القيادة")}</Link>
            </div>
          </div>
        </article>
      </section>

      {/* GET INVOLVED */}
      <section className="bg-white py-24">
        <div className={wrap}>
          <Eyebrow>{l("Get involved", "شارك معنا")}</Eyebrow>
          <h2 className={h2cls}>{l("Be part of IAPSS MENA", "كن جزءًا من IAPSS MENA")}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <Link href="/get-involved" className="group flex flex-col rounded-[2rem] border border-brand/10 bg-paper p-8 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_60px_rgba(6,26,59,.12)] md:p-10">
              <span className="font-serif text-5xl font-medium text-teal2/40">01</span>
              <h3 className="mt-4 font-serif text-3xl font-medium text-brand">{l("Join the community", "انضم إلى المجتمع")}</h3>
              <p className="mt-3 flex-1 leading-8 text-slate-600">{l("Ask to join. An admin reviews every request, then you can follow your group's work.", "اطلب الانضمام. يراجع المشرف كل طلب، ثم يمكنك متابعة عمل مجموعتك.")}</p>
              <span className={`${btnPrimary} mt-6 w-fit`}>{l("How to join", "كيف أنضم")} {arrow}</span>
            </Link>
            <Link href="/volunteer" className="group flex flex-col rounded-[2rem] bg-cyan p-8 text-white transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_60px_rgba(0,174,180,.35)] md:p-10">
              <span className="font-serif text-5xl font-medium text-white/40">02</span>
              <h3 className="mt-4 font-serif text-3xl font-medium">{l("Volunteer with us", "تطوّع معنا")}</h3>
              <p className="mt-3 flex-1 leading-8 text-white/90">{l("See where we need help and apply for a role that fits your skills.", "اطّلع على أماكن حاجتنا للمساعدة وقدّم على الدور المناسب لمهاراتك.")}</p>
              <span className={`${btnLight} mt-6 w-fit`}>{l("See open roles", "الأدوار المتاحة")} {arrow}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* LATEST NEWS */}
      <section className={`${wrap} py-24`}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>{l("Updates", "المستجدات")}</Eyebrow>
            <h2 className={h2cls}>{l("Latest news", "آخر الأخبار")}</h2>
          </div>
          <Link href="/news" className={btnGhost}>{l("All news", "كل الأخبار")}</Link>
        </div>
        <div className="mt-10">
          <SiteSection kind="news" limit={3} empty={
            <div className="rounded-[2rem] border border-dashed border-brand/20 bg-white p-10 text-center">
              <p className="mx-auto max-w-xl text-slate-600">{l(
                "No news articles have been published yet. Explore current programs and events.",
                "لا توجد أخبار منشورة حاليًا. يمكنك الاطلاع على البرامج والفعاليات الحالية."
              )}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/programs" className={btnPrimary}>{l("Programs & events", "البرامج والفعاليات")}</Link>
                <a href={`mailto:${CONTACT}`} className={btnCyan}>{l("Contact us", "تواصل معنا")}</a>
              </div>
            </div>
          } />
        </div>
      </section>
    </>
  );
}
