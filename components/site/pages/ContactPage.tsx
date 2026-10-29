"use client";
import Link from "next/link";
import { useLang } from "@/components/Lang";
import { CONTACT, mail, wrap, btnLight, btnOutlineLight, Eyebrow, PageHero } from "../shared";

export default function ContactPage() {
  const { l } = useLang();
  const people: [string, string, string][] = [
    [l("Chair", "الرئيس"), "Mohanad Albayati", "mena@iapss.org"],
    [l("Deputy Chair", "نائبة الرئيس"), "Joelle Abou Nader", "deputy.mena@iapss.org"],
    [l("Media Director", "مديرة الإعلام"), "Dana Zantout", "media.mena@iapss.org"],
  ];
  return (
    <>
      <PageHero
        eyebrow={l("Contact", "تواصل معنا")}
        title={l("Let's build stronger regional dialogue.", "لنبنِ حوارًا إقليميًا أقوى.")}
        lead={l(
          "We welcome dialogue with universities, research centers, international institutions, diplomatic bodies and relevant organizations.",
          "نرحب بالتواصل مع الجامعات ومراكز البحوث والمؤسسات الدولية والجهات الدبلوماسية والمنظمات ذات الصلة."
        )}
      />

      <section className={`${wrap} py-20`}>
        <div data-spot className="spot relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#04142f] via-[#0a2a57] to-[#0b5f6a] p-8 text-white md:p-14">
          <div className="pattern-dark pointer-events-none absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom_left,black,transparent_65%)]" />
          <div className="relative grid gap-12 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <Eyebrow dark>{l("Institutional collaboration", "التعاون المؤسسي")}</Eyebrow>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">{l(
                "For collaboration, media inquiries and participation opportunities, use the official email. Choose the subject that fits and your message opens ready to send.",
                "للتعاون والاستفسارات الإعلامية وفرص المشاركة، استخدم البريد الرسمي. اختر الموضوع المناسب وستفتح رسالتك جاهزة للإرسال."
              )}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={mail("Collaboration and partnerships")} className={btnLight}>{l("Collaboration & partnerships", "تعاون وشراكات")}</a>
                <a href={mail("Media")} className={btnOutlineLight}>{l("Media", "إعلام")}</a>
                <a href={mail("General inquiry")} className={btnOutlineLight}>{l("General inquiry", "استفسار عام")}</a>
              </div>
              <p className="mt-6 text-sm font-semibold text-white/80" dir="ltr">{CONTACT}</p>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/10 p-7 backdrop-blur-xl">
              <h2 className="font-serif text-2xl font-medium">{l("Leadership contacts", "التواصل مع القيادة")}</h2>
              <ul className="mt-5 divide-y divide-white/10">
                {people.map(([role, name, email]) => (
                  <li key={email} className="py-4">
                    <div className="text-[11px] font-bold uppercase tracking-[.14em] text-sky">{role}</div>
                    <div className="mt-1 font-semibold">{name}</div>
                    <a href={`mailto:${email}`} className="text-sm text-white/70 underline-offset-4 hover:text-white hover:underline" dir="ltr">{email}</a>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
                <a href="https://www.linkedin.com/company/iapssmenaofficial" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white hover:underline">LinkedIn</a>
                <a href="https://www.instagram.com/iapss.mena/" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white hover:underline">Instagram</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Link href="/get-involved" className="group rounded-[2rem] border border-brand/10 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(6,26,59,.12)]">
            <h3 className="font-serif text-2xl font-medium text-brand">{l("Want to join us?", "هل تريد الانضمام إلينا؟")}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">{l("See how joining works and send your request.", "اطّلع على طريقة الانضمام وأرسل طلبك.")}</p>
          </Link>
          <Link href="/volunteer" className="group rounded-[2rem] bg-cyan p-8 text-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(0,174,180,.35)]">
            <h3 className="font-serif text-2xl font-medium">{l("Want to help?", "هل تريد المساعدة؟")}</h3>
            <p className="mt-2 text-sm leading-7 text-white/90">{l("Volunteer with us: see the open roles.", "تطوّع معنا: اطّلع على الأدوار المتاحة.")}</p>
          </Link>
        </div>
      </section>
    </>
  );
}
