"use client";
import { useAuth } from "@/lib/auth";
import { useWorkspace } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/types";
import { PageHead } from "@/components/ui";

const STATUS_STYLE = {
  approved: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  rejected: "bg-rose-50 text-rose-700",
} as const;

export default function People() {
  const { isAdmin, user } = useAuth();
  const { profiles, groups, members, reload } = useWorkspace();
  if (!isAdmin) return <p className="text-slate-500">Only super admins can manage people.</p>;

  const pending = profiles.filter((p) => p.status === "pending");
  const others = profiles.filter((p) => p.status !== "pending");

  async function update(id: string, patch: Partial<Profile>) {
    await supabase.from("profiles").update(patch).eq("id", id);
    reload();
  }

  return (
    <>
      <PageHead title="People" sub="Approve who can join IAPSS MENA, and manage roles." />

      <section className="mb-8">
        <h2 className="mb-3 flex items-center gap-2 text-xl font-bold">
          Pending requests
          {pending.length > 0 && <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-semibold text-white">{pending.length}</span>}
        </h2>
        {pending.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-center text-sm text-slate-500">No one is waiting for approval.</div>
        ) : (
          <div className="space-y-2">
            {pending.map((p) => (
              <div key={p.id} className="card flex flex-wrap items-center justify-between gap-3 !p-4">
                <div>
                  <div className="font-semibold">{p.full_name}</div>
                  <div className="text-sm text-slate-500">{p.email}</div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-primary !py-2" onClick={() => update(p.id, { status: "approved" })}>Approve</button>
                  <button className="btn btn-ghost !py-2 hover:!border-rose-300 hover:!text-rose-600" onClick={() => update(p.id, { status: "rejected" })}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <h2 className="mb-3 text-xl font-bold">Everyone else</h2>
      <div className="card overflow-x-auto !p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Groups</th><th className="p-3">Status</th><th className="p-3">Role</th></tr>
          </thead>
          <tbody>
            {others.map((p) => {
              const gs = groups.filter((g) => members.some((m) => m.group_id === g.id && m.user_id === p.id));
              return (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="p-3 font-medium">{p.full_name}</td>
                  <td className="p-3 text-slate-500">{p.email}</td>
                  <td className="p-3 text-slate-500">{gs.map((g) => g.name + (g.leader_id === p.id ? " (leader)" : "")).join(", ") || "—"}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLE[p.status]}`}>{p.status}</span>
                    {p.id !== user.id && p.status === "approved" && (
                      <button className="ml-2 text-xs text-slate-400 hover:text-rose-600" onClick={() => update(p.id, { status: "rejected" })}>Revoke</button>
                    )}
                    {p.status === "rejected" && (
                      <button className="ml-2 text-xs text-brand hover:underline" onClick={() => update(p.id, { status: "approved" })}>Approve</button>
                    )}
                  </td>
                  <td className="p-3">
                    <select className="input !w-auto !py-1.5" value={p.role} disabled={p.id === user.id}
                      onChange={(e) => update(p.id, { role: e.target.value as Profile["role"] })}>
                      <option value="member">Member</option>
                      <option value="super_admin">Super admin</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
