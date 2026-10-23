"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Logo from "@/components/Logo";
import Chatbot from "@/components/Chatbot";
import SiteSection from "@/components/SiteSection";
import PartnerLogo, { domainOf } from "@/components/PartnerLogo";
import Tilt from "@/components/Tilt";
import { useLang } from "@/components/Lang";

const CONTACT = "pr.mena@iapss.org";
const mail = (subject: string) => `mailto:${CONTACT}?subject=${encodeURIComponent(subject)}`;

// [english, arabic] pairs, taken from the official IAPSS MENA site
const RESEARCH_AREAS: [string, string][] = [
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
const GLOBAL_PARTNERS: [string, string][] = [
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
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
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
function Words({ text, start = 0 }: { text: string; start?: number }) {
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

const btnPrimary = "rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-500 hover:shadow-[0_14px_30px_rgba(6,26,59,.25)]";
const btnGhost = "rounded-full border border-brand/20 bg-white/60 px-7 py-3.5 text-sm font-bold text-brand backdrop-blur transition hover:-translate-y-0.5 hover:border-brand hover:bg-white";
const btnCyan = "rounded-full bg-cyan px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-teal2 hover:shadow-[0_14px_30px_rgba(0,174,180,.35)]";
const btnLight = "rounded-full bg-white px-7 py-3.5 text-sm font-bold text-brand transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(0,0,0,.25)]";
const btnOutlineLight = "rounded-full border border-white/40 px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10";
const wrap = "mx-auto max-w-[1280px] px-5 md:px-8";

export default function Home() {
  const { l, lang, setLang, rtl } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("");
  const [evFilter, setEvFilter] = useState<"all" | "soon" | "partner" | "ended">("all");
  const [q, setQ] = useState("");
  const [faq, setFaq] = useState<number | null>(0);
  const [pbTab, setPbTab] = useState<"overview" | "apply" | "areas" | "review">("overview");
  const heroBg = useRef<HTMLDivElement>(null);
  const heroMouse = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const carousel = useRef<HTMLDivElement>(null);

  // floating header state, reading-progress bar, back-to-top, hero parallax
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
        if (y < 400) setActive("");
        if (heroBg.current && y < 800) heroBg.current.style.transform = `translate3d(0, ${Math.min(60, Math.round(y * 0.1))}px, 0)`;
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, []);

  // highlight the menu entry of the section being read
  useEffect(() => {
    const els = ["about", "team", "events", "partners", "opportunities", "news", "contact"]
      .map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-35% 0px -60% 0px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  // soft light that follows the cursor on dark panels
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-spot]"));
    const hs = els.map((el) => {
      const h = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      };
      el.addEventListener("mousemove", h);
      return [el, h] as const;
    });
    return () => hs.forEach(([el, h]) => el.removeEventListener("mousemove", h));
  }, []);

  // sections and cards fade up as they scroll into view
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
    return () => io.disconnect();
  }, []);

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

  const eyebrow = (t: string, dark = false) => (
    <p className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[.16em] ${dark ? "bg-white/10 text-sky" : "bg-brand/5 text-teal2"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dark ? "bg-sky" : "bg-cyan"}`} /> {t}
    </p>
  );
  const h2cls = "mt-5 max-w-3xl font-serif text-[clamp(2.2rem,4.6vw,3.9rem)] font-medium leading-[1.06] text-brand";

  const soon = l("Coming soon", "قريبًا");
  const tba = l("Official date to be announced", "سيُعلن الموعد رسميًا");

  const events: { cat: "soon" | "partner" | "ended"; img?: string; tag: string; title: string; text: string; meta: string; href?: string }[] = [
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

  const programs: [string, string, string][] = [
    [l("Student Research Committees", "لجان البحث الطلابية"), l("Student-led research communities for collaboration and academic publishing.", "مجتمعات بحثية يقودها الطلاب للتعاون والنشر الأكاديمي."), "https://iapss.org/student-research-committees/"],
    [l("Seasonal Schools", "المدارس الموسمية"), l("Intensive academic programs combining lectures, discussion and international exchange.", "برامج أكاديمية مكثفة تجمع المحاضرات والنقاش والتبادل الدولي."), "https://iapss.org/events/seasonal-schools/"],
    [l("Delegations", "الوفود"), l("Opportunities to represent IAPSS and engage with international institutions and conferences.", "فرص لتمثيل IAPSS والتفاعل مع المؤسسات والمؤتمرات الدولية."), "https://iapss.org/events/delegations/"],
    ["ARChive", l("A space preserving the organization's research, publications and institutional memory.", "مساحة تحفظ أبحاث المنظمة ومنشوراتها وذاكرتها المؤسسية."), "https://iapss.org/academic-department/project_archive/"],
    [l("IAPSS Think Tank", "مركز IAPSS للفكر"), l("A student-led platform for policy analysis, research and public debate.", "منصة يقودها الطلاب لتحليل السياسات والبحث والنقاش العام."), "https://iapss.org/think-tank-crisis-observatory/"],
  ];

  const publications: [string, string, string][] = [
    ["Politikon", l("A peer-reviewed, open-access academic journal in political science.", "مجلة أكاديمية محكّمة ومفتوحة الوصول في العلوم السياسية."), "https://politikon.iapss.org/"],
    ["Encuentro Latinoamericano (ELA)", l("A peer-reviewed academic journal focused on Latin American politics.", "مجلة أكاديمية محكّمة تركّز على السياسة في أمريكا اللاتينية."), "https://ela.iapss.org/"],
    ["A Different View (ADV)", l("IAPSS's platform for articles and political analysis.", "منصة IAPSS للمقالات والتحليل السياسي."), "https://iapss.org/a-different-view/"],
  ];

  const filteredPartners = GLOBAL_PARTNERS.filter(([n]) => n.toLowerCase().includes(q.trim().toLowerCase()));

  const faqs: [string, string][] = [
    [l("What is IAPSS MENA?", "ما هو IAPSS MENA؟"), l(
      "IAPSS MENA is the Middle East and North Africa Regional Chapter of the International Association for Political Science Students (IAPSS). It connects students, researchers and young professionals across the region through dialogue, research and leadership.",
      "IAPSS MENA هو الفرع الإقليمي للرابطة الدولية لطلاب العلوم السياسية (IAPSS) في الشرق الأوسط وشمال أفريقيا. يربط الطلاب والباحثين والمهنيين الشباب في المنطقة عبر الحوار والبحث والقيادة.")],
    [l("How do I join?", "كيف أنضم؟"), l(
      "Choose “Request to join” and create your account. An admin reviews every request, and you get access to your group's space once it is approved.",
      "اختر «اطلب الانضمام» وأنشئ حسابك. يراجع المشرف كل طلب، وتحصل على مساحة مجموعتك بعد الموافقة.")],
    [l("Is the Policy Brief Competition still open?", "هل ما زالت مسابقة موجز السياسات مفتوحة؟"), l(
      "No. Submissions for the IAPSS MENA Policy Brief Competition 2026 closed on 1 October 2026. Follow our programs and events for the next opportunities.",
      "لا. انتهى التقديم لمسابقة موجز السياسات 2026 بتاريخ 1 أكتوبر 2026. تابع برامجنا وفعالياتنا لمعرفة الفرص القادمة.")],
    [l("How can my organization collaborate with IAPSS MENA?", "كيف يمكن لمؤسستي التعاون مع IAPSS MENA؟"), l(
      "We welcome dialogue with universities, research centers, international institutions, diplomatic bodies and relevant organizations. Write to pr.mena@iapss.org.",
      "نرحب بالتواصل مع الجامعات ومراكز البحوث والمؤسسات الدولية والجهات الدبلوماسية والمنظمات ذات الصلة. راسلنا على pr.mena@iapss.org.")],
    [l("What is the Best Diplomats member benefit?", "ما هي ميزة Best Diplomats للأعضاء؟"), l(
      "Eligible members may request discounted rates for the Best Diplomats Türkiye Conference and UN Immersion Program. Best Diplomats runs the programs independently and handles registration and payment; IAPSS MENA does not collect payments.",
      "يمكن للأعضاء المؤهلين طلب أسعار مخفّضة لمؤتمر Best Diplomats في تركيا وبرنامج الانغماس في الأمم المتحدة. تدير Best Diplomats البرامج بشكل مستقل وتتولى التسجيل والدفع؛ ولا يجمع IAPSS MENA أي مدفوعات.")],
    [l("Are IAPSS Global partners also IAPSS MENA partners?", "هل شركاء IAPSS Global هم شركاء IAPSS MENA أيضًا؟"), l(
      "Not automatically. The organizations on the IAPSS Global partners page are partners of IAPSS Global. IAPSS MENA's own partners are listed separately on this page.",
      "ليس تلقائيًا. الجهات في صفحة شركاء IAPSS Global هي شركاء IAPSS Global. أما شركاء IAPSS MENA أنفسهم فيُعرضون بشكل منفصل في هذه الصفحة.")],
  ];

  const nav: [string, string][] = [
    ["#about", l("About", "من نحن")], ["#team", l("Leadership", "القيادة")], ["#events", l("Programs & events", "البرامج والفعاليات")],
    ["#partners", l("Partnerships", "الشراكات")], ["#opportunities", l("Opportunities", "الفرص")], ["#news", l("News", "الأخبار")], ["#contact", l("Contact", "تواصل معنا")],
  ];

  const scrollCarousel = (dir: 1 | -1) =>
    carousel.current?.scrollBy({ left: dir * (rtl ? -1 : 1) * 420, behavior: "smooth" });

  const pbTabs: ["overview" | "apply" | "areas" | "review", string][] = [
    ["overview", l("Overview", "نظرة عامة")], ["apply", l("Who could apply", "من يمكنه التقديم")],
    ["areas", l("Research areas", "مجالات البحث")], ["review", l("Review & awards", "التقييم والجوائز")],
  ];

  return (
    <main className="pub overflow-x-clip">
      <a href="#hero" className="sr-only z-[60] rounded-full bg-white px-4 py-3 text-sm font-bold text-brand focus:not-sr-only focus:fixed focus:start-4 focus:top-4">{l("Skip to content", "انتقل إلى المحتوى")}</a>

      {/* reading progress */}
      <div className="fixed inset-x-0 top-0 z-[60] h-[3px]"><div className="h-full bg-cyan" style={{ width: `${progress}%` }} /></div>

      {/* floating pill header */}
      <header className="fixed inset-x-0 top-3 z-50 px-3">
        <div className={`mx-auto flex max-w-[1180px] items-center justify-between gap-2 rounded-full border border-white/70 bg-white/80 px-3 backdrop-blur-xl transition-all duration-300 ${scrolled ? "h-14 shadow-[0_14px_44px_rgba(6,26,59,.16)]" : "h-16 shadow-[0_8px_30px_rgba(6,26,59,.08)]"}`}>
          <div className="ps-2"><Logo size={scrolled ? 34 : 40} /></div>
          <nav className="hidden items-center gap-0.5 text-[13px] font-semibold xl:flex" aria-label="Main">
            {nav.map(([h, t]) => {
              const on = active === h.slice(1);
              return (
                <a key={h} href={h} aria-current={on ? "true" : undefined}
                  className={`rounded-full px-3.5 py-2 transition ${on ? "bg-brand text-white" : "text-brand/80 hover:bg-brand/5 hover:text-brand"}`}>{t}</a>
              );
            })}
          </nav>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className="rounded-full border border-brand/15 px-4 py-2.5 text-sm font-bold text-brand transition hover:bg-brand/5" aria-label="Switch language">
              {lang === "en" ? "العربية" : "EN"}
            </button>
            <Link href="/login" className="hidden rounded-full px-4 py-2.5 text-sm font-bold text-brand transition hover:bg-brand/5 sm:inline-block">{l("Sign in", "تسجيل الدخول")}</Link>
            <Link href="/signup" className="hidden rounded-full bg-cyan px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal2 sm:inline-block">{l("Join", "انضم")}</Link>
            <button onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="mobile-menu" className="rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-white xl:hidden">
              {menu ? l("Close", "إغلاق") : l("Menu", "القائمة")}
            </button>
          </div>
        </div>
        {menu && (
          <nav id="mobile-menu" aria-label="Mobile" className="mx-auto mt-2 max-h-[75vh] max-w-[1180px] overflow-y-auto rounded-3xl border border-white/70 bg-white/95 p-3 shadow-2xl backdrop-blur-xl xl:hidden">
            {nav.map(([h, t]) => (
              <a key={h} href={h} onClick={() => setMenu(false)} className="block rounded-2xl px-5 py-3.5 text-base font-semibold text-brand hover:bg-brand/5">{t}</a>
            ))}
            <div className="flex gap-3 p-3">
              <Link href="/login" className="flex-1 rounded-full border border-brand/20 py-3 text-center text-sm font-bold text-brand">{l("Sign in", "تسجيل الدخول")}</Link>
              <Link href="/signup" className="flex-1 rounded-full bg-cyan py-3 text-center text-sm font-bold text-white">{l("Join", "انضم")}</Link>
            </div>
          </nav>
        )}
      </header>

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
              <a href="#events" className={btnLight}>{l("Explore opportunities", "استكشف الفرص")}</a>
              <a href="#about" className={btnOutlineLight}>{l("Our regional role", "دورنا الإقليمي")}</a>
            </div>
          </div>

          {/* what's happening: rotating glass card */}
          <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
            className="rounded-[2rem] border border-white/20 bg-white/10 p-5 text-white shadow-[0_30px_80px_rgba(0,0,0,.35)] backdrop-blur-2xl lg:mb-2">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[.16em] text-white/70">
              <span>{l("Happening next", "ما القادم")}</span>
              <span>0{slide + 1} / 03</span>
            </div>
            {(() => {
              const slides = [
                { tag: soon, title: l("Arabic Political Dialogue Series", "سلسلة الحوار السياسي العربي"), sub: l("Arabic Dialogue. Global Perspectives.", "الحوار العربي، رؤية عالمية"), cta: l("Register interest", "سجّل اهتمامك"), href: mail("Register interest: Arabic Political Dialogue Series") },
                { tag: soon, title: l("IAPSS MENA Regional Congress", "المؤتمر الإقليمي لـ IAPSS MENA"), sub: l("Date, venue and registration will be published once confirmed.", "سيتم نشر التاريخ والمكان وتفاصيل التسجيل بعد التأكيد."), cta: l("See all programs", "كل البرامج"), href: "#events" },
                { tag: l("Partner event · IAPSS Global", "فعالية شريكة · IAPSS Global"), title: l("Yale Annual YGJP Conference 2026", "مؤتمر YGJP السنوي من Yale 2026"), sub: l("5–8 November 2026", "5–8 نوفمبر 2026"), cta: l("See all programs", "كل البرامج"), href: "#events" },
              ];
              const c = slides[slide];
              return (
                <div key={slide} className="fade-up">
                  <span className="mt-4 inline-block rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sky">{c.tag}</span>
                  <h3 className="mt-3 font-serif text-xl font-medium leading-snug md:text-2xl">{c.title}</h3>
                  <p className="mt-2 min-h-[3rem] text-sm leading-6 text-white/70">{c.sub}</p>
                  <a href={c.href} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white hover:text-sky">{c.cta} <span>{rtl ? "←" : "→"}</span></a>
                </div>
              );
            })()}
            <div className="mt-4 flex gap-2">
              {[0, 1, 2].map((i) => (
                <button key={i} onClick={() => setSlide(i)} aria-label={`${i + 1}`} className="group py-2">
                  <span className={`block h-1 rounded-full transition-all duration-300 ${slide === i ? "w-10 bg-sky" : "w-5 bg-white/30 group-hover:bg-white/60"}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* network numbers */}
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
          <div className="mt-4 flex items-center justify-between gap-4 text-[11px] text-white/50">
            <span>{l("Figures describe the global IAPSS network that IAPSS MENA is part of.", "الأرقام تصف شبكة IAPSS العالمية التي ينتمي إليها IAPSS MENA.")}</span>
            <a href="#gateway" className="hidden items-center gap-2 font-bold uppercase tracking-[.16em] text-white/80 md:flex">
              {l("Scroll", "مرّر")}
              <span className="relative block h-9 w-5 rounded-full border border-white/40"><span className="absolute start-1/2 top-2 h-2 w-0.5 -translate-x-1/2 animate-bounce rounded bg-white" /></span>
            </a>
          </div>
        </div>
      </section>

      {/* PARTNER MARQUEE */}
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
      <section className={`${wrap} py-20`} id="gateway">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [l("Engage", "شارك"), l("Programs & events", "البرامج والفعاليات"), "#events"],
            [l("Discover", "اكتشف"), l("Research & publications", "البحث والمنشورات"), "#publications"],
            [l("Collaborate", "تعاون"), l("Regional partnerships", "الشراكات الإقليمية"), "#partners"],
          ].map(([word, title, href], i) => (
            <a key={title} href={href}
              className={`group relative flex min-h-[170px] flex-col justify-between overflow-hidden rounded-3xl p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_60px_rgba(6,26,59,.16)] ${i === 0 ? "bg-cyan text-white" : "border border-brand/10 bg-white text-brand"}`}>
              <span className={`text-xs font-bold tracking-widest ${i === 0 ? "text-white/70" : "text-slate-400"}`}>0{i + 1} · {word.toUpperCase()}</span>
              <span className="flex items-end justify-between gap-4">
                <strong className="font-serif text-2xl font-medium leading-tight">{title}</strong>
                <span className={`grid h-11 w-11 flex-none place-items-center rounded-full text-lg transition group-hover:translate-x-1 ${i === 0 ? "bg-white/20" : "bg-brand/5"}`}>{rtl ? "←" : "→"}</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ABOUT — bento */}
      <section id="about" className={`${wrap} pb-24`}>
        <div className="mb-10">
          {eyebrow(l("About", "من نحن"))}
          <h2 className={h2cls}>{l("Where knowledge meets practice.", "منصة تجمع المعرفة بالممارسة.")}</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-12">
          <article data-spot className="spot relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#04142f] to-[#0a2a57] p-8 text-white md:p-10 lg:col-span-7 lg:row-span-2">
            <div className="pattern-dark pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom_left,black,transparent_60%)]" />
            <div className="relative">
              {eyebrow(l("Our regional role", "دورنا الإقليمي"), true)}
              <p className="mt-6 font-serif text-[clamp(1.5rem,2.6vw,2.2rem)] font-medium leading-snug">{l(
                "The chapter connects political science students, researchers, young professionals, universities, academic institutions and relevant organizations across MENA.",
                "يربط الفرع طلاب العلوم السياسية والباحثين والمهنيين الشباب والجامعات والمؤسسات الأكاديمية والمنظمات ذات الصلة في المنطقة."
              )}</p>
              <p className="mt-6 leading-8 text-white/70">{l(
                "It supports regional engagement, academic cooperation and knowledge exchange in international relations, public policy and governance, alongside professional development and institutional partnerships.",
                "ويعزز التعاون الأكاديمي وتبادل المعرفة في العلاقات الدولية والسياسات العامة والحوكمة، والتطوير المهني والشراكات المؤسسية."
              )}</p>
              <p className="mt-6 text-sm leading-7 text-white/60">{l(
                "As IAPSS's regional chapter, we advance academic and professional engagement across MENA through dialogue, research, leadership and collaboration with universities, institutions and partners.",
                "بصفتنا الفرع الإقليمي لـ IAPSS، نعزز المشاركة الأكاديمية والمهنية في المنطقة عبر الحوار والبحث والقيادة والتعاون مع الجامعات والمؤسسات والشركاء."
              )}</p>
            </div>
          </article>
          <article className="rounded-[2rem] border border-brand/10 bg-white p-8 lg:col-span-5">
            <h3 className="font-serif text-xl font-medium text-brand">{l("Our mission", "رسالتنا")}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{l(
              "To create meaningful opportunities for dialogue, research, leadership, professional development and institutional cooperation, connecting emerging voices with academics, practitioners, organizations and international networks.",
              "إيجاد فرص هادفة للحوار والبحث والقيادة والتطوير المهني والتعاون المؤسسي، وربط الأصوات الصاعدة في المنطقة بالأكاديميين والممارسين والمنظمات والشبكات الدولية."
            )}</p>
          </article>
          <article className="rounded-[2rem] bg-sand p-8 lg:col-span-5">
            <h3 className="font-serif text-xl font-medium text-brand">{l("Our aim", "هدفنا")}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-700">{l(
              "To transform ideas and research into practical engagement and policy-relevant impact while strengthening an inclusive and collaborative regional chapter within IAPSS.",
              "تحويل الأفكار والبحوث إلى مشاركة عملية وأثر ذي صلة بالسياسات، وبناء فرع إقليمي قوي وشامل وتعاوني ضمن IAPSS."
            )}</p>
          </article>
          {[
            [l("Research & publishing", "البحث والنشر"), l("Spaces for knowledge and political analysis.", "مساحات للمعرفة والتحليل السياسي.")],
            [l("Regional dialogue", "الحوار الإقليمي"), l("Dialogue connecting voices and expertise.", "نقاشات تربط الأصوات والخبرات.")],
            [l("Leadership & development", "القيادة والتطوير"), l("Pathways for skills and professional growth.", "فرص للمهارات والتواصل المهني.")],
          ].map(([t, d], i) => (
            <article key={t} className={`group rounded-[2rem] p-8 transition duration-300 hover:-translate-y-1 lg:col-span-4 ${i === 1 ? "bg-cyan text-white" : "border border-brand/10 bg-white"}`}>
              <span className={`font-serif text-5xl font-medium ${i === 1 ? "text-white/50" : "text-teal2/40"}`}>0{i + 1}</span>
              <h3 className={`mt-6 font-serif text-xl font-medium ${i === 1 ? "text-white" : "text-brand"}`}>{t}</h3>
              <p className={`mt-2 text-sm leading-7 ${i === 1 ? "text-white/85" : "text-slate-600"}`}>{d}</p>
            </article>
          ))}
        </div>
      </section>

      {/* PROGRAMS & EVENTS — carousel */}
      <section id="events" className="bg-white py-24 md:py-28">
        <div className={wrap}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              {eyebrow(l("Now at IAPSS MENA", "الآن في IAPSS MENA"))}
              <h2 className={h2cls}>{l("Programs & events", "البرامج والفعاليات")}</h2>
              <p className="mt-4 max-w-xl text-slate-600">{l("Opportunities for knowledge and connection.", "فرص تصنع المعرفة والتواصل.")}</p>
            </div>
            <div className="hidden gap-2 md:flex">
              <button onClick={() => scrollCarousel(-1)} aria-label={l("Previous", "السابق")} className="grid h-12 w-12 place-items-center rounded-full border border-brand/15 text-lg text-brand transition hover:bg-brand hover:text-white">{rtl ? "→" : "←"}</button>
              <button onClick={() => scrollCarousel(1)} aria-label={l("Next", "التالي")} className="grid h-12 w-12 place-items-center rounded-full border border-brand/15 text-lg text-brand transition hover:bg-brand hover:text-white">{rtl ? "←" : "→"}</button>
            </div>
          </div>

          <div role="tablist" aria-label={l("Filter events", "تصفية الفعاليات")} className="mt-8 flex flex-wrap gap-2">
            {([["all", l("All", "الكل")], ["soon", l("Coming soon", "قريبًا")], ["partner", l("Partners & benefits", "الشركاء والمزايا")], ["ended", l("Ended", "انتهت")]] as const).map(([k, label]) => {
              const n = k === "all" ? events.length : events.filter((e) => e.cat === k).length;
              const on = evFilter === k;
              return (
                <button key={k} role="tab" aria-selected={on} onClick={() => { setEvFilter(k); carousel.current?.scrollTo({ left: 0 }); }}
                  className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${on ? "bg-brand text-white" : "border border-brand/15 bg-white text-brand hover:border-brand"}`}>
                  {label} <span className={on ? "text-sky" : "text-slate-400"}>{n}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div ref={carousel} key={evFilter} className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-8 md:px-[max(2rem,calc((100vw-1280px)/2+2rem))]">
          {events.filter((e) => evFilter === "all" || e.cat === evFilter).map((c, i) => {
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
                    {c.href && <span className="grid h-9 w-9 place-items-center rounded-full bg-brand/5 text-sm text-brand transition group-hover:bg-brand group-hover:text-white">{rtl ? "←" : "→"}</span>}
                  </div>
                </div>
              </>
            );
            const cls = "group flex w-[min(380px,84vw)] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-brand/10 bg-paper transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_70px_rgba(6,26,59,.16)] fade-up";
            return c.href
              ? <a key={c.title} href={c.href} className={cls} style={{ animationDelay: `${i * 70}ms` }}>{inner}</a>
              : <article key={c.title} className={cls} style={{ animationDelay: `${i * 70}ms` }}>{inner}</article>;
          })}
        </div>
      </section>

      {/* LEADERSHIP */}
      <section id="team" className="py-24 md:py-28">
        <div className={wrap}>
          <div className="mb-10">
            {eyebrow(l("The people", "الأشخاص"))}
            <h2 className={h2cls}>{l("Leadership", "القيادة")}</h2>
          </div>

          <article data-spot className="spot relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#04142f] to-[#0a2a57] p-8 text-white md:p-14">
            <div className="pattern-dark pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom_left,black,transparent_55%)]" />
            <div className="relative grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
              <div>
                {eyebrow(l("Message from the Chair", "رسالة الرئيس"), true)}
                <div className="mt-6 grid h-28 w-28 place-items-center rounded-full bg-cyan font-serif text-4xl font-medium text-white ring-8 ring-white/10">MA</div>
                <h3 className="mt-6 font-serif text-4xl font-medium leading-tight md:text-5xl">Mohanad<br />Albayati</h3>
                <p className="mt-3 text-sm font-bold uppercase tracking-[.14em] text-sky">{l("IAPSS MENA Chair", "رئيس IAPSS MENA")}</p>
              </div>
              <div className="space-y-5 text-lg leading-8 text-white/80">
                <p className="font-serif text-[clamp(1.5rem,2.4vw,2rem)] italic leading-snug text-white">“{l(
                  "It is a privilege to lead IAPSS MENA at a time when our region is witnessing profound political, social and institutional change.",
                  "يشرفني أن أقود IAPSS MENA في وقت تشهد فيه منطقتنا تحولات سياسية واجتماعية ومؤسسية عميقة."
                )}”</p>
                <p>{l(
                  "Our vision is to build a strong regional platform connecting students, young professionals, researchers, academics and practitioners across the Middle East and North Africa, creating meaningful opportunities for dialogue, research, leadership, professional development and institutional cooperation.",
                  "تتمثل رؤيتنا في بناء منصة إقليمية قوية تربط الطلاب والمهنيين الشباب والباحثين والأكاديميين والممارسين في الشرق الأوسط وشمال أفريقيا، وتوفر فرصًا هادفة للحوار والبحث والقيادة والتطوير المهني والتعاون المؤسسي."
                )}</p>
                <p>{l(
                  "We believe young people should not only participate in conversations about the region’s future, but help shape them. Our work creates spaces where ideas become research, research informs policy and regional connections lead to lasting impact.",
                  "نؤمن بأن دور الشباب لا يقتصر على المشاركة في النقاشات المتعلقة بمستقبل المنطقة، بل يجب أن يسهموا في صياغته. لذلك نعمل على إنشاء مساحات تتحول فيها الأفكار إلى بحوث، وتسترشد السياسات بالبحوث، وتقود الروابط الإقليمية إلى أثر مستدام."
                )}</p>
                <p>{l(
                  "We look forward to expanding IAPSS MENA’s opportunities, partnerships and impact across the region.",
                  "نتطلع إلى توسيع فرص IAPSS MENA وشراكاتها وأثرها في أنحاء المنطقة."
                )}</p>
                <p className="border-t border-white/15 pt-5 text-base font-bold text-white">Mohanad Albayati<span className="block text-sm font-medium text-white/60">IAPSS MENA</span></p>
              </div>
            </div>
          </article>

          <h3 className="mb-6 mt-14 font-serif text-2xl font-medium text-brand">{l("Leadership team", "فريق القيادة")}</h3>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["MA", l("IAPSS MENA Chair", "رئيس IAPSS MENA"), "Mohanad Albayati", l("MA in International Relations and Strategic Security — Jindal School of International Affairs, O.P. Jindal Global University.", "ماجستير في العلاقات الدولية والأمن الاستراتيجي — كلية جندال للشؤون الدولية، جامعة O.P. Jindal Global."), "mena@iapss.org"],
              ["JA", l("Deputy Chair", "نائبة الرئيس"), "Joelle Abou Nader", l("MA in International Relations — University of Massachusetts Boston.", "ماجستير في العلاقات الدولية — جامعة ماساتشوستس بوسطن."), "deputy.mena@iapss.org"],
              ["DZ", l("Media Director", "مديرة الإعلام"), "Dana Zantout", l("BA in Journalism and International Media — Lebanese American University (LAU).", "بكالوريوس في الصحافة والإعلام الدولي — الجامعة اللبنانية الأميركية (LAU)."), "media.mena@iapss.org"],
            ].map(([ini, role, name, bio, email]) => (
              <Tilt key={email} className="h-full">
                <article className="group flex h-full flex-col rounded-3xl border border-brand/10 bg-white p-7 transition-shadow hover:shadow-[0_26px_60px_rgba(6,26,59,.12)]">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-500 font-serif text-xl font-medium text-white">{ini}</div>
                  <div className="mt-5 text-xs font-bold uppercase tracking-[.14em] text-teal2">{role}</div>
                  <h4 className="mt-1 font-serif text-2xl font-medium text-brand">{name}</h4>
                  <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{bio}</p>
                  <a href={`mailto:${email}`} className="mt-5 inline-block rounded-full bg-brand/5 px-4 py-2 text-sm font-bold text-brand transition hover:bg-brand hover:text-white" dir="ltr">{email}</a>
                </article>
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      {/* OPPORTUNITIES */}
      <section id="opportunities" className="bg-white py-24 md:py-28">
        <div className={wrap}>
          <div className="mb-10">
            {eyebrow(l("Get involved", "شارك معنا"))}
            <h2 className={h2cls}>{l("Opportunities", "الفرص")}</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <article className="flex flex-col rounded-[2rem] border border-brand/10 bg-paper p-8 md:p-10">
              <span className="w-fit rounded-full bg-amber-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-700">{soon}</span>
              <h3 className="mt-5 font-serif text-3xl font-medium text-brand md:text-4xl">{l("Leadership Program", "برنامج القيادة")}</h3>
              <p className="mt-4 leading-8 text-slate-600">{l(
                "An upcoming leadership development program for political science students and young professionals across the region.",
                "برنامج قادم لتنمية مهارات القيادة لدى طلاب العلوم السياسية والمهنيين الشباب في المنطقة."
              )}</p>
              <p className="mt-4 text-sm font-bold text-brand/70">{tba}</p>
              <p className="mt-auto pt-8 text-sm text-slate-500">{l(
                "Registration information will be added here only when an official link is published.",
                "ستُضاف معلومات التسجيل هنا فقط عند نشر رابط رسمي."
              )}</p>
            </article>

            <article className="flex flex-col overflow-hidden rounded-[2rem] border border-brand/10 bg-paper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/best-diplomats.jpg" alt="Best Diplomats" loading="lazy" className="aspect-[16/9] w-full object-cover" />
              <div className="flex flex-1 flex-col p-8 md:p-10">
                <span className="w-fit rounded-full bg-brand/5 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-brand">{l("Member benefit", "ميزة للأعضاء")}</span>
                <h3 className="mt-5 font-serif text-3xl font-medium text-brand md:text-4xl">{l("Exclusive Member Benefit with Best Diplomats", "ميزة حصرية للأعضاء مع Best Diplomats")}</h3>
                <p className="mt-4 leading-8 text-slate-600">{l(
                  "Eligible members may request discounted rates for the Best Diplomats Türkiye Conference and the Best Diplomats UN Immersion Program.",
                  "يمكن للأعضاء المؤهلين طلب أسعار مخفّضة لمؤتمر Best Diplomats في تركيا وبرنامج Best Diplomats للانغماس في الأمم المتحدة."
                )}</p>
                <a href={mail("Request for IAPSS MENA Member Discount Code")} className={`${btnCyan} mt-6 w-fit`}>{l("Request discount code", "اطلب رمز الخصم")}</a>
                <p className="mt-6 rounded-2xl bg-white p-5 text-xs leading-6 text-slate-600">
                  <b className="text-brand">{l("Important notice. ", "ملاحظة مهمة. ")}</b>
                  {l(
                    "All programs are independently organized and managed by Best Diplomats. Registration, payment, fees, refunds, participation and all program matters are handled directly by Best Diplomats. IAPSS MENA does not collect payments, process registrations, sell packages or provide program services. Its role is limited to facilitating access to the discount for eligible members, and the code creates no financial obligation for IAPSS MENA.",
                    "جميع البرامج تُنظَّم وتُدار بشكل مستقل من قبل Best Diplomats. التسجيل والدفع والرسوم والاسترداد والمشاركة وكل ما يتعلق بالبرامج تتم مباشرة عبر Best Diplomats. لا يجمع IAPSS MENA أي مدفوعات ولا يعالج التسجيلات ولا يبيع حزمًا ولا يقدم خدمات البرامج. يقتصر دوره على تسهيل الحصول على الخصم للأعضاء المؤهلين، ولا ينشئ الرمز أي التزام مالي على IAPSS MENA."
                  )}
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-24 md:py-28">
        <div className={wrap}>
          <div className="mb-10">
            {eyebrow(l("What we have done", "ما أنجزناه"))}
            <h2 className={h2cls}>{l("Our projects", "مشاريعنا")}</h2>
          </div>

          <article className="grid gap-10 rounded-[2rem] border border-brand/10 bg-white p-6 md:p-10 lg:grid-cols-[.72fr_1.28fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/policy-brief.jpg" alt={l("IAPSS MENA Policy Brief Competition 2026", "مسابقة موجز السياسات 2026")} loading="lazy" className="w-full rounded-3xl border border-brand/10 object-cover shadow-xl" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand/5 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-brand">{l("Research competition", "مسابقة بحثية")}</span>
                <span className="rounded-full bg-slate-100 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">{l("Submissions closed", "انتهى التقديم")}</span>
              </div>
              <h3 className="mt-5 font-serif text-3xl font-medium leading-tight text-brand md:text-5xl">{l("IAPSS MENA Policy Brief Competition 2026", "مسابقة موجز السياسات 2026")}</h3>

              <dl className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  [l("Theme", "الموضوع"), "Comparative Perspectives on Governance and Political Change in the MENA Region"],
                  [l("Submission", "المطلوب"), l("Policy brief · 1,000–1,500 words", "موجز سياسات · 1,000–1,500 كلمة")],
                  [l("Language", "اللغة"), "English"],
                  [l("Deadline", "الموعد النهائي"), l("1 October 2026", "1 أكتوبر 2026")],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-2xl bg-paper p-4">
                    <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{k}</dt>
                    <dd className="mt-1 text-sm font-bold text-brand" dir={v.startsWith("Comparative") ? "ltr" : undefined}>{v}</dd>
                  </div>
                ))}
              </dl>

              <div role="tablist" className="mt-8 flex flex-wrap gap-2 border-b border-brand/10 pb-4">
                {pbTabs.map(([k, label]) => (
                  <button key={k} role="tab" aria-selected={pbTab === k} onClick={() => setPbTab(k)}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition ${pbTab === k ? "bg-brand text-white" : "text-brand/70 hover:bg-brand/5 hover:text-brand"}`}>{label}</button>
                ))}
              </div>
              <div key={pbTab} className="fade-up mt-6 min-h-[170px]">
                {pbTab === "overview" && (
                  <p className="leading-8 text-slate-600">{l(
                    "An IAPSS MENA initiative in collaboration with the Comparative Politics Student Research Committee (CPSRC). An opportunity for students and emerging researchers to turn evidence-based analysis into practical recommendations on governance and political change in MENA.",
                    "مبادرة من IAPSS MENA بالتعاون مع لجنة البحث الطلابية للسياسة المقارنة (CPSRC). فرصة للطلاب والباحثين الشباب لتحويل التحليل القائم على الأدلة إلى توصيات عملية حول الحوكمة والتغيير السياسي في المنطقة."
                  )}</p>
                )}
                {pbTab === "apply" && (
                  <p className="leading-8 text-slate-600">{l(
                    "University students, graduates, young researchers and emerging scholars. The policy brief had to be original, unpublished and include evidence-based analysis with practical recommendations.",
                    "طلاب الجامعات، الخريجون، الباحثون الشباب والباحثون الصاعدون. يجب أن يكون موجز السياسات أصليًا وغير منشور ويتضمن تحليلًا قائمًا على الأدلة وتوصيات عملية."
                  )}</p>
                )}
                {pbTab === "areas" && (
                  <div className="flex flex-wrap gap-2">
                    {RESEARCH_AREAS.map(([en, ar]) => (
                      <span key={en} className="rounded-full border border-brand/15 bg-paper px-3.5 py-1.5 text-sm text-slate-700">{l(en, ar)}</span>
                    ))}
                  </div>
                )}
                {pbTab === "review" && (
                  <div className="space-y-4 leading-8 text-slate-600">
                    <p>{l(
                      "Submissions underwent double screening by CPSRC and IAPSS MENA members. AI tools could be used for language or editorial assistance when disclosed; substantive use had to be disclosed in accordance with the announcement policy.",
                      "تخضع المشاركات لتقييم مزدوج من CPSRC وأعضاء IAPSS MENA. يمكن استخدام أدوات الذكاء الاصطناعي للمساعدة اللغوية أو التحريرية بشرط الإفصاح عنها، ويجب الإفصاح عن أي استخدام جوهري وفق السياسة الموضحة في الإعلان."
                    )}</p>
                    <p className="rounded-2xl bg-paper p-4 text-sm"><b className="text-brand">{l("Awards: ", "الجوائز: ")}</b>{l("recognition for the winner, first runner-up and second runner-up.", "تكريم الفائز والمركز الأول والمركز الثاني.")}</p>
                  </div>
                )}
              </div>
            </div>
          </article>

          <div className="mt-6"><SiteSection kind="project" empty="" /></div>
        </div>
      </section>

      {/* IAPSS GLOBAL PROGRAMS */}
      <section className="bg-white py-24 md:py-28">
        <div className={`${wrap} grid items-start gap-14 lg:grid-cols-2`}>
          <div className="relative lg:sticky lg:top-28">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/delegations.jpg" alt="IAPSS Delegations" loading="lazy" className="aspect-square w-full rounded-[2rem] object-cover shadow-2xl" />
            <span className="absolute bottom-6 start-6 rounded-full bg-white px-4 py-2 text-[11px] font-black tracking-[.14em] text-brand shadow-lg">IAPSS GLOBAL</span>
          </div>
          <div>
            {eyebrow(l("Global pathways", "مسارات عالمية"))}
            <h2 className={h2cls}>{l("Academic programs", "البرامج الأكاديمية")}</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">{l(
              "IAPSS Global programs provide pathways for research, academic exchange, delegations and international cooperation, with direct links to their official pages.",
              "تتيح برامج IAPSS Global مسارات للبحث والتبادل الأكاديمي والوفود والتعاون الدولي، ويقدّم الموقع روابطها الرسمية مباشرة."
            )}</p>
            <ul className="mt-8 space-y-3">
              {programs.map(([t, d, href]) => (
                <li key={t}>
                  <a href={href} target="_blank" rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-5 rounded-3xl border border-brand/10 bg-paper p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan hover:bg-white hover:shadow-[0_20px_50px_rgba(6,26,59,.1)]">
                    <span className="max-w-md">
                      <span className="text-[11px] font-bold uppercase tracking-[.14em] text-teal2">IAPSS Global</span>
                      <strong className="mt-1 block font-serif text-xl font-medium text-brand">{t}</strong>
                      <span className="mt-1 block text-sm leading-6 text-slate-600">{d}</span>
                    </span>
                    <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-brand/5 text-lg text-brand transition group-hover:bg-brand group-hover:text-white">{rtl ? "↖" : "↗"}</span>
                  </a>
                </li>
              ))}
            </ul>
            <a href="https://iapss.org/iapss-mena/" target="_blank" rel="noopener noreferrer" className={`${btnCyan} mt-8 inline-block`}>IAPSS MENA · iapss.org</a>
          </div>
        </div>
      </section>

      {/* PUBLICATIONS */}
      <section id="publications" className="py-24 md:py-28">
        <div className={wrap}>
          <div className="mb-10">
            {eyebrow(l("Knowledge", "المعرفة"))}
            <h2 className={h2cls}>{l("Journals & publications", "المجلات والمنشورات")}</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {publications.map(([t, d, href], i) => (
              <article key={t} className="group flex flex-col rounded-[2rem] border border-brand/10 bg-white p-8 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_60px_rgba(6,26,59,.12)]">
                <span className="font-serif text-6xl font-medium text-teal2/30">0{i + 1}</span>
                <div className="mt-4 text-[11px] font-bold uppercase tracking-[.14em] text-slate-400">IAPSS Global</div>
                <h3 className="mt-1 font-serif text-2xl font-medium text-brand">{t}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{d}</p>
                <a href={href} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-brand/5 px-5 py-2.5 text-sm font-bold text-brand transition group-hover:bg-brand group-hover:text-white">{l("Visit platform", "زيارة المنصة")} <span>{rtl ? "↖" : "↗"}</span></a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section id="partners" className="bg-white py-24 md:py-28">
        <div className={wrap}>
          <div className="mb-10">
            {eyebrow(l("Together", "معًا"))}
            <h2 className={h2cls}>{l("Our partnerships", "شراكاتنا")}</h2>
          </div>
          <SiteSection kind="partner" empty={l("Our partners will be listed here soon.", "سيتم عرض شركائنا هنا قريبًا.")} />

          <div className="mt-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                {eyebrow("IAPSS Global")}
                <h3 className="mt-4 font-serif text-3xl font-medium text-brand md:text-4xl">{l("Partners of IAPSS Global", "شركاء IAPSS Global")}</h3>
              </div>
              <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
                <input type="search" value={q} onChange={(e) => setQ(e.target.value)} aria-label={l("Search partners", "ابحث في الشركاء")}
                  placeholder={l("Search partners…", "ابحث في الشركاء…")}
                  className="w-full rounded-full border border-brand/15 bg-paper px-5 py-3 sm:w-64 text-sm outline-none transition focus:border-cyan focus:ring-4 focus:ring-cyan/15" />
                <span className="whitespace-nowrap rounded-full bg-brand/5 px-4 py-3 text-xs font-bold text-brand" aria-live="polite">
                  {q.trim() ? `${filteredPartners.length} / ${GLOBAL_PARTNERS.length}` : GLOBAL_PARTNERS.length} {l("organisations", "جهة")}
                </span>
              </div>
            </div>
            <p className="mt-5 max-w-3xl rounded-2xl bg-paper px-5 py-4 text-sm leading-7 text-slate-600">{l(
              "Organizations listed on the official IAPSS Global partners page. These organizations are partners of IAPSS Global and are not automatically attributed to IAPSS MENA.",
              "الجهات المدرجة في صفحة شركاء IAPSS Global الرسمية. هذه الجهات شركاء لـ IAPSS Global ولا تُنسب تلقائيًا إلى IAPSS MENA."
            )}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPartners.map(([name, url]) => (
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
            {filteredPartners.length === 0 && (
              <p className="mt-8 rounded-3xl border border-dashed border-brand/20 p-8 text-center text-slate-500">{l("No partner matches your search.", "لا توجد جهة مطابقة لبحثك.")}</p>
            )}
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section id="news" className="py-24 md:py-28">
        <div className={wrap}>
          <div className="mb-10">
            {eyebrow(l("Updates", "المستجدات"))}
            <h2 className={h2cls}>{l("News", "الأخبار")}</h2>
            <p className="mt-4 max-w-2xl text-slate-600">{l("News and institutional updates from the regional chapter.", "أخبار الفرع الإقليمي وتحديثاته المؤسسية.")}</p>
          </div>
          <SiteSection kind="news" empty={
            <div className="rounded-[2rem] border border-dashed border-brand/20 bg-white p-10 text-center">
              <p className="mx-auto max-w-xl text-slate-600">{l(
                "No news articles have been published yet. Explore current programs and events or visit our publications.",
                "لا توجد أخبار منشورة حاليًا. يمكنك الاطلاع على البرامج والفعاليات الحالية أو زيارة مساحة المنشورات."
              )}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a href="#events" className={btnPrimary}>{l("Programs & events", "البرامج والفعاليات")}</a>
                <a href="#publications" className={btnGhost}>{l("Publications", "المنشورات")}</a>
              </div>
            </div>
          } />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white py-24 md:py-28">
        <div className={`${wrap} grid gap-12 lg:grid-cols-[.8fr_1.2fr]`}>
          <div>
            {eyebrow(l("Questions", "أسئلة"))}
            <h2 className={h2cls}>{l("Frequently asked questions", "الأسئلة الشائعة")}</h2>
            <p className="mt-5 text-slate-600">
              {l("Can't find your answer? Ask MENA in the corner, or write to ", "لم تجد إجابتك؟ اسأل MENA في الزاوية، أو راسلنا على ")}
              <a href={`mailto:${CONTACT}`} className="font-bold text-brand underline-offset-4 hover:underline" dir="ltr">{CONTACT}</a>.
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map(([question, answer], i) => (
              <div key={i} className={`rounded-3xl border transition ${faq === i ? "border-cyan/50 bg-paper" : "border-brand/10 bg-white"}`}>
                <button onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i}
                  className="flex w-full items-center justify-between gap-6 px-7 py-5 text-start font-serif text-lg font-medium text-brand">
                  <span>{question}</span>
                  <span aria-hidden className={`grid h-9 w-9 flex-none place-items-center rounded-full text-xl leading-none transition ${faq === i ? "bg-brand text-white" : "bg-brand/5 text-brand"}`}>{faq === i ? "−" : "+"}</span>
                </button>
                <div className="acc" data-open={faq === i}>
                  <div className="overflow-hidden"><p className="px-7 pb-6 pe-16 leading-8 text-slate-600">{answer}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COLLABORATION + JOIN */}
      <section id="contact" className="px-3 py-24 md:px-6 md:py-28">
        <div data-spot className="spot relative mx-auto max-w-[1280px] overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#04142f] via-[#0a2a57] to-[#0b5f6a] p-8 text-white md:p-14">
          <div className="pattern-dark pointer-events-none absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom_left,black,transparent_65%)]" />
          <div className="relative grid gap-12 lg:grid-cols-[1.15fr_.85fr]">
            <div>
              {eyebrow(l("Institutional collaboration", "التعاون المؤسسي"), true)}
              <h2 className="mt-6 max-w-2xl font-serif text-[clamp(2.4rem,5vw,4.6rem)] font-medium leading-[1.04]">{l("Let's build stronger", "لنبنِ حوارًا")} <span className="italic text-sky">{l("regional dialogue.", "إقليميًا أقوى.")}</span></h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">{l(
                "We welcome dialogue with universities, research centers, international institutions, diplomatic bodies and relevant organizations.",
                "نرحب بالتواصل مع الجامعات ومراكز البحوث والمؤسسات الدولية والجهات الدبلوماسية والمنظمات ذات الصلة."
              )}</p>
              <p className="mt-3 text-sm text-white/60">{l("For collaboration, media inquiries and participation opportunities, use the official email.", "للتعاون والاستفسارات الإعلامية وفرص المشاركة، استخدم البريد الرسمي.")}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={mail("Collaboration and partnerships")} className={btnLight}>{l("Collaboration & partnerships", "تعاون وشراكات")}</a>
                <a href={mail("Media")} className={btnOutlineLight}>{l("Media", "إعلام")}</a>
                <a href={mail("General inquiry")} className={btnOutlineLight}>{l("General inquiry", "استفسار عام")}</a>
              </div>
              <p className="mt-6 text-sm font-semibold text-white/80" dir="ltr">{CONTACT}</p>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/10 p-7 backdrop-blur-xl">
              <h3 className="font-serif text-2xl font-medium">{l("Are you an IAPSS MENA member?", "هل أنت عضو في IAPSS MENA؟")}</h3>
              <p className="mt-2 text-sm text-white/70">{l("Sign in to your space, or ask to join. Every request is reviewed by an admin.", "سجّل الدخول إلى مساحتك أو اطلب الانضمام. يراجع المشرف كل طلب.")}</p>
              <ol className="mt-6 space-y-4">
                {[
                  [l("Create your account", "أنشئ حسابك"), l("Fill in your name and email.", "أدخل اسمك وبريدك الإلكتروني.")],
                  [l("An admin reviews it", "يراجعه المشرف"), l("They approve or decline your request.", "يوافق على طلبك أو يرفضه.")],
                  [l("Enter the platform", "ادخل المنصة"), l("Join your group, follow tasks and chat with the team.", "انضم إلى مجموعتك وتابع المهام وتحدث مع الفريق.")],
                ].map(([t, d], i) => (
                  <li key={i} className="flex gap-4 text-sm">
                    <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-white/15 font-serif text-base text-sky">{i + 1}</span>
                    <div><div className="font-semibold">{t}</div><div className="text-white/65">{d}</div></div>
                  </li>
                ))}
              </ol>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/login" className={btnLight}>{l("Sign in", "تسجيل الدخول")}</Link>
                <Link href="/signup" className={btnOutlineLight}>{l("Request to join", "اطلب الانضمام")}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative overflow-hidden rounded-t-[2.5rem] bg-[#04142f] pt-20 text-[#9fb3ca]">
        <div className={`${wrap} grid gap-12 md:grid-cols-[1.35fr_repeat(3,.7fr)]`}>
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
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[.16em] text-white">{l("Regional platform", "المنصة الإقليمية")}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#about" className="hover:text-white">{l("About", "من نحن")}</a></li>
              <li><a href="#team" className="hover:text-white">{l("Leadership", "القيادة")}</a></li>
              <li><a href="#events" className="hover:text-white">{l("Programs & events", "البرامج والفعاليات")}</a></li>
              <li><a href="#opportunities" className="hover:text-white">{l("Opportunities", "الفرص")}</a></li>
              <li><a href="#news" className="hover:text-white">{l("News", "الأخبار")}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[.16em] text-white">{l("Knowledge & collaboration", "المعرفة والتعاون")}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="https://iapss.org/" target="_blank" rel="noopener noreferrer" className="hover:text-white">{l("IAPSS Global programs", "برامج IAPSS Global")}</a></li>
              <li><a href="#publications" className="hover:text-white">{l("Publications", "المنشورات")}</a></li>
              <li><a href="#partners" className="hover:text-white">{l("Partnerships", "الشراكات")}</a></li>
              <li><a href="#contact" className="hover:text-white">{l("Contact", "تواصل معنا")}</a></li>
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
        <div className={`${wrap} flex flex-wrap items-center justify-between gap-3 border-t border-white/10 py-6 text-xs`}>
          <span>© 2026 IAPSS MENA · {l("A regional chapter within IAPSS Global", "فرع إقليمي ضمن IAPSS Global")}</span>
          <span className="font-semibold tracking-wide text-white/80">{l("Ideas · People · Dialogue · Change", "أفكار · أشخاص · حوار · تغيير")}</span>
        </div>
      </footer>

      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label={l("Back to top", "العودة للأعلى")}
        className={`fixed bottom-5 start-4 z-50 rounded-full bg-brand px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xl transition duration-300 hover:bg-brand-500 ${showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}>
        ↑ {l("Top", "أعلى")}
      </button>
      <Chatbot context="public" />
    </main>
  );
}
