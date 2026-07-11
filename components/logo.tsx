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
      <rect width="64" height="64" rx="16" fill="#1d4636" />
      <path
        d="M14 27.5 L32 12 L50 27.5"
        fill="none"
        stroke="#f7f2e6"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 46.5 L27.5 36 L33.5 41.5 L44 31.5"
        fill="none"
        stroke="#f7f2e6"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M37.5 31.5 L44 31.5 L44 38"
        fill="none"
        stroke="#f7f2e6"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
