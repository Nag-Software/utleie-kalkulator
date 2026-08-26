import { cn } from "@/lib/utils";

/**
 * Siktekors i hjørnene av en seksjonsramme. Rent dekorativt – markerer
 * krysningspunktene i rutenettet, som i temaet vi etterligner.
 */
function Cross({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden
      className={cn("crosshair", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M6 0v12M0 6h12" />
    </svg>
  );
}

/**
 * Seksjonsskall: hårfine loddrette hjelpelinjer i ytterkantene og siktekors
 * i hjørnene. Linjene tegnes bare fra lg og opp, der det er luft til dem.
 */
export function Section({
  children,
  className,
  bleed = false,
  ...props
}: React.ComponentProps<"section"> & { bleed?: boolean }) {
  return (
    <section
      className={cn("relative border-t border-border", className)}
      {...props}
    >
      <div
        className={cn(
          "relative mx-auto w-full max-w-6xl",
          !bleed && "px-4 sm:px-6",
        )}
      >
        {/* Loddrette hjelpelinjer i innholdskanten, med siktekors der de
            møter seksjonsskillet. Bare fra lg og opp – der er det luft. */}
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 hidden w-px bg-border lg:block"
        />
        <span
          aria-hidden
          className="absolute inset-y-0 right-0 hidden w-px bg-border lg:block"
        />
        <Cross className="-left-1.5 -top-1.5 hidden lg:block" />
        <Cross className="-right-1.5 -top-1.5 hidden lg:block" />
        {children}
      </div>
    </section>
  );
}

/** Liten pilleetikett over overskrifter. */
export function Pill({
  children,
  dot = true,
  className,
}: {
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("eyebrow", dot && "eyebrow-dot", className)}>
      {children}
    </span>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        align === "center" && "mx-auto max-w-2xl text-center",
        align === "left" && "max-w-2xl",
        className,
      )}
    >
      {eyebrow ? <Pill>{eyebrow}</Pill> : null}
      <h2
        id={id}
        className={cn(
          "display mt-4 text-[clamp(1.75rem,4.5vw,2.75rem)]",
          !eyebrow && "mt-0",
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p
          className={cn(
            "mt-3 text-[15px] leading-relaxed text-muted-foreground sm:text-base",
            align === "center" && "mx-auto",
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}

/** Hårfint kort – flat hvit flate med 1px ramme, ingen skygge. */
export function Panel({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 sm:p-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
