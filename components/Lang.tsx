"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Lang = "en" | "ar";
const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "en", setLang: () => {} });

/** `l(en, ar)` returns the text for the active language. Only the public home page is bilingual. */
export function useLang() {
  const { lang, setLang } = useContext(Ctx);
  return { lang, setLang, rtl: lang === "ar", l: (en: string, ar: string) => (lang === "ar" ? ar : en) };
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [choice, setChoice] = useState<Lang>("en");

  useEffect(() => {
    try {
      const s = localStorage.getItem("lang");
      if (s === "ar" || s === "en") setChoice(s);
    } catch {}
  }, []);

  // The public pages are bilingual; the dashboard and sign-in pages stay English / left-to-right.
  const PUBLIC = ["/about", "/programs", "/partnerships", "/news", "/get-involved", "/volunteer", "/contact"];
  const isPublic = pathname === "/" || PUBLIC.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const lang: Lang = isPublic ? choice : "en";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l: Lang) => {
    setChoice(l);
    try { localStorage.setItem("lang", l); } catch {}
  };

  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}
