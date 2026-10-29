"use client";
import { useRef, useState } from "react";
import SiteSection from "@/components/SiteSection";
import { useLang } from "@/components/Lang";
import {
  mail, wrap, h2cls, btnCyan, RESEARCH_AREAS, Eyebrow, PageHero, SubNav, EventCard, useEvents,
} from "../shared";

export default function ProgramsPage() {
  const { l, rtl } = useLang();
  const events = useEvents();
  const [evFilter, setEvFilter] = useState<"all" | "soon" | "partner" | "ended">("all");
  const [pbTab, setPbTab] = useState<"overview" | "apply" | "areas" | "review">("overview");
  const carousel = useRef<HTMLDivElement>(null);
  const soon = l("Coming soon", "قريبًا");
  const tba = l("Official date to be announced", "سيُعلن الموعد رسميًا");

  const scrollCarousel = (dir: 1 | -1) =>
    carousel.current?.scrollBy({ left: dir * (rtl ? -1 : 1) * 420, behavior: "smooth" });

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
  const pbTabs: ["overview" | "apply" | "areas" | "review", string][] = [
    ["overview", l("Overview", "نظرة عامة")], ["apply", l("Who could apply", "من يمكنه التقديم")],
    ["areas", l("Research areas", "مجالات البحث")], ["review", l("Review & awards", "التقييم والجوائز")],
  ];

  return (
    <>
      <PageHero
        eyebrow={l("Programs", "البرامج")}
        title={l("Programs, events & opportunities", "البرامج والفعاليات والفرص")}
        lead={l("Opportunities for knowledge and connection.", "فرص تصنع المعرفة والتواصل.")}
      />
      <SubNav items={[
        ["#events", l("Events", "الفعاليات")], ["#opportunities", l("Opportunities", "الفرص")], ["#projects", l("Projects", "المشاريع")],
        ["#global", l("IAPSS Global programs", "برامج IAPSS Global")], ["#publications", l("Publications", "المنشورات")],
      ]} />

      {/* EVENTS: carousel */}
      <section id="events" className="py-20">
        <div className={wrap}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>{l("Now at IAPSS MENA", "الآن في IAPSS MENA")}</Eyebrow>
              <h2 className={h2cls}>{l("Programs & events", "البرامج والفعاليات")}</h2>
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
          {events.filter((e) => evFilter === "all" || e.cat === evFilter).map((c, i) => (
            <EventCard key={c.title} c={c} i={i} className="w-[min(380px,84vw)] shrink-0 snap-start" />
          ))}
        </div>
      </section>

      {/* OPPORTUNITIES */}
      <section id="opportunities" className="bg-white py-24">
        <div className={wrap}>
          <div className="mb-10">
            <Eyebrow>{l("Get involved", "شارك معنا")}</Eyebrow>
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
      <section id="projects" className="py-24">
        <div className={wrap}>
          <div className="mb-10">
            <Eyebrow>{l("What we have done", "ما أنجزناه")}</Eyebrow>
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
      <section id="global" className="bg-white py-24">
        <div className={`${wrap} grid items-start gap-14 lg:grid-cols-2`}>
          <div className="relative lg:sticky lg:top-28">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/delegations.jpg" alt="IAPSS Delegations" loading="lazy" className="aspect-square w-full rounded-[2rem] object-cover shadow-2xl" />
            <span className="absolute bottom-6 start-6 rounded-full bg-white px-4 py-2 text-[11px] font-black tracking-[.14em] text-brand shadow-lg">IAPSS GLOBAL</span>
          </div>
          <div>
            <Eyebrow>{l("Global pathways", "مسارات عالمية")}</Eyebrow>
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
      <section id="publications" className="py-24">
        <div className={wrap}>
          <div className="mb-10">
            <Eyebrow>{l("Knowledge", "المعرفة")}</Eyebrow>
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
    </>
  );
}
