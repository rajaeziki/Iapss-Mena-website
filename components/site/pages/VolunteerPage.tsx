"use client";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { VolunteerRole } from "@/lib/types";
import { useLang } from "@/components/Lang";
import { CONTACT, mail, wrap, h2cls, btnCyan, btnPrimary, Eyebrow, PageHero } from "../shared";

const field = "w-full rounded-2xl border border-brand/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan focus:ring-4 focus:ring-cyan/15";
const label = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500";

export default function VolunteerPage() {
  const { l } = useLang();
  const [roles, setRoles] = useState<VolunteerRole[] | null>(null);
  const [team, setTeam] = useState("all");
  const [roleId, setRoleId] = useState("");

  const [f, setF] = useState({ full_name: "", email: "", country: "", university: "", languages: "", availability: "", motivation: "", website: "" });
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const [sendFailed, setSendFailed] = useState(false);

  useEffect(() => {
    supabase.from("volunteer_roles").select("*").order("status", { ascending: false }).order("sort").order("created_at")
      .then(({ data }) => setRoles((data ?? []) as VolunteerRole[]));
  }, []);

  const teams = useMemo(() => Array.from(new Set((roles ?? []).map((r) => r.team).filter(Boolean))), [roles]);
  const shown = (roles ?? []).filter((r) => team === "all" || r.team === team);
  const openRoles = (roles ?? []).filter((r) => r.status === "open");
  const chosen = (roles ?? []).find((r) => r.id === roleId);

  function apply(id: string) {
    setRoleId(id);
    setDone(false);
    setTimeout(() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setSendFailed(false);
    if (f.website) { setDone(true); return; } // spam trap: real people leave this hidden field empty
    if (f.motivation.trim().length < 20) return setErr(l("Please tell us a little more (at least 20 characters).", "يرجى إخبارنا بالمزيد (20 حرفًا على الأقل)."));
    if (!consent) return setErr(l("Please accept the privacy note to continue.", "يرجى الموافقة على ملاحظة الخصوصية للمتابعة."));
    setBusy(true);
    const { error } = await supabase.from("volunteer_applications").insert({
      role_id: roleId || null,
      role_title: chosen?.title ?? "",
      full_name: f.full_name.trim(), email: f.email.trim(), country: f.country.trim(), university: f.university.trim(),
      languages: f.languages.trim(), availability: f.availability.trim(), motivation: f.motivation.trim(), consent: true,
    });
    setBusy(false);
    if (error) {
      setErr(l(
        "We could not send your application. Please try again, or email us directly.",
        "تعذّر إرسال طلبك. يرجى المحاولة مرة أخرى أو مراسلتنا مباشرة."
      ));
      setSendFailed(true);
      return;
    }
    setDone(true);
    setF({ full_name: "", email: "", country: "", university: "", languages: "", availability: "", motivation: "", website: "" });
    setConsent(false);
    setRoleId("");
  }

  return (
    <>
      <PageHero
        eyebrow={l("Volunteer", "التطوع")}
        title={l("Volunteer with us", "تطوّع معنا")}
        lead={l(
          "IAPSS MENA is run by students and young professionals. If you have time and skills to share, there is a place for you.",
          "يُدار IAPSS MENA بواسطة طلاب ومهنيين شباب. إن كان لديك وقت ومهارات لتشاركها، فهناك مكان لك."
        )}
      >
        <div className="flex flex-wrap gap-3">
          <a href="#roles" className="rounded-full bg-white px-7 py-3.5 text-sm font-bold text-brand transition hover:-translate-y-0.5">{l("See open roles", "الأدوار المتاحة")}</a>
          <a href="#apply" className="rounded-full border border-white/40 px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10">{l("Apply now", "قدّم الآن")}</a>
        </div>
      </PageHero>

      {/* why */}
      <section className={`${wrap} py-20`}>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [l("Build real experience", "اكتسب خبرة حقيقية"), l("Work on actual programs, events and publications of a regional chapter.", "اعمل على برامج وفعاليات ومنشورات حقيقية لفرع إقليمي.")],
            [l("Join a regional network", "انضم إلى شبكة إقليمية"), l("Work with students, researchers and young professionals across MENA.", "اعمل مع طلاب وباحثين ومهنيين شباب في أنحاء المنطقة.")],
            [l("Shape what we do", "ساهم في صياغة عملنا"), l("Volunteers help decide how ideas become research, events and impact.", "يساعد المتطوعون في تحديد كيف تتحول الأفكار إلى بحوث وفعاليات وأثر.")],
          ].map(([t, d], i) => (
            <article key={t} className={`rounded-[2rem] p-8 ${i === 1 ? "bg-cyan text-white" : "border border-brand/10 bg-white"}`}>
              <span className={`font-serif text-5xl font-medium ${i === 1 ? "text-white/50" : "text-teal2/40"}`}>0{i + 1}</span>
              <h2 className={`mt-5 font-serif text-xl font-medium ${i === 1 ? "text-white" : "text-brand"}`}>{t}</h2>
              <p className={`mt-2 text-sm leading-7 ${i === 1 ? "text-white/85" : "text-slate-600"}`}>{d}</p>
            </article>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section className="bg-white py-24">
        <div className={wrap}>
          <Eyebrow>{l("How it works", "كيف يعمل")}</Eyebrow>
          <h2 className={h2cls}>{l("From application to your first task", "من التقديم إلى أول مهمة")}</h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-4">
            {[
              [l("Choose a role", "اختر دورًا"), l("Or send an open application.", "أو أرسل طلبًا مفتوحًا.")],
              [l("Send your application", "أرسل طلبك"), l("Tell us about you and your availability.", "عرّفنا بنفسك ووقتك المتاح.")],
              [l("We get in touch", "نتواصل معك"), l("A short conversation with the team.", "حوار قصير مع الفريق.")],
              [l("Start contributing", "ابدأ المساهمة"), l("Join a group and take on tasks.", "انضم إلى مجموعة وتولَّ المهام.")],
            ].map(([t, d], i) => (
              <li key={i} className="rounded-3xl border border-brand/10 bg-paper p-7">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand font-serif text-white">{i + 1}</span>
                <h3 className="mt-4 font-serif text-lg font-medium text-brand">{t}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* roles */}
      <section id="roles" className="py-24">
        <div className={wrap}>
          <Eyebrow>{l("Where we need help", "أين نحتاج المساعدة")}</Eyebrow>
          <h2 className={h2cls}>{l("Open roles", "الأدوار المتاحة")}</h2>

          {teams.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label={l("Filter by team", "تصفية حسب الفريق")}>
              {["all", ...teams].map((t) => (
                <button key={t} role="tab" aria-selected={team === t} onClick={() => setTeam(t)}
                  className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${team === t ? "bg-brand text-white" : "border border-brand/15 bg-white text-brand hover:border-brand"}`}>
                  {t === "all" ? l("All teams", "كل الفرق") : t}
                </button>
              ))}
            </div>
          )}

          <div className="mt-8">
            {roles === null ? (
              <div className="h-40 animate-pulse rounded-3xl bg-white" />
            ) : shown.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-brand/20 bg-white p-10 text-center">
                <p className="mx-auto max-w-xl text-slate-600">{l(
                  "No specific roles are listed right now, but we always welcome offers to help. Send an open application below.",
                  "لا توجد أدوار محددة معروضة حاليًا، لكننا نرحب دائمًا بعروض المساعدة. أرسل طلبًا مفتوحًا في الأسفل."
                )}</p>
                <a href="#apply" className={`${btnCyan} mt-6 inline-block`}>{l("Send an open application", "أرسل طلبًا مفتوحًا")}</a>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {shown.map((r, i) => (
                  <article key={r.id} className={`fade-up flex flex-col rounded-[2rem] border bg-white p-7 transition duration-300 ${r.status === "open" ? "border-brand/10 hover:-translate-y-1.5 hover:shadow-[0_26px_60px_rgba(6,26,59,.12)]" : "border-brand/5 opacity-70"}`} style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="flex items-center justify-between gap-3">
                      {r.team ? <span className="rounded-full bg-brand/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand">{r.team}</span> : <span />}
                      <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${r.status === "open" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{r.status === "open" ? l("Open", "متاح") : l("Closed", "مغلق")}</span>
                    </div>
                    <h3 className="mt-4 font-serif text-2xl font-medium leading-tight text-brand">{r.title}</h3>
                    {r.description && <p className="mt-3 text-sm leading-7 text-slate-600">{r.description}</p>}
                    <dl className="mt-4 space-y-2 text-sm">
                      {r.commitment && <div><dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{l("Time commitment", "الالتزام الزمني")}</dt><dd className="font-semibold text-brand">{r.commitment}</dd></div>}
                      {r.skills && <div><dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{l("Useful skills", "مهارات مفيدة")}</dt><dd className="font-semibold text-brand">{r.skills}</dd></div>}
                    </dl>
                    {r.status === "open" && (
                      <button onClick={() => apply(r.id)} className={`${btnPrimary} mt-6 w-fit`}>{l("Apply for this role", "قدّم على هذا الدور")}</button>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* application */}
      <section id="apply" className="bg-white py-24">
        <div className={`${wrap} grid gap-12 lg:grid-cols-[.8fr_1.2fr]`}>
          <div>
            <Eyebrow>{l("Apply", "قدّم الآن")}</Eyebrow>
            <h2 className={h2cls}>{l("Tell us how you'd like to help", "أخبرنا كيف تودّ المساعدة")}</h2>
            <p className="mt-5 leading-8 text-slate-600">{l(
              "Fill in the form and the team will get back to you by email. You can pick a role or send an open application.",
              "املأ النموذج وسيتواصل معك الفريق عبر البريد الإلكتروني. يمكنك اختيار دور أو إرسال طلب مفتوح."
            )}</p>
            <p className="mt-6 rounded-2xl bg-paper p-5 text-xs leading-6 text-slate-600">
              <b className="text-brand">{l("Privacy. ", "الخصوصية. ")}</b>
              {l(
                "We use your details only to review your application and contact you. Only IAPSS MENA admins can see them. To have your application deleted, write to ",
                "نستخدم بياناتك فقط لمراجعة طلبك والتواصل معك. لا يطّلع عليها سوى مشرفي IAPSS MENA. لحذف طلبك، راسلنا على "
              )}
              <a href={`mailto:${CONTACT}`} className="font-bold text-brand underline-offset-4 hover:underline" dir="ltr">{CONTACT}</a>.
            </p>
          </div>

          <div>
            {done ? (
              <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-10">
                <h3 className="font-serif text-3xl font-medium text-emerald-900">{l("Thank you!", "شكرًا لك!")}</h3>
                <p className="mt-3 leading-8 text-emerald-900/80">{l("We received your application. The team will contact you by email.", "استلمنا طلبك. سيتواصل معك الفريق عبر البريد الإلكتروني.")}</p>
                <button onClick={() => setDone(false)} className="mt-6 rounded-full border border-emerald-300 px-6 py-3 text-sm font-bold text-emerald-900 transition hover:bg-emerald-100">{l("Send another application", "إرسال طلب آخر")}</button>
              </div>
            ) : (
              <form onSubmit={submit} className="scroll-mt-28 rounded-[2rem] border border-brand/10 bg-paper p-6 md:p-10">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className={label} htmlFor="v-role">{l("Role", "الدور")}</label>
                    <select id="v-role" className={field} value={roleId} onChange={(e) => setRoleId(e.target.value)}>
                      <option value="">{l("Open application (no specific role)", "طلب مفتوح (دون دور محدد)")}</option>
                      {openRoles.map((r) => <option key={r.id} value={r.id}>{r.title}{r.team ? ` · ${r.team}` : ""}</option>)}
                    </select>
                  </div>
                  <div><label className={label} htmlFor="v-name">{l("Full name", "الاسم الكامل")} *</label><input id="v-name" className={field} required minLength={2} maxLength={120} autoComplete="name" value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })} /></div>
                  <div><label className={label} htmlFor="v-email">{l("Email", "البريد الإلكتروني")} *</label><input id="v-email" type="email" className={field} required maxLength={200} autoComplete="email" dir="ltr" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
                  <div><label className={label} htmlFor="v-country">{l("Country", "الدولة")}</label><input id="v-country" className={field} maxLength={120} autoComplete="country-name" value={f.country} onChange={(e) => setF({ ...f, country: e.target.value })} /></div>
                  <div><label className={label} htmlFor="v-uni">{l("University or organization", "الجامعة أو المنظمة")}</label><input id="v-uni" className={field} maxLength={200} value={f.university} onChange={(e) => setF({ ...f, university: e.target.value })} /></div>
                  <div><label className={label} htmlFor="v-lang">{l("Languages", "اللغات")}</label><input id="v-lang" className={field} maxLength={200} placeholder={l("e.g. Arabic, English, French", "مثال: العربية، الإنجليزية، الفرنسية")} value={f.languages} onChange={(e) => setF({ ...f, languages: e.target.value })} /></div>
                  <div><label className={label} htmlFor="v-avail">{l("Availability", "الوقت المتاح")}</label><input id="v-avail" className={field} maxLength={300} placeholder={l("e.g. 3 hours per week", "مثال: 3 ساعات أسبوعيًا")} value={f.availability} onChange={(e) => setF({ ...f, availability: e.target.value })} /></div>
                  <div className="md:col-span-2">
                    <label className={label} htmlFor="v-msg">{l("Why would you like to volunteer?", "لماذا تودّ التطوع؟")} *</label>
                    <textarea id="v-msg" className={`${field} min-h-[140px]`} required minLength={20} maxLength={2000} value={f.motivation} onChange={(e) => setF({ ...f, motivation: e.target.value })} />
                    <p className="mt-1 text-xs text-slate-400">{f.motivation.length} / 2000</p>
                  </div>
                  {/* spam trap: hidden from people, bots tend to fill it */}
                  <div className="absolute -start-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                    <label htmlFor="v-web">Website</label>
                    <input id="v-web" tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} />
                  </div>
                  <label className="flex items-start gap-3 text-sm leading-6 text-slate-600 md:col-span-2">
                    <input type="checkbox" className="mt-1 h-5 w-5 flex-none accent-[#061a3b]" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                    <span>{l("I agree that IAPSS MENA may use these details to review my application and contact me.", "أوافق على أن يستخدم IAPSS MENA هذه البيانات لمراجعة طلبي والتواصل معي.")}</span>
                  </label>
                </div>
                {err && (
                  <p role="alert" className="mt-5 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
                    {err}{sendFailed && <> <a href={mail("Volunteer application")} className="font-bold underline">{l("Email us", "راسلنا")}</a></>}
                  </p>
                )}
                <button disabled={busy} className={`${btnCyan} mt-6 disabled:opacity-60`}>{busy ? l("Sending…", "جارٍ الإرسال…") : l("Send my application", "أرسل طلبي")}</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
