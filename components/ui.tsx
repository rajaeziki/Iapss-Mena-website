export function Progress({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-gradient-to-r from-brand via-[#3a4f8f] to-teal2 transition-all duration-700" style={{ width: `${value}%` }} />
    </div>
  );
}

const ACCENT: Record<string, string> = {
  brand: "from-brand to-[#3a4f8f]",
  teal: "from-teal2 to-[#4fd1c5]",
  green: "from-emerald-600 to-emerald-400",
  rose: "from-rose-600 to-orange-400",
  slate: "from-slate-400 to-slate-300",
};

export function Stat({ label, value, tone = "text-brand", accent = "brand" }: { label: string; value: React.ReactNode; tone?: string; accent?: keyof typeof ACCENT }) {
  return (
    <div className="card relative overflow-hidden transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${ACCENT[accent]}`} />
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-2 font-serif text-4xl font-bold ${tone}`}>{value}</div>
    </div>
  );
}

export function PageHead({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-3xl font-bold text-brand md:text-4xl">{title}</h1>
        {sub && <p className="mt-1.5 text-sm text-slate-500">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center text-sm text-slate-500">{children}</div>;
}

/** Deterministic gradient per group name so each group gets its own colour. */
const GRADS = [
  "from-[#1e2c50] to-[#3a4f8f]", "from-[#0e7c86] to-[#4fd1c5]", "from-[#e4572e] to-[#ff9a76]",
  "from-[#6d4bd6] to-[#9f86ee]", "from-[#2b6cb0] to-[#63b3ed]", "from-[#b83280] to-[#ed64a6]",
];
export const groupGradient = (name: string) =>
  GRADS[Array.from(name).reduce((a, c) => a + c.charCodeAt(0), 0) % GRADS.length];
