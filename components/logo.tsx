import { cn } from "@/lib/utils";

/** Merkemerket: hus med stigende trendpil. Kilde: public/logo.svg */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id="uk-logo-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2563eb" />
          <stop offset="1" stopColor="#1c3faf" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#uk-logo-bg)" />
      <path
        d="M14 27.5 L32 12 L50 27.5"
        fill="none"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 46.5 L27.5 36 L33.5 41.5 L44 31.5"
        fill="none"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M37.5 31.5 L44 31.5 L44 38"
        fill="none"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
