import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Facts come from IAPSS and from the official IAPSS MENA website. Do not add unverified claims here.
const FACTS = `The International Association for Political Science Students (IAPSS) is a global, non-profit, student-run organization representing political science students and early-career researchers. It is headquartered in Montreal, Canada, and connects over 10,000 members in more than 40 countries. Its activities include the World Congress (flagship annual academic conference; the 2026 edition took place in Vanderbijlpark, South Africa), online Model United Nations sessions, Student Research Committees, Delegations, and Politikon: The IAPSS Journal of Political Science (peer-reviewed, open access).

IAPSS MENA is the Middle East and North Africa Regional Chapter of IAPSS. It connects political science students, researchers, young professionals, universities, academic institutions and relevant organizations across MENA, supporting academic cooperation and knowledge exchange in international relations, public policy and governance, professional development and institutional partnerships. Tagline: Regional voices. Global dialogue. (Ideas, People, Dialogue, Change.)
Pillars: Research & publishing; Regional dialogue; Leadership & development.
Leadership team: Chair Mohanad Albayati (MA in International Relations and Strategic Security, Jindal School of International Affairs, O.P. Jindal Global University; mena@iapss.org); Deputy Chair Joelle Abou Nader (MA in International Relations, University of Massachusetts Boston; deputy.mena@iapss.org); Media Director Dana Zantout (BA in Journalism and International Media, Lebanese American University; media.mena@iapss.org). The Chair's message: leading IAPSS MENA at a time of profound political, social and institutional change; the vision is a strong regional platform connecting students, young professionals, researchers, academics and practitioners across MENA; young people should help shape the region's future; ideas become research, research informs policy, regional connections lead to lasting impact. Contact: pr.mena@iapss.org for collaboration, media and general inquiries. Social: LinkedIn (company/iapssmenaofficial), Instagram @iapss.mena.
Project: IAPSS MENA Policy Brief Competition 2026. Theme: Comparative Perspectives on Governance and Political Change in the MENA Region. A policy brief of 1,000-1,500 words, in English. Deadline 1 October 2026; submissions are now CLOSED. Open to university students, graduates, young researchers and emerging scholars; the brief must be original, unpublished, evidence-based with practical recommendations. An IAPSS MENA initiative in collaboration with the Comparative Politics Student Research Committee (CPSRC). Awards: recognition for the winner, first runner-up and second runner-up. Double screening by CPSRC and IAPSS MENA members; AI tools allowed for language/editorial help if disclosed.
Programs & events on the IAPSS MENA site: Arabic Political Dialogue Series (coming soon; register interest via pr.mena@iapss.org), IAPSS MENA Regional Congress (coming soon; date, venue and registration to be published once confirmed), Leadership Program (coming soon; official date to be announced), Yale Annual YGJP Conference 2026 (5-8 November 2026; an IAPSS Global partner event under the announced partnership with Yale University, NOT an IAPSS MENA-organized event), the Best Diplomats member benefit, and the Policy Brief Competition (ended).
Best Diplomats member benefit: eligible IAPSS MENA members may request discounted rates for the Best Diplomats Turkiye Conference and UN Immersion Program by emailing pr.mena@iapss.org (subject: Request for IAPSS MENA Member Discount Code). All programs are independently organized and managed by Best Diplomats, which handles registration, payment, fees and refunds; IAPSS MENA does not collect payments or process registrations and the code creates no financial obligation for IAPSS MENA.
IAPSS Global academic programs (official links on iapss.org): Student Research Committees, Seasonal Schools, Delegations, ARChive, IAPSS Think Tank. Publications: Politikon (politikon.iapss.org), Encuentro Latinoamericano (ELA, ela.iapss.org, Latin American politics) and A Different View (ADV, iapss.org/a-different-view). News: none published yet.
Partners: IAPSS MENA has signed collaborations with the American University of Sharjah and the International Studies Students Association (INSA), and offers the Best Diplomats member benefit. The organisations on the IAPSS Global partners page (e.g. UNESCO, IPSA, ISA) and the announced Yale University partnership belong to IAPSS Global, not automatically to IAPSS MENA.
How to join (community): on the site choose "Request to join" (Get involved menu, page /get-involved) and create an account with name, email and password; an admin reviews every request; once approved the person enters the platform and their group's space (tasks, chat). Signing in is at /login.
How to volunteer: open "Volunteer with us" (/volunteer): see the open roles (each shows team, time commitment, useful skills) and apply for one, or send an open application with the form (name, email, country, university, languages, availability, motivation; privacy consent required). The team contacts applicants by email; only IAPSS MENA admins see applications. People can volunteer without being members.
Payments: IAPSS MENA does NOT collect any payment or fee and does not collect money on behalf of IAPSS. If a membership or program fee applies, it is handled directly by IAPSS or the organizer; for details contact pr.mena@iapss.org. Never ask for card or bank details.
Volunteering: the "Volunteer with us" page lists the roles where IAPSS MENA needs help (each with team, time commitment and useful skills) and has an application form; people can also send an open application. Only IAPSS MENA admins see applications. Membership payment is NOT handled by IAPSS MENA: it does not collect money on behalf of IAPSS.
Site pages: About (incl. Leadership), Programs, Partnerships, News, Contact, Get involved (Join, Volunteer, Q&A).
Joining this platform: create an account; an admin reviews and approves every request.`;

const SYSTEM = (ctx: string, lang: string) => `You are the friendly assistant of the IAPSS MENA platform. Answer briefly (max ~120 words). Reply in ${lang === "ar" ? "Arabic" : "English"} (the same language as the user's last message).
When the visitor wants to join, register, become a member or volunteer, explain the steps briefly and say that the buttons below your message take them to the right page. If it is unclear whether they want to join the community or volunteer, ask which one. Never collect personal or payment details in the chat.
Only state facts that appear below; if you don't know something (dates, fees, deadlines, other people), say so and suggest writing to pr.mena@iapss.org.
${FACTS}
${
  ctx === "admin"
    ? `The user is signed in to the admin area. The platform has: Groups (each with one leader and members), a Kanban task board per group (To do / In progress / Review / Done), a Tasks page for tracking all tasks, team Chat (live channels per group plus General), a personal To-do list, People (super admins approve join requests and manage roles) and Site content (super admins edit the public team, partners and projects). Super admins create groups and assign leaders; leaders create and assign tasks in their group; members update their own tasks.`
    : `The user is a visitor on the public website. Encourage them to request to join or to contact pr.mena@iapss.org.`
}`;

type BotLink = { label: string; href: string };

/** Buttons shown under the answer so visitors can act (join, volunteer, contact, ...). */
function intentLinks(q: string, lg: "en" | "ar"): BotLink[] {
  const s = q.toLowerCase();
  const has = (...w: string[]) => w.some((x) => s.includes(x));
  const t = (en: string, ar: string) => (lg === "ar" ? ar : en);
  const joinLink = { label: t("Request to join", "اطلب الانضمام"), href: "/signup" };
  const joinHow = { label: t("How joining works", "كيف يتم الانضمام"), href: "/get-involved" };
  const signIn = { label: t("Sign in", "تسجيل الدخول"), href: "/login" };
  const roles = { label: t("See open roles", "الأدوار المتاحة"), href: "/volunteer#roles" };
  const apply = { label: t("Apply now", "قدّم الآن"), href: "/volunteer#apply" };
  const contact = { label: t("Contact page", "صفحة التواصل"), href: "/contact" };
  const email = { label: t("Email the team", "راسل الفريق"), href: "mailto:pr.mena@iapss.org" };

  if (has("pay", "payment", "fee", "fees", "price", "cost", "credit card", "دفع", "رسوم", "بطاقة", "سعر", "تكلفة")) return [contact, email];
  if (has("best diplomats", "discount", "member benefit", "خصم", "ميزة"))
    return [{ label: t("Request discount code", "اطلب رمز الخصم"), href: "mailto:pr.mena@iapss.org?subject=Request%20for%20IAPSS%20MENA%20Member%20Discount%20Code" }, { label: t("Details", "التفاصيل"), href: "/programs#opportunities" }];
  if (has("register interest", "arabic dialogue", "dialogue series", "اهتمام", "الحوار السياسي"))
    return [{ label: t("Register interest", "سجّل اهتمامك"), href: "mailto:pr.mena@iapss.org?subject=Register%20interest%3A%20Arabic%20Political%20Dialogue%20Series" }, { label: t("Programs & events", "البرامج والفعاليات"), href: "/programs" }];
  if (has("volunteer", "تطوع", "متطوع")) return has("join", "member", "انضم", "عضو") ? [roles, apply, joinLink] : [roles, apply];
  if (has("policy brief", "competition", "موجز", "مسابقة")) return [{ label: t("See the project", "اطّلع على المشروع"), href: "/programs#projects" }];
  if (has("yale", "ygjp", "regional congress", "leadership program", "events", "programs", "program", "برنامج", "البرامج", "فعالية", "الفعاليات", "مؤتمر")) return [{ label: t("Programs & events", "البرامج والفعاليات"), href: "/programs" }];
  if (has("join", "sign up", "signup", "register", "registration", "membership", "become a member", "انضم", "انضمام", "تسجيل", "عضوية", "أصبح عضو")) return [joinLink, joinHow, signIn];
  if (has("get involved", "involved", "participate", "contribute", "help", "شارك", "أشارك", "المشاركة", "ساهم", "أساعد", "مساعدة"))
    return [{ label: t("Join the community", "انضم إلى المجتمع"), href: "/signup" }, { label: t("Volunteer with us", "تطوّع معنا"), href: "/volunteer" }];
  if (has("chair", "deputy", "media director", "leadership", "team", "leader", "رئيس", "نائب", "فريق", "قيادة")) return [{ label: t("Meet the leadership", "تعرّف على القيادة"), href: "/about#leadership" }];
  if (has("partner", "partnership", "collaborat", "شريك", "شراكة", "شراكات", "تعاون")) return [{ label: t("Partnerships", "الشراكات"), href: "/partnerships" }, contact];
  if (has("publication", "journal", "politikon", "منشور", "مجلة")) return [{ label: t("Journals & publications", "المجلات والمنشورات"), href: "/programs#publications" }];
  if (has("news", "أخبار")) return [{ label: t("News", "الأخبار"), href: "/news" }];
  if (has("contact", "email", "reach", "media", "تواصل", "بريد", "إعلام")) return [contact, email];
  return [];
}

function fallbackAr(q: string): string {
  const s = q.toLowerCase();
  const has = (...w: string[]) => w.some((x) => s.includes(x));
  if (/(مرحبا|مرحباً|أهلا|اهلا|السلام|هلا)/.test(q) || has("هل يمكنني", "هل استطيع", "سؤال")) return "أهلًا بك! تفضّل بسؤالك. يمكنني مساعدتك في برامج IAPSS MENA ومسابقة موجز السياسات وفريق القيادة والشراكات وكيفية الانضمام.";
  if (has("دفع", "رسوم", "بطاقة", "سعر", "تكلفة")) return "لا يجمع IAPSS MENA أي مدفوعات أو رسوم، ولا يجمع الأموال نيابةً عن IAPSS. وإن كانت هناك رسوم عضوية أو برنامج، فتتم مباشرةً عبر IAPSS أو الجهة المنظِّمة. للتفاصيل راسلنا على pr.mena@iapss.org.";
  if (has("تطوع", "متطوع", "التطوع")) return "يسعدنا تطوعك! افتح صفحة «تطوّع معنا» لرؤية الأدوار التي نحتاج فيها إلى المساعدة (لكل دور الفريق والالتزام الزمني والمهارات المفيدة) وقدّم على دور مناسب، أو أرسل طلبًا مفتوحًا. يمكنك التطوع دون أن تكون عضوًا، وسيتواصل معك الفريق عبر البريد الإلكتروني. استخدم الأزرار أدناه.";
  if (has("شارك", "أشارك", "المشاركة", "ساهم", "أساعد", "مساعدة")) return "رائع! هناك طريقتان للمشاركة: الانضمام إلى المجتمع (طلب انضمام يراجعه المشرف) أو التطوع بدور يناسب مهاراتك. ماذا تفضّل؟ استخدم الأزرار أدناه.";
  if (has("موجز", "مسابقة", "policy brief")) return "مسابقة موجز السياسات 2026 حول «منظورات مقارنة للحوكمة والتغيير السياسي في منطقة الشرق الأوسط وشمال أفريقيا». موجز من 1,000 إلى 1,500 كلمة بالإنجليزية، وكان الموعد النهائي 1 أكتوبر 2026، وقد انتهى التقديم.";
  if (has("حوار", "سلسلة")) return "سلسلة الحوار السياسي العربي (الحوار العربي، رؤية عالمية) سلسلة باللغة العربية تجمع الأكاديميين والباحثين والدبلوماسيين وخبراء السياسات. قريبًا، ويمكنك تسجيل اهتمامك عبر pr.mena@iapss.org.";
  if (has("قيادة", "برنامج")) return "برنامج القيادة قادم لتنمية مهارات القيادة لدى طلاب العلوم السياسية والمهنيين الشباب في المنطقة، وسيُعلن الموعد رسميًا.";
  if (has("تواصل", "بريد", "اتصال", "إيميل")) return "للتواصل والتعاون والإعلام: pr.mena@iapss.org. ولرئيس الفرع: mena@iapss.org.";
  if (has("نائب", "نائبة", "joelle")) return "Joelle Abou Nader هي نائبة رئيس IAPSS MENA (ماجستير في العلاقات الدولية — جامعة ماساتشوستس بوسطن). للتواصل: deputy.mena@iapss.org.";
  if (has("الإعلام", "الاعلام", "dana")) return "Dana Zantout هي مديرة الإعلام في IAPSS MENA (بكالوريوس في الصحافة والإعلام الدولي — الجامعة اللبنانية الأميركية). للتواصل: media.mena@iapss.org.";
  if (has("رئيس", "فريق", "قيادة")) return "فريق قيادة IAPSS MENA: الرئيس Mohanad Albayati، ونائبة الرئيس Joelle Abou Nader، ومديرة الإعلام Dana Zantout.";
  if (has("انضم", "عضو", "تسجيل", "كيف")) return "للانضمام: 1) اختر «اطلب الانضمام» وأنشئ حسابك، 2) يراجع المشرف طلبك، 3) بعد الموافقة تدخل المنصة ومساحة مجموعتك. وإن رغبت في المساعدة دون عضوية فيمكنك التطوع. استخدم الأزرار أدناه.";
  if (has("شريك", "شراكة", "شراكات")) return "وقّع IAPSS MENA اتفاقيات تعاون مع الجامعة الأمريكية في الشارقة والرابطة الدولية لطلاب الدراسات الدولية (INSA). أما الجهات في صفحة شركاء IAPSS Global فهي شركاء IAPSS Global.";
  return "IAPSS MENA هو الفرع الإقليمي للرابطة الدولية لطلاب العلوم السياسية (IAPSS) في الشرق الأوسط وشمال أفريقيا. يمكنني مساعدتك في البرامج والمسابقة والفريق وكيفية الانضمام.";
}

function fallback(q: string, ctx: string, lang: string): string {
  if (lang === "ar") return fallbackAr(q);
  const s = q.toLowerCase();
  const has = (...w: string[]) => w.some((x) => s.includes(x));
  if (/\b(hello|hi|hey|salam|good (morning|afternoon|evening))\b/.test(s) || /\b(can|may|could) i ask\b|\bquestion\b/.test(s)) return "Hello! Yes, of course, ask away. I can help with IAPSS MENA's programs and events, the Policy Brief Competition, our leadership team, partners, opportunities and how to join.";
  if (has("best diplomats", "discount", "member benefit")) return "Eligible IAPSS MENA members can request discounted rates for the Best Diplomats Türkiye Conference and UN Immersion Program by emailing pr.mena@iapss.org. The programs are run independently by Best Diplomats, which handles registration and payment; IAPSS MENA does not collect payments.";
  if (has("yale", "ygjp")) return "The Yale Annual YGJP Conference 2026 (5-8 November 2026) is an IAPSS Global partner event under the announced partnership with Yale University. It is not an IAPSS MENA-organized event.";
  if (has("regional congress")) return "The IAPSS MENA Regional Congress is coming soon. Date, venue and registration details will be published once confirmed.";
  if (has("seasonal school", "archive", "think tank", "research committee", "programs")) return "IAPSS Global academic programs include Student Research Committees, Seasonal Schools, Delegations, ARChive and the IAPSS Think Tank. Find the official links on this site and at iapss.org.";
  if (has("ela", "different view", "adv", "publication")) return "Publications: Politikon (peer-reviewed, open access), Encuentro Latinoamericano (ELA, on Latin American politics) and A Different View (IAPSS's articles and political analysis platform).";
  if (has("news")) return "No news articles have been published yet. See our programs and events or our publications.";
  if (has("pay", "payment", "fee", "fees", "price", "cost", "credit card")) return "IAPSS MENA does not collect any payment or fee, and it does not collect money on behalf of IAPSS. If a membership or program fee applies, it is handled directly by IAPSS or the organizer. For details write to pr.mena@iapss.org.";
  if (has("volunteer", "volunteering", "help out")) return "We'd love your help! Open the Volunteer with us page to see the roles where we need support (each shows the team, time commitment and useful skills) and apply for one, or send an open application. You can volunteer without being a member, and the team contacts you by email. Use the buttons below.";
  if (has("get involved", "involved", "participate", "contribute", "how can i help", "want to help")) return "Great! There are two ways to get involved: join the community (a request that an admin reviews) or volunteer in a role that fits your skills. Which would you like? Use the buttons below.";
  if (has("policy brief", "competition", "deadline")) return "The IAPSS MENA Policy Brief Competition 2026 asked for a 1,000-1,500 word policy brief in English on 'Comparative Perspectives on Governance and Political Change in the MENA Region'. The deadline was 1 October 2026 and submissions are now closed.";
  if (has("arabic", "dialogue series")) return "The Arabic Political Dialogue Series ('Arabic Dialogue. Global Perspectives.') is an Arabic-language series for academics, researchers, diplomats and policy experts. It is coming soon; register interest by emailing pr.mena@iapss.org.";
  if (has("leadership program")) return "A Leadership Program for political science students and young professionals across the region is coming soon. The official date will be announced.";
  if (has("contact", "email", "reach", "media")) return "For collaboration, media and general inquiries write to pr.mena@iapss.org. The chair can be reached at mena@iapss.org. You can also follow IAPSS MENA on LinkedIn (iapssmenaofficial) and Instagram (@iapss.mena).";
  if (has("deputy", "joelle")) return "Joelle Abou Nader is the Deputy Chair of IAPSS MENA (MA in International Relations, University of Massachusetts Boston). Contact: deputy.mena@iapss.org.";
  if (has("media director", "dana")) return "Dana Zantout is the Media Director of IAPSS MENA (BA in Journalism and International Media, Lebanese American University). Contact: media.mena@iapss.org.";
  if (has("chair", "head", "president", "leader", "who runs", "team", "leadership")) return "IAPSS MENA's leadership team: Chair Mohanad Albayati, Deputy Chair Joelle Abou Nader and Media Director Dana Zantout.";
  if (has("partner", "collaborat")) return "IAPSS MENA has signed collaborations with the American University of Sharjah and the International Studies Students Association (INSA). Organisations on the IAPSS Global partners page are partners of IAPSS Global, not automatically of IAPSS MENA.";
  if (has("congress")) return "The World Congress is IAPSS's flagship annual academic conference, held in person and virtually. The 2026 edition took place in Vanderbijlpark, South Africa.";
  if (has("mun", "model united", "committee", "unsc", "unhrc", "disec")) return "IAPSS runs online Model UN sessions with committees such as UNHRC, COP, UNSC and DISEC, covering global debate and diplomacy.";
  if (has("politikon", "journal", "publish")) return "Politikon: The IAPSS Journal of Political Science is a peer-reviewed, open-access journal for students and early-career researchers.";
  if (has("join", "member", "sign up", "register", "registration", "membership")) return "To join: 1) choose Request to join and create your account, 2) an admin reviews your request, 3) once approved you enter the platform and your group's space. If you prefer to help without joining, you can volunteer. Use the buttons below.";
  if (has("where", "headquarter", "montreal", "based")) return "IAPSS is headquartered in Montréal, Canada. IAPSS MENA is its regional chapter for the Middle East and North Africa.";
  if (ctx === "admin") {
    if (has("task", "kanban")) return "Tasks live inside groups: open a group to see its Kanban board. Super admins and group leaders can create and assign tasks; assignees can move their own tasks between columns. The Tasks page tracks everything in one place.";
    if (has("group", "leader")) return "Super admins create groups on the Groups page, then pick a leader and members from the group's page.";
    if (has("todo", "to-do")) return "Your personal To-do list is private to you. Find it in the sidebar.";
    if (has("chat", "message")) return "Open Chat to talk live in the General channel or in any of your group channels.";
  }
  if (has("mena", "iapss", "what is", "about")) return "IAPSS MENA is the Middle East and North Africa Regional Chapter of IAPSS. It connects students, researchers and young professionals across MENA through dialogue, research and leadership, with pillars in research & publishing, regional dialogue, and leadership & development.";
  return "I can help with IAPSS MENA: our projects, the Policy Brief Competition, the Arabic Dialogue Series, our team, partners or how to join. What would you like to know?";
}

export async function POST(req: Request) {
  const { messages, context, lang } = (await req.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
    context?: string;
    lang?: string;
  };
  const ctx = context === "admin" ? "admin" : "public";
  const clean = (messages ?? []).slice(-12).map((m) => ({ role: m.role, content: String(m.content).slice(0, 2000) }));
  const last = clean.filter((m) => m.role === "user").pop()?.content ?? "";
  // answer in the language the visitor actually writes in; only fall back to the page language for neutral input
  const lg = /[\u0600-\u06FF]/.test(last) ? "ar" : /[A-Za-z]/.test(last) ? "en" : lang === "ar" ? "ar" : "en";

  const links = ctx === "public" ? intentLinks(last, lg) : [];

  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ reply: fallback(last, ctx, lg), links, mode: "builtin" });

  try {
    const client = new Anthropic();
    const r = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-haiku-5-5",
      max_tokens: 400,
      system: SYSTEM(ctx, lg),
      messages: clean,
    });
    const reply = r.content.map((b) => (b.type === "text" ? b.text : "")).join("").trim();
    return NextResponse.json({ reply: reply || fallback(last, ctx, lg), links, mode: "claude" });
  } catch {
    return NextResponse.json({ reply: fallback(last, ctx, lg), links, mode: "builtin" });
  }
}
