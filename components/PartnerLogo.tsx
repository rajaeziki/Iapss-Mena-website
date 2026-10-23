"use client";
import { useEffect, useRef, useState } from "react";

export const domainOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

// these sites publish a white-on-transparent icon that is invisible on a white tile
const NO_ICON = new Set(["sustainableeurope.eu", "europeanhorizons.org"]);

const initials = (s: string) =>
  s.replace(/\(.*?\)/g, "").split(/\s+/).filter((w) => /^[A-Za-z]/.test(w) && w.length > 2).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || s[0]?.toUpperCase() || "?";

/** The partner's website icon. Falls back to a monogram when no usable icon exists. */
export default function PartnerLogo({ domain, name, size = 56 }: { domain: string; name: string; size?: number }) {
  const [ok, setOk] = useState(Boolean(domain) && !NO_ICON.has(domain));
  const img = useRef<HTMLImageElement>(null);
  // the icon may finish loading before React attaches onLoad, so check once on mount too
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && (el.naturalWidth === 0 || el.naturalWidth <= 32)) setOk(false);
  }, []);
  return (
    <span
      className="grid flex-none place-items-center overflow-hidden rounded-xl border border-brand/10 bg-white"
      style={{ width: size, height: size }}
    >
      {ok ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={img}
          src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`}
          alt={`${name} logo`}
          loading="lazy"
          className="h-3/4 w-3/4 object-contain grayscale transition duration-300 group-hover:grayscale-0"
          onLoad={(e) => { if (e.currentTarget.naturalWidth <= 32) setOk(false); }}
          onError={() => setOk(false)}
        />
      ) : (
        <span className="grid h-full w-full place-items-center bg-gradient-to-br from-brand to-brand-500 text-sm font-extrabold tracking-wide text-white">
          {initials(name)}
        </span>
      )}
    </span>
  );
}
