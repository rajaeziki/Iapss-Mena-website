"use client";
import { useRef } from "react";

/** Gentle 3D tilt that follows the mouse. Disabled on touch screens and for reduced-motion users. */
export default function Tilt({ children, className = "", style, max = 4 }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = () =>
    typeof window !== "undefined" &&
    matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches;

  const move = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || !enabled()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${x * max * 2}deg) rotateX(${-y * max * 2}deg)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };

  return (
    <div ref={ref} onMouseMove={move} onMouseLeave={leave} style={style}
      className={`transition-transform duration-200 ease-out will-change-transform ${className}`}>
      {children}
    </div>
  );
}
