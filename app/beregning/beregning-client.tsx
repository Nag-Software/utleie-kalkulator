"use client";

import { AlertTriangle, Check, ExternalLink, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { Calculator } from "@/components/calculator/calculator";
import { ListingGallery } from "@/components/calculator/listing-gallery";
import { Button } from "@/components/ui/button";
import type { CalcInput } from "@/lib/calc/schema";
import type { FinnParsedData } from "@/lib/finn/types";
import { formatNOK } from "@/lib/format";
import type { EstimatedCalcField } from "@/lib/research/enrich";

export interface BeregningClientProps {
  finn: FinnParsedData | null;
  warnings: string[];
  initialInputs: CalcInput;
  estimatedFields?: EstimatedCalcField[];
  importedFromFinn?: boolean;
}

export function BeregningClient({
  finn,
  warnings,
  initialInputs,
  estimatedFields,
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
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
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

      <Calculator
        initialInput={initialInputs}
        urlSync
        estimatedFields={estimatedFields}
        // Bildene hører til i høyre kolonne, sammen med resultatene, slik at
        // venstre kolonne er forutsetningene alene.
        gallery={
          finn ? (
            <ListingGallery
              images={
                (finn.imageUrls?.length ?? 0) > 0
                  ? finn.imageUrls
                  : finn.imageUrl
                    ? [finn.imageUrl]
                    : []
              }
              alt={finn.address ?? finn.title ?? "Bolig"}
            />
          ) : null
        }
      />
    </div>
  );
}
