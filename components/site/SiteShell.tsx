"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Logo from "@/components/Logo";
import Chatbot from "@/components/Chatbot";
import { useLang } from "@/components/Lang";
import { CONTACT } from "./shared";

/** Header, footer and shared behaviour for every public page. */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  const { l, lang, setLang } = useLang();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [menu, setMenu] = useState(false);
  const [gi, setGi] = useState(false);
  const giRef = useRef<HTMLDivElement>(null);

  const nav: [string, string][] = [
    ["/about", l("About", "من نحن")],
    ["/programs", l("Programs", "البرامج")],
    ["/partnerships", l("Partnerships", "الشراكات")],
    ["/news", l("News", "الأخبار")],
    ["/contact", l("Contact", "تواصل معنا")],
  ];
  const involved: [string, string, string][] = [
    ["/get-involved", l("Join IAPSS MENA", "انضم إلى IAPSS MENA"), l("Request to join the community", "اطلب الانضمام إلى المجتمع")],
    ["/volunteer", l("Volunteer with us", "تطوّع معنا"), l("Open roles and how to apply", "الأدوار المتاحة وطريقة التقديم")],
    ["/get-involved#faq", l("Questions & answers", "الأسئلة الشائعة"), l("Quick answers about joining", "إجابات سريعة عن الانضمام")],
  ];
  const isActive = (h: string) => pathname === h || pathname.startsWith(h + "/");

  // floating header state, reading-progress bar, back-to-top
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        setScrolled(y > 30);
        setProgress(h > 0 ? Math.min(100, (y / h) * 100) : 0);
        setShowTop(y > 900);
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, [pathname]);

  // close menus when the page changes, on Escape, and on outside click
  useEffect(() => { setMenu(false); setGi(false); }, [pathname]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") { setGi(false); setMenu(false); } };
    const click = (e: MouseEvent) => { if (giRef.current && !giRef.current.contains(e.target as Node)) setGi(false); };
    window.addEventListener("keydown", key);
    window.addEventListener("mousedown", click);
    return () => { window.removeEventListener("keydown", key); window.removeEventListener("mousedown", click); };
  }, []);

  // sections and cards fade up as they scroll into view; cursor glow on dark panels
  useEffect(() => {
    const reduce = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: (() => void)[] = [];

    const spots = Array.from(document.querySelectorAll<HTMLElement>("[data-spot]"));
    spots.forEach((el) => {
      const h = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      };
      el.addEventListener("mousemove", h);
      cleanups.push(() => el.removeEventListener("mousemove", h));
    });

    if (!reduce && typeof IntersectionObserver !== "undefined") {
      const els = Array.from(document.querySelectorAll<HTMLElement>("main section h2, main section article, main section li, [data-rv]"));
      els.forEach((e) => e.classList.add("rv"));
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const t = en.target as HTMLElement;
          t.classList.add("rv-in");
          io.unobserve(t);
          setTimeout(() => t.classList.remove("rv", "rv-in"), 1000);
        });
      }, { threshold: 0.1 });
      els.forEach((e) => io.observe(e));
      cleanups.push(() => io.disconnect());
    }
    return () => cleanups.forEach((c) => c());
  }, [pathname]);

  return (
    <div className="pub overflow-x-clip">
      <a href="#content" className="sr-only z-[60] rounded-full bg-white px-4 py-3 text-sm font-bold text-brand focus:not-sr-only focus:fixed focus:start-4 focus:top-4">{l("Skip to content", "انتقل إلى المحتوى")}</a>

      <div className="fixed inset-x-0 top-0 z-[60] h-[3px]"><div className="h-full bg-cyan" style={{ width: `${progress}%` }} /></div>

      <header className="fixed inset-x-0 top-3 z-50 px-3">
        <div className={`mx-auto flex max-w-[1180px] items-center justify-between gap-2 rounded-full border border-white/70 bg-white/80 px-3 backdrop-blur-xl transition-all duration-300 ${scrolled ? "h-14 shadow-[0_14px_44px_rgba(6,26,59,.16)]" : "h-16 shadow-[0_8px_30px_rgba(6,26,59,.08)]"}`}>
          <div className="ps-2"><Logo size={scrolled ? 34 : 40} /></div>

          <nav className="hidden items-center gap-1 text-sm font-semibold lg:flex" aria-label="Main">
            {nav.map(([h, t]) => {
              const on = isActive(h);
              return (
                <Link key={h} href={h} aria-current={on ? "page" : undefined}
                  className={`rounded-full px-4 py-2 transition ${on ? "bg-brand text-white" : "text-brand/80 hover:bg-brand/5 hover:text-brand"}`}>{t}</Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className="rounded-full border border-brand/15 px-4 py-2.5 text-sm font-bold text-brand transition hover:bg-brand/5" aria-label="Switch language">
              {lang === "en" ? "العربية" : "EN"}
            </button>
            <Link href="/login" className="hidden rounded-full px-4 py-2.5 text-sm font-bold text-brand transition hover:bg-brand/5 md:inline-block">{l("Sign in", "تسجيل الدخول")}</Link>

            <div ref={giRef} className="relative hidden sm:block">
              <button onClick={() => setGi(!gi)} aria-expanded={gi} aria-haspopup="menu"
                className="flex items-center gap-2 rounded-full bg-cyan px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal2">
                {l("Get involved", "شارك معنا")} <span className={`text-xs transition-transform ${gi ? "rotate-180" : ""}`}>▾</span>
              </button>
              {gi && (
                <div role="menu" className="absolute end-0 top-full mt-3 w-[min(320px,86vw)] rounded-3xl border border-white/70 bg-white/95 p-2 shadow-2xl backdrop-blur-xl fade-up">
                  {involved.map(([h, t, d]) => (
                    <Link key={h} href={h} role="menuitem" className="block rounded-2xl px-4 py-3 transition hover:bg-brand/5">
                      <span className="block text-sm font-bold text-brand">{t}</span>
                      <span className="block text-xs text-slate-500">{d}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="mobile-menu" className="rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-white lg:hidden">
              {menu ? l("Close", "إغلاق") : l("Menu", "القائمة")}
            </button>
          </div>
        </div>

        {menu && (
          <nav id="mobile-menu" aria-label="Mobile" className="mx-auto mt-2 max-h-[78vh] max-w-[1180px] overflow-y-auto rounded-3xl border border-white/70 bg-white/95 p-3 shadow-2xl backdrop-blur-xl lg:hidden">
            {nav.map(([h, t]) => (
              <Link key={h} href={h} className={`block rounded-2xl px-5 py-3.5 text-base font-semibold ${isActive(h) ? "bg-brand text-white" : "text-brand hover:bg-brand/5"}`}>{t}</Link>
            ))}
            <p className="px-5 pb-1 pt-4 text-[11px] font-bold uppercase tracking-[.16em] text-teal2">{l("Get involved", "شارك معنا")}</p>
            {involved.map(([h, t]) => (
              <Link key={h} href={h} className="block rounded-2xl px-5 py-3 text-base font-semibold text-brand hover:bg-brand/5">{t}</Link>
            ))}
            <div className="p-3">
              <Link href="/login" className="block rounded-full border border-brand/20 py-3 text-center text-sm font-bold text-brand">{l("Sign in", "تسجيل الدخول")}</Link>
            </div>
          </nav>
        )}
      </header>

      <main id="content">{children}</main>

      <footer className="relative mt-24 overflow-hidden rounded-t-[2.5rem] bg-[#04142f] pt-20 text-[#9fb3ca]">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 md:grid-cols-[1.35fr_repeat(3,.7fr)] md:px-8">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mena.png" alt="IAPSS MENA" className="h-14 w-auto brightness-0 invert" />
            <p className="mt-5 max-w-sm text-sm leading-7">{l(
              "IAPSS MENA is the Middle East and North Africa Regional Chapter of the International Association for Political Science Students (IAPSS).",
              "IAPSS MENA هو الفرع الإقليمي للرابطة الدولية لطلاب العلوم السياسية (IAPSS) في الشرق الأوسط وشمال أفريقيا."
            )}</p>
            <a href={`mailto:${CONTACT}`} className="mt-4 block font-bold text-white" dir="ltr">{CONTACT}</a>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[.16em] text-white">{l("Explore", "استكشف")}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="hover:text-white">{l("About", "من نحن")}</Link></li>
              <li><Link href="/about#leadership" className="hover:text-white">{l("Leadership", "القيادة")}</Link></li>
              <li><Link href="/programs" className="hover:text-white">{l("Programs & events", "البرامج والفعاليات")}</Link></li>
              <li><Link href="/programs#opportunities" className="hover:text-white">{l("Opportunities", "الفرص")}</Link></li>
              <li><Link href="/news" className="hover:text-white">{l("News", "الأخبار")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[.16em] text-white">{l("Get involved", "شارك معنا")}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/get-involved" className="hover:text-white">{l("Join IAPSS MENA", "انضم إلى IAPSS MENA")}</Link></li>
              <li><Link href="/volunteer" className="hover:text-white">{l("Volunteer with us", "تطوّع معنا")}</Link></li>
              <li><Link href="/partnerships" className="hover:text-white">{l("Partnerships", "الشراكات")}</Link></li>
              <li><Link href="/contact" className="hover:text-white">{l("Contact", "تواصل معنا")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[.16em] text-white">{l("International", "الرابطة الدولية")}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="https://iapss.org/" target="_blank" rel="noopener noreferrer" className="hover:text-white">IAPSS Global</a></li>
              <li><a href="https://iapss.org/iapss-mena/" target="_blank" rel="noopener noreferrer" className="hover:text-white">IAPSS MENA</a></li>
              <li><a href="https://www.linkedin.com/company/iapssmenaofficial" target="_blank" rel="noopener noreferrer" className="hover:text-white">LinkedIn</a></li>
              <li><a href="https://www.instagram.com/iapss.mena/" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div aria-hidden dir="ltr" className="mt-12 select-none text-center font-serif text-[clamp(4rem,16vw,13rem)] font-semibold leading-[.85] text-white/[.05]">IAPSS MENA</div>
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-6 text-xs md:px-8">
          <span>© 2026 IAPSS MENA · {l("A regional chapter within IAPSS Global", "فرع إقليمي ضمن IAPSS Global")}</span>
          <span className="font-semibold tracking-wide text-white/80">{l("Ideas · People · Dialogue · Change", "أفكار · أشخاص · حوار · تغيير")}</span>
        </div>
      </footer>

      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label={l("Back to top", "العودة للأعلى")}
        className={`fixed bottom-5 start-4 z-50 rounded-full bg-brand px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xl transition duration-300 hover:bg-brand-500 ${showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}>
        ↑ {l("Top", "أعلى")}
      </button>
      <Chatbot context="public" />
    </div>
  );
}
