import { cn } from "@/lib/utils";

/** Seksjonsskall: én hårlinje som skille, innhold på felles bredde. */
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
      {eyebrow ? (
        <p className="text-[13px] text-muted-foreground">{eyebrow}</p>
      ) : null}
      <h2
        id={id}
        className={cn(
          "display mt-2 text-[clamp(1.625rem,3.6vw,2.5rem)]",
          !eyebrow && "mt-0",
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p
          className={cn(
            "mt-3 text-[15px] leading-relaxed text-muted-foreground",
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
