import Link from "next/link";
import Logo from "@/components/Logo";
import Chatbot from "@/components/Chatbot";
import SiteSection from "@/components/SiteSection";

const purposes = [
  ["Academic dialogue", "A space where students and young researchers of the region discuss political science and international relations."],
  ["Research and writing", "Initiatives such as the annual Policy Brief Competition push members to write, publish and be heard."],
  ["Mentorship", "Academic mentorship and student development programmes that help members grow."],
  ["Networking and outreach", "Country representatives and the global IAPSS network connect members locally and worldwide."],
];

const head = (eyebrow: string, title: string, sub?: string) => (
  <div className="mb-12 max-w-2xl">
    <p className="text-xs font-semibold uppercase tracking-[.2em] text-teal2">{eyebrow}</p>
    <h2 className="mt-3 text-4xl font-bold text-brand md:text-5xl">{title}</h2>
    {sub && <p className="mt-4 text-slate-600">{sub}</p>}
  </div>
);

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Logo size={48} />
          <nav className="hidden gap-7 text-sm font-medium text-slate-600 lg:flex">
            <a href="#about" className="hover:text-brand">About</a>
            <a href="#purpose" className="hover:text-brand">What it&apos;s for</a>
            <a href="#team" className="hover:text-brand">Team</a>
            <a href="#partners" className="hover:text-brand">Partnerships</a>
            <a href="#projects" className="hover:text-brand">Projects</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="btn btn-ghost !py-2">Sign in</Link>
            <Link href="/signup" className="btn btn-primary !py-2">Join</Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        <div className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[40rem] w-[40rem] rounded-full bg-gradient-to-br from-[#c9d5f7] to-[#bfeaea] opacity-70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-[30rem] w-[30rem] rounded-full bg-[#ffd9cc] opacity-60 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-24 pt-20 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Regional branch of IAPSS · Middle East &amp; North Africa
            </span>
            <h1 className="mt-6 text-5xl font-bold leading-[1.02] md:text-7xl">
              The voice of political science students in <span className="text-gradient">MENA.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-600">
              IAPSS MENA connects political science and international relations students, graduates and young researchers across the region through academic dialogue, research and global networking.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/signup" className="btn btn-primary !px-7 !py-3.5">Request to join</Link>
              <a href="#team" className="btn btn-ghost !px-7 !py-3.5">Meet the team</a>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/70 bg-white/80 p-7 shadow-2xl backdrop-blur">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">At a glance</div>
            <dl className="mt-4 space-y-4 text-sm">
              <div><dt className="text-slate-500">Region</dt><dd className="font-semibold text-brand">Middle East &amp; North Africa</dd></div>
              <div><dt className="text-slate-500">Part of</dt><dd className="font-semibold text-brand">IAPSS · Montréal, Canada</dd></div>
              <div><dt className="text-slate-500">Global network</dt><dd className="font-semibold text-brand">10,000+ members · 40+ countries</dd></div>
              <div><dt className="text-slate-500">Nature</dt><dd className="font-semibold text-brand">Student-run · Non-profit</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-teal2">About</p>
            <h2 className="mt-3 text-4xl font-bold text-brand md:text-5xl">What is IAPSS MENA?</h2>
          </div>
          <div className="space-y-4 text-lg text-slate-600">
            <p>IAPSS MENA is the regional branch of the International Association for Political Science Students (IAPSS), serving the Middle East and North Africa.</p>
            <p>IAPSS itself is a global, non-profit, student-run organization representing political science students and early-career researchers. IAPSS MENA brings that network closer to students of our region.</p>
          </div>
        </div>
      </section>

      {/* PURPOSE */}
      <section id="purpose" className="mx-auto max-w-6xl px-5 py-24">
        {head("Why it exists", "What is it for?", "Four things IAPSS MENA does for its members.")}
        <div className="grid gap-5 md:grid-cols-2">
          {purposes.map(([t, d], i) => (
            <article key={t} className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-brand-50 p-8 transition hover:-translate-y-1.5 hover:shadow-2xl">
              <div className="outline-num font-serif text-7xl font-bold transition group-hover:text-brand/10">0{i + 1}</div>
              <h3 className="-mt-2 text-2xl font-bold text-brand">{t}</h3>
              <p className="mt-3 max-w-sm text-slate-600">{d}</p>
              <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-brand/5 transition group-hover:scale-150" />
            </article>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className="bg-[#f1f4fb]">
        <div className="mx-auto max-w-6xl px-5 py-24">
          {head("The people", "Our team", "The members who run IAPSS MENA.")}
          <SiteSection kind="team" empty="Our team will be introduced here soon." />
        </div>
      </section>

      {/* PARTNERS */}
      <section id="partners" className="mx-auto max-w-6xl px-5 py-24">
        {head("Together", "Our partnerships", "Organisations we work with.")}
        <SiteSection kind="partner" empty="Our partners will be listed here soon." />
      </section>

      {/* PROJECTS */}
      <section id="projects" className="relative overflow-hidden bg-[#f1f4fb]">
        <div className="mx-auto max-w-6xl px-5 py-24">
          {head("What we have done", "Our projects", "Initiatives led by IAPSS MENA.")}
          <SiteSection kind="project" empty="Our projects will be showcased here soon." />
        </div>
      </section>

      {/* JOIN */}
      <section id="join" className="mx-auto max-w-6xl px-5 py-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand via-[#2b3d72] to-teal2 px-8 py-16 text-white">
          <div className="dot-grid-light absolute inset-0 opacity-50" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <h2 className="text-4xl font-bold md:text-5xl">Are you an IAPSS MENA member?</h2>
              <p className="mt-4 max-w-md text-white/80">Sign in to your space, or ask to join. Every request is reviewed by an admin.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="btn bg-white !px-7 !py-3.5 text-brand hover:shadow-xl">Sign in</Link>
                <Link href="/signup" className="btn border border-white/40 !px-7 !py-3.5 text-white hover:bg-white/10">Request to join</Link>
              </div>
            </div>
            <ol className="space-y-3">
              {[["Create your account", "Fill in your name and email."], ["An admin reviews it", "They approve or decline your request."], ["Enter the platform", "Join your group, follow tasks and chat with the team."]].map(([t, d], i) => (
                <li key={t} className="flex gap-5 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <span className="font-serif text-3xl font-bold text-teal-300">0{i + 1}</span>
                  <div><div className="font-semibold">{t}</div><div className="text-sm text-white/70">{d}</div></div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-10 text-center text-sm text-slate-500">
        <div className="mb-3 flex flex-wrap justify-center gap-5 font-medium text-brand">
          <a href="https://www.linkedin.com/company/iapssmenaofficial" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
          <a href="https://www.instagram.com/iapss.mena/" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a>
          <a href="mailto:mena@iapss.org" className="hover:underline">mena@iapss.org</a>
        </div>
        IAPSS MENA · The International Association for Political Science Students · Montréal, Canada
      </footer>
      <Chatbot context="public" />
    </main>
  );
}
