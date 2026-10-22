import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const FACTS = `The International Association for Political Science Students (IAPSS) is a global, non-profit, student-run organization representing political science students and early-career researchers. It is headquartered in Montreal, Canada, and connects over 10,000 members in more than 40 countries to foster academic exchange and professional growth.
Activities: (1) World Congress - the flagship annual academic conference, in person and virtual; the 2026 edition took place in Vanderbijlpark, South Africa. (2) Model United Nations (MUN) - online global debate and diplomacy sessions with committees such as UNHRC, COP, UNSC and DISEC. (3) Regional chapters, e.g. IAPSS MENA, the regional branch for the Middle East and North Africa: it connects political science and international relations students, graduates and young researchers in the region through academic dialogue, research and global networking. IAPSS MENA activities: the annual Policy Brief Competition (academic and policy writing), the MENA Non-Resident Fellowship, academic mentorship programmes and student development initiatives, and local outreach through country representatives. Contact: mena@iapss.org. Social: LinkedIn (company/iapssmenaofficial) and Instagram @iapss.mena. (4) Publishing - Politikon: The IAPSS Journal of Political Science, a peer-reviewed open-access journal.`;

const SYSTEM = (ctx: string) => `You are the friendly assistant of the IAPSS platform. Answer briefly (max ~120 words), in the user's language.
Only state facts about IAPSS that appear below; if you don't know something (dates, fees, deadlines), say so and suggest contacting the team via iapss.org.
${FACTS}
${
  ctx === "admin"
    ? `The user is signed in to the admin area. The platform has: Groups (each with one leader and members), a Kanban task board per group (To do / In progress / Review / Done), a Tasks page for tracking all tasks, team Chat (live channels per group plus General), a personal To-do list, and People (super admins manage roles). Super admins create groups and assign leaders; leaders create and assign tasks in their group; members update their own tasks.`
    : `The user is a visitor on the public website. Encourage them to sign up to join the community.`
}`;

function fallback(q: string, ctx: string): string {
  const s = q.toLowerCase();
  const has = (...w: string[]) => w.some((x) => s.includes(x));
  if (has("congress")) return "The World Congress is IAPSS's flagship annual academic conference, held in person and virtually. The 2026 edition took place in Vanderbijlpark, South Africa.";
  if (has("mun", "model united", "committee", "unsc", "unhrc", "disec")) return "IAPSS runs online Model UN sessions with committees such as UNHRC, COP, UNSC and DISEC, covering global debate and diplomacy.";
  if (has("politikon", "journal", "publish", "paper")) return "Politikon: The IAPSS Journal of Political Science is a peer-reviewed, open-access journal for students and early-career researchers.";
  if (has("fellowship", "policy brief", "mentor", "country rep", "outreach")) return "IAPSS MENA runs the annual Policy Brief Competition, the MENA Non-Resident Fellowship, academic mentorship programmes and local outreach through country representatives. Contact: mena@iapss.org.";
  if (has("contact", "email", "instagram", "linkedin", "follow")) return "You can reach IAPSS MENA at mena@iapss.org, or follow them on LinkedIn (iapssmenaofficial) and Instagram (@iapss.mena).";
  if (has("chapter", "mena", "region")) return "IAPSS MENA is the regional branch for the Middle East and North Africa. It connects students, graduates and young researchers through academic dialogue, research and networking, with programmes like the Policy Brief Competition and the MENA Non-Resident Fellowship.";
  if (has("join", "member", "sign up", "register")) return "You can join by creating an account on this platform. IAPSS connects 10,000+ members in 40+ countries.";
  if (has("where", "headquarter", "montreal", "based")) return "IAPSS is headquartered in Montréal, Canada.";
  if (ctx === "admin") {
    if (has("task", "kanban")) return "Tasks live inside groups: open a group to see its Kanban board. Super admins and group leaders can create and assign tasks; assignees can move their own tasks between columns. The Tasks page tracks everything in one place.";
    if (has("group", "leader")) return "Super admins create groups on the Groups page, then pick a leader and members from the group's page.";
    if (has("todo", "to-do")) return "Your personal To-do list is private to you. Find it in the sidebar.";
    if (has("chat", "message")) return "Open Chat to talk live in the General channel or in any of your group channels.";
  }
  if (has("who", "what is", "iapss", "about")) return "IAPSS is a global, non-profit, student-run organization for political science students and early-career researchers, with 10,000+ members in 40+ countries.";
  return "I can help with IAPSS: the World Congress, Model UN, Politikon, chapters, or how to join. What would you like to know?";
}

export async function POST(req: Request) {
  const { messages, context } = (await req.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
    context?: string;
  };
  const ctx = context === "admin" ? "admin" : "public";
  const clean = (messages ?? []).slice(-12).map((m) => ({ role: m.role, content: String(m.content).slice(0, 2000) }));
  const last = clean.filter((m) => m.role === "user").pop()?.content ?? "";

  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ reply: fallback(last, ctx), mode: "builtin" });

  try {
    const client = new Anthropic();
    const r = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-haiku-5-5",
      max_tokens: 400,
      system: SYSTEM(ctx),
      messages: clean,
    });
    const reply = r.content.map((b) => (b.type === "text" ? b.text : "")).join("").trim();
    return NextResponse.json({ reply: reply || fallback(last, ctx), mode: "claude" });
  } catch {
    return NextResponse.json({ reply: fallback(last, ctx), mode: "builtin" });
  }
}
