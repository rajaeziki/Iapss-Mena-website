"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/lib/auth";
import Logo from "@/components/Logo";
import Chatbot from "@/components/Chatbot";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/groups", label: "Groups" },
  { href: "/dashboard/tasks", label: "Tasks" },
  { href: "/dashboard/chat", label: "Chat" },
  { href: "/dashboard/todo", label: "My to-do" },
];

function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { profile, isAdmin, signOut } = useAuth();
  const items = isAdmin ? [...NAV, { href: "/dashboard/people", label: "People" }, { href: "/dashboard/content", label: "Site content" }] : NAV;
  const [pending, setPending] = useState(0);
  useEffect(() => {
    if (!isAdmin) return;
    const count = () => supabase.from("profiles").select("id", { count: "exact", head: true }).eq("status", "pending").then(({ count: c }) => setPending(c ?? 0));
    count();
    const t = setInterval(count, 20000);
    return () => clearInterval(t);
  }, [isAdmin, path]);
  const active = (h: string) => (h === "/dashboard" ? path === h : path.startsWith(h));
  const initials = profile.full_name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="relative min-h-screen md:flex">
      <div className="dot-grid pointer-events-none fixed inset-0 -z-10 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_55%)]" />
      <div className="pointer-events-none fixed -right-40 -top-40 -z-10 h-[32rem] w-[32rem] rounded-full bg-gradient-to-br from-[#c9d5f7] to-[#bfeaea] opacity-60 blur-3xl" />

      <aside className="relative flex flex-col border-b border-slate-200/70 bg-white/80 backdrop-blur-xl md:sticky md:top-0 md:h-screen md:w-64 md:flex-none md:border-b-0 md:border-r">
        <div className="px-5 pt-5"><Logo size={50} href="/dashboard" /></div>

        <div className="mx-4 mt-5 flex items-center gap-3 rounded-2xl bg-gradient-to-br from-brand to-[#3a4f8f] p-3 text-white shadow-soft">
          <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-white/20 text-sm font-bold">{initials}</span>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{profile.full_name}</div>
            <div className="text-[11px] uppercase tracking-wider text-white/70">{isAdmin ? "Super admin" : "Member"}</div>
          </div>
        </div>

        <nav className="mt-5 flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:pb-0">
          {items.map(({ href, label }) => (
            <Link key={href} href={href}
              className={`relative whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition ${active(href) ? "bg-brand-50 font-semibold text-brand" : "text-slate-600 hover:bg-slate-100"}`}>
              {active(href) && <span className="absolute left-0 top-1/2 hidden h-5 w-1 -translate-y-1/2 rounded-r-full bg-teal2 md:block" />}
              {label}
              {href === "/dashboard/people" && pending > 0 && <span className="ml-2 rounded-full bg-amber-500 px-2 py-0.5 text-[11px] font-semibold text-white">{pending}</span>}
            </Link>
          ))}
        </nav>
        <button onClick={signOut} className="mx-3 mb-4 hidden rounded-xl border border-slate-200 px-4 py-2.5 text-left text-sm font-medium text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 md:block">
          Sign out
        </button>
      </aside>

      <main className="min-w-0 flex-1 p-5 md:p-10">
        {children}
        <button onClick={signOut} className="mt-10 text-sm text-slate-400 md:hidden">Sign out</button>
      </main>
      <Chatbot context="admin" />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Shell>{children}</Shell>
    </AuthProvider>
  );
}
