"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

function sized(url: string, width: "320w" | "960w"): string {
  return url.replace(/\/dynamic\/\d+w\//, `/dynamic/${width}/`);
}

/** Antall bilder som vises ved siden av hovedbildet. */
const SIDE_COUNT = 3;

/**
 * Bildene fra FINN-annonsen: ett hovedbilde med tre mindre ved siden av.
 *
 * Sidebildene er de *neste* i serien, ikke de tre første — klikker du deg
 * gjennom, går rekkefølgen naturlig videre i stedet for å hoppe tilbake til
 * start. Høyre kolonne strekker seg til hovedbildets høyde, så seksjonen
 * har én forutsigbar høyde uansett hvor mange bilder annonsen har.
 */
export function ListingGallery({
  images,
  alt,
  className,
}: {
  images: string[];
  alt: string;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  if (images.length === 0) return null;

  const total = images.length;
  const safeIndex = Math.min(index, total - 1);
  const current = images[safeIndex]!;
  const go = (next: number) => setIndex(((next % total) + total) % total);

  // De neste bildene i serien, syklisk.
  const sideCount = Math.min(SIDE_COUNT, total - 1);
  const side = Array.from({ length: sideCount }, (_, i) => {
    const at = (safeIndex + i + 1) % total;
    return { at, url: images[at]! };
  });

  // Bilder som ikke får plass i stripen — vises som «+N» på siste rute.
  const hidden = total - 1 - sideCount;

  return (
    <section
      className={cn(
        "grid gap-1.5",
        // På smal skjerm ville 2fr/1fr gjort både hovedbilde og ruter for
        // små; der stables de i stedet med rutene på rad under.
        sideCount > 0 && "sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]",
        className,
      )}
      aria-label="Bilder fra annonsen"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-secondary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sized(current, "960w")}
          alt={alt}
          className="size-full object-cover"
        />
        {total > 1 ? (
          <>
            <button
              type="button"
              aria-label="Forrige bilde"
              onClick={() => go(safeIndex - 1)}
              className="absolute inset-y-0 left-0 flex w-10 items-center justify-center text-white/90 transition-colors hover:bg-black/25"
            >
              <ChevronLeft className="size-5 drop-shadow" />
            </button>
            <button
              type="button"
              aria-label="Neste bilde"
              onClick={() => go(safeIndex + 1)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-white/90 transition-colors hover:bg-black/25"
            >
              <ChevronRight className="size-5 drop-shadow" />
            </button>
            <p className="absolute bottom-2 right-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium tabular-nums text-white">
              {safeIndex + 1} / {total}
            </p>
          </>
        ) : null}
      </div>

      {sideCount > 0 ? (
        // Fra sm: `min-h-0` + absolutt plasserte bilder gjør at rutene ikke
        // har egen naturlig høyde. Da settes radhøyden av hovedbildet, og
        // rutene deler nøyaktig den høyden mellom seg.
        <div className="grid min-h-0 auto-cols-fr grid-flow-col gap-1.5 sm:auto-rows-fr sm:grid-flow-row sm:grid-cols-1">
          {side.map((image, i) => {
            const isLast = i === sideCount - 1;
            return (
              <button
                key={image.url}
                type="button"
                aria-label={`Vis bilde ${image.at + 1} av ${total}`}
                onClick={() => setIndex(image.at)}
                className="group relative min-h-0 aspect-[4/3] overflow-hidden rounded-xl border border-border bg-secondary sm:aspect-auto"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sized(image.url, "320w")}
                  alt=""
                  className="absolute inset-0 size-full object-cover transition-transform duration-200 group-hover:scale-[1.04]"
                />
                {isLast && hidden > 0 ? (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-sm font-semibold text-white">
                    +{hidden}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
