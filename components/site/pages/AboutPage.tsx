"use client";
import Tilt from "@/components/Tilt";
import { useLang } from "@/components/Lang";
import { wrap, h2cls, Eyebrow, PageHero, SubNav } from "../shared";

export default function AboutPage() {
  const { l } = useLang();
  return (
    <>
      <PageHero
        eyebrow={l("About", "من نحن")}
        title={l("Where knowledge meets practice.", "منصة تجمع المعرفة بالممارسة.")}
        lead={l("The Middle East and North Africa Regional Chapter of the International Association for Political Science Students.", "الفرع الإقليمي للشرق الأوسط وشمال أفريقيا للرابطة الدولية لطلاب العلوم السياسية.")}
      />
      <SubNav items={[["#about", l("Our role", "دورنا")], ["#leadership", l("Leadership", "القيادة")]]} />

      {/* ABOUT: bento */}
      <section id="about" className={`${wrap} py-20`}>
        <div className="grid gap-4 lg:grid-cols-12">
          <article data-spot className="spot relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#04142f] to-[#0a2a57] p-8 text-white md:p-10 lg:col-span-7 lg:row-span-2">
            <div className="pattern-dark pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom_left,black,transparent_60%)]" />
            <div className="relative">
              <Eyebrow dark>{l("Our regional role", "دورنا الإقليمي")}</Eyebrow>
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

      {/* LEADERSHIP */}
      <section id="leadership" className="pb-12 pt-8">
        <div className={wrap}>
          <div className="mb-10">
            <Eyebrow>{l("The people", "الأشخاص")}</Eyebrow>
            <h2 className={h2cls}>{l("Leadership", "القيادة")}</h2>
          </div>

          <article data-spot className="spot relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#04142f] to-[#0a2a57] p-8 text-white md:p-14">
            <div className="pattern-dark pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom_left,black,transparent_55%)]" />
            <div className="relative grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
              <div>
                <Eyebrow dark>{l("Message from the Chair", "رسالة الرئيس")}</Eyebrow>
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
    </>
  );
}
