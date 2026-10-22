"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, configured } from "@/lib/supabase";
import Logo from "./Logo";

const friendly = (m: string) =>
  /rate limit/i.test(m)
    ? "Too many emails were sent recently. Please wait about an hour and try again. (Admin: turn off 'Confirm email' in Supabase to remove this limit.)"
    : m;

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setInfo(""); setBusy(true);
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
      if (error) setErr(friendly(error.message));
      else if (!data.session) setInfo("Check your email to confirm your account, then sign in.");
      else router.replace("/dashboard");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErr(friendly(error.message));
      else router.replace("/dashboard");
    }
    setBusy(false);
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-5">
      <div className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="pointer-events-none absolute -right-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-gradient-to-br from-[#c9d5f7] to-[#bfeaea] opacity-70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-[#ffd9cc] opacity-60 blur-3xl" />
      <div className="relative w-full max-w-sm">
        <div className="mb-6 flex justify-center"><Logo size={72} /></div>
        <form onSubmit={submit} className="space-y-4 rounded-3xl border border-white bg-white/85 p-7 shadow-2xl backdrop-blur-xl">
          <h1 className="text-2xl font-bold text-brand">{mode === "login" ? "Welcome back" : "Request to join"}</h1>
          {mode === "signup" && <p className="-mt-2 text-sm text-slate-500">An IAPSS MENA admin reviews every request before you get access.</p>}
          {!configured && (
            <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
              Supabase isn&apos;t configured yet. Copy <code>.env.local.example</code> to <code>.env.local</code> and fill it in.
            </p>
          )}
          {mode === "signup" && (
            <div><label className="label">Full name</label><input className="input" required value={name} onChange={(e) => setName(e.target.value)} /></div>
          )}
          <div><label className="label">Email</label><input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div><label className="label">Password</label><input className="input" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          {err && <p className="text-sm text-rose-600">{err}</p>}
          {info && <p className="text-sm text-emerald-700">{info}</p>}
          <button className="btn btn-primary w-full" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Sign in" : "Send my request"}</button>
          <p className="text-center text-sm text-slate-500">
            {mode === "login" ? <>No account? <Link className="font-semibold text-brand" href="/signup">Sign up</Link></> : <>Have an account? <Link className="font-semibold text-brand" href="/login">Sign in</Link></>}
          </p>
        </form>
      </div>
    </main>
  );
}
