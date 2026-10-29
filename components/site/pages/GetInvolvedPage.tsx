"use client";
import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/components/Lang";
import { CONTACT, wrap, h2cls, btnPrimary, btnGhost, btnLight, Eyebrow, PageHero } from "../shared";

export default function GetInvolvedPage() {
  const { l, rtl } = useLang();
  const [faq, setFaq] = useState<number | null>(0);
  const arrow = rtl ? "←" : "→";

  const faqs: [string, string][] = [
    [l("What is IAPSS MENA?", "ما هو IAPSS MENA؟"), l(
      "IAPSS MENA is the Middle East and North Africa Regional Chapter of the International Association for Political Science Students (IAPSS). It connects students, researchers and young professionals across the region through dialogue, research and leadership.",
      "IAPSS MENA هو الفرع الإقليمي للرابطة الدولية لطلاب العلوم السياسية (IAPSS) في الشرق الأوسط وشمال أفريقيا. يربط الطلاب والباحثين والمهنيين الشباب في المنطقة عبر الحوار والبحث والقيادة.")],
    [l("How do I join?", "كيف أنضم؟"), l(
      "Choose “Request to join” and create your account. An admin reviews every request, and you get access to your group's space once it is approved.",
      "اختر «اطلب الانضمام» وأنشئ حسابك. يراجع المشرف كل طلب، وتحصل على مساحة مجموعتك بعد الموافقة.")],
    [l("Can I help without being a member?", "هل يمكنني المساعدة دون أن أكون عضوًا؟"), l(
      "Yes. Our Volunteer page lists the roles where we need help. Pick one, or send an open application.",
      "نعم. تعرض صفحة التطوع الأدوار التي نحتاج فيها إلى المساعدة. اختر دورًا أو أرسل طلبًا مفتوحًا.")],
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
      "Not automatically. The organizations on the IAPSS Global partners page are partners of IAPSS Global. IAPSS MENA's own partners are listed separately on the Partnerships page.",
      "ليس تلقائيًا. الجهات في صفحة شركاء IAPSS Global هي شركاء IAPSS Global. أما شركاء IAPSS MENA أنفسهم فيُعرضون بشكل منفصل في صفحة الشراكات.")],
  ];

  return (
    <>
      <PageHero
        eyebrow={l("Get involved", "شارك معنا")}
        title={l("Be part of IAPSS MENA", "كن جزءًا من IAPSS MENA")}
        lead={l("Join the community, or lend your skills as a volunteer. Both start here.", "انضم إلى المجتمع أو ساهم بمهاراتك كمتطوع. كلاهما يبدأ من هنا.")}
      />

      <section className={`${wrap} py-20`}>
        <div className="grid gap-5 md:grid-cols-2">
          <article className="flex flex-col rounded-[2rem] border border-brand/10 bg-white p-8 md:p-10">
            <span className="font-serif text-5xl font-medium text-teal2/40">01</span>
            <h2 className="mt-4 font-serif text-3xl font-medium text-brand">{l("Join the community", "انضم إلى المجتمع")}</h2>
            <p className="mt-3 flex-1 leading-8 text-slate-600">{l("Ask to join. An admin reviews every request, then you can follow your group's work.", "اطلب الانضمام. يراجع المشرف كل طلب، ثم يمكنك متابعة عمل مجموعتك.")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/signup" className={btnPrimary}>{l("Request to join", "اطلب الانضمام")}</Link>
              <Link href="/login" className={btnGhost}>{l("Sign in", "تسجيل الدخول")}</Link>
            </div>
          </article>
          <article className="flex flex-col rounded-[2rem] bg-cyan p-8 text-white md:p-10">
            <span className="font-serif text-5xl font-medium text-white/40">02</span>
            <h2 className="mt-4 font-serif text-3xl font-medium">{l("Volunteer with us", "تطوّع معنا")}</h2>
            <p className="mt-3 flex-1 leading-8 text-white/90">{l("See where we need help and apply for a role that fits your skills.", "اطّلع على أماكن حاجتنا للمساعدة وقدّم على الدور المناسب لمهاراتك.")}</p>
            <Link href="/volunteer" className={`${btnLight} mt-6 w-fit`}>{l("See open roles", "الأدوار المتاحة")} {arrow}</Link>
          </article>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className={wrap}>
          <Eyebrow>{l("How joining works", "كيف يتم الانضمام")}</Eyebrow>
          <h2 className={h2cls}>{l("Three simple steps", "ثلاث خطوات بسيطة")}</h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              [l("Create your account", "أنشئ حسابك"), l("Fill in your name and email.", "أدخل اسمك وبريدك الإلكتروني.")],
              [l("An admin reviews it", "يراجعه المشرف"), l("They approve or decline your request.", "يوافق على طلبك أو يرفضه.")],
              [l("Enter the platform", "ادخل المنصة"), l("Join your group, follow tasks and chat with the team.", "انضم إلى مجموعتك وتابع المهام وتحدث مع الفريق.")],
            ].map(([t, d], i) => (
              <li key={i} className="rounded-[2rem] border border-brand/10 bg-paper p-8">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-brand font-serif text-lg text-white">{i + 1}</span>
                <h3 className="mt-5 font-serif text-xl font-medium text-brand">{t}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="faq" className="py-24">
        <div className={`${wrap} grid gap-12 lg:grid-cols-[.8fr_1.2fr]`}>
          <div>
            <Eyebrow>{l("Questions", "أسئلة")}</Eyebrow>
            <h2 className={h2cls}>{l("Frequently asked questions", "الأسئلة الشائعة")}</h2>
            <p className="mt-5 text-slate-600">
              {l("Can't find your answer? Ask MENA in the corner, or write to ", "لم تجد إجابتك؟ اسأل MENA في الزاوية، أو راسلنا على ")}
              <a href={`mailto:${CONTACT}`} className="font-bold text-brand underline-offset-4 hover:underline" dir="ltr">{CONTACT}</a>.
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map(([question, answer], i) => (
              <div key={i} className={`rounded-3xl border transition ${faq === i ? "border-cyan/50 bg-white" : "border-brand/10 bg-white/60"}`}>
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
    </>
  );
}
