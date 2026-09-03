"use client";

import { AlertTriangle, Check, ExternalLink, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { Calculator } from "@/components/calculator/calculator";
import { Button } from "@/components/ui/button";
import type { CalcInput } from "@/lib/calc/schema";
import type { FinnParsedData } from "@/lib/finn/types";
import { formatNOK } from "@/lib/format";

function FinnInfoCard({
  finn,
  warnings,
}: {
  finn: FinnParsedData;
  warnings: string[];
}) {
  return (
    <div className="mb-5 flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
      {finn.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={finn.imageUrl}
          alt=""
          className="hidden size-16 rounded-xl object-cover sm:block"
        />
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold tracking-[-0.01em]">
          {finn.address ?? finn.title ?? `FINN-kode ${finn.finnkode}`}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {[
            finn.propertyType,
            finn.ownershipTypeRaw,
            finn.internalArea ? `${finn.internalArea} m²` : null,
            finn.buildYear ? `Byggeår ${finn.buildYear}` : null,
            finn.askingPrice ? formatNOK(finn.askingPrice) : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
        {warnings.length > 0 ? (
          <p className="mt-1 flex items-center gap-1 text-xs text-warning">
            <AlertTriangle className="size-3" />
            Noen felt manglet i annonsen – kontroller tallene under.
          </p>
        ) : null}
      </div>
      <Button asChild variant="ghost" size="sm">
        <a href={finn.url} target="_blank" rel="noopener noreferrer">
          <ExternalLink data-slot="icon" />
          <span className="hidden sm:inline">Se annonsen</span>
        </a>
      </Button>
    </div>
  );
}

export interface BeregningClientProps {
  finn: FinnParsedData | null;
  warnings: string[];
  initialInputs: CalcInput;
  importedFromFinn?: boolean;
}

export function BeregningClient({
  finn,
  warnings,
  initialInputs,
  importedFromFinn = Boolean(finn),
}: BeregningClientProps) {
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Lenke kopiert. Alle med lenken kan se beregningen.");
    } catch {
      toast.error("Kunne ikke kopiere lenken.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="eyebrow">FINN-beregning</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-positive/25 bg-positive/10 px-2.5 py-1 text-[11px] font-medium text-positive">
            <Check className="size-3" />
            {importedFromFinn ? "Hentet fra FINN" : "Beregning"}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={copyLink}>
          <LinkIcon data-slot="icon" />
          Kopier lenke
        </Button>
      </div>

      {finn ? <FinnInfoCard finn={finn} warnings={warnings} /> : null}

      <Calculator initialInput={initialInputs} urlSync />
    </div>
  );
}
