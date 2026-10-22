"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import type { Profile } from "./types";
import Logo from "@/components/Logo";

type Ctx = { user: User; profile: Profile; isAdmin: boolean; signOut: () => Promise<void> };
const AuthCtx = createContext<Ctx | null>(null);
export const useAuth = () => {
  const c = useContext(AuthCtx);
  if (!c) throw new Error("useAuth outside provider");
  return c;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<{ user: User; profile: Profile } | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (!user) return router.replace("/login");
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (!profile) return router.replace("/login");
    setState({ user, profile: profile as Profile });
  }, [router]);

  useEffect(() => {
    load();
    const { data: sub } = supabase.auth.onAuthStateChange((e) => {
      if (e === "SIGNED_OUT") router.replace("/login");
    });
    return () => sub.subscription.unsubscribe();
  }, [load, router]);

  const signOut = async () => { await supabase.auth.signOut(); };

  if (!state)
    return <div className="grid min-h-screen place-items-center text-slate-500">Loading…</div>;

  if (state.profile.status !== "approved") {
    const rejected = state.profile.status === "rejected";
    return (
      <main className="relative grid min-h-screen place-items-center overflow-hidden px-5">
        <div className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="relative w-full max-w-md text-center">
          <div className="mb-6 flex justify-center"><Logo size={72} /></div>
          <div className="rounded-3xl border border-white bg-white/90 p-8 shadow-2xl backdrop-blur-xl">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${rejected ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>
              {rejected ? "Request declined" : "Waiting for approval"}
            </span>
            <h1 className="mt-4 text-2xl font-bold text-brand">
              {rejected ? "Your request was not approved" : `Thanks, ${state.profile.full_name.split(" ")[0]}!`}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {rejected
                ? "An IAPSS MENA admin declined this membership request. If you think this is a mistake, contact mena@iapss.org."
                : "Your account was created. An IAPSS MENA admin needs to approve your request before you can enter the platform."}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              {!rejected && <button className="btn btn-primary" onClick={load}>Check again</button>}
              <button className="btn btn-ghost" onClick={signOut}>Sign out</button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <AuthCtx.Provider value={{ ...state, isAdmin: state.profile.role === "super_admin", signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}
