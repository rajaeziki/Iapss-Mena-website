import Link from "next/link";

/** Full-colour IAPSS MENA logo. `size` is the height in px. Use on light backgrounds. */
export default function Logo({ size = 44, href = "/" }: { size?: number; href?: string }) {
  return (
    <Link href={href} aria-label="IAPSS MENA home" className="inline-flex items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-mena.png" alt="IAPSS MENA, The International Association for Political Science Students" style={{ height: size, width: "auto" }} />
    </Link>
  );
}
