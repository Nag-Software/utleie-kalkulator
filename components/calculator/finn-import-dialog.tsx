"use client";

import { ArrowRight, Loader2, Search, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FinnPreview } from "@/lib/finn/types";
import { formatNOK } from "@/lib/format";
import { PRICE_NOK } from "@/lib/site";

type Phase = "input" | "previewing" | "preview" | "paying";

export function FinnImportDialog({
  trigger,
}: {
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("input");
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<FinnPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [paymentsEnabled, setPaymentsEnabled] = useState<boolean | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!open || paymentsEnabled !== null) return;
    fetch("/api/config")
      .then((r) => r.json())
      .then((c: { paymentsEnabled: boolean }) =>
        setPaymentsEnabled(c.paymentsEnabled),
      )
      .catch(() => setPaymentsEnabled(false));
  }, [open, paymentsEnabled]);

  async function fetchPreview() {
    setPhase("previewing");
    setError(null);
    try {
      const response = await fetch("/api/finn/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finnUrl: url }),
      });
      const data = (await response.json()) as
        | FinnPreview
        | { error: string; message: string };
      if (!response.ok) {
        setError((data as { message: string }).message ?? "Noe gikk galt.");
        setPhase("input");
        return;
      }
      setPreview(data as FinnPreview);
      setPhase("preview");
    } catch {
      setError("Noe gikk galt. Sjekk nettverket og prøv igjen.");
      setPhase("input");
    }
  }

  async function startCheckout() {
    if (!preview) return;
    setPhase("paying");
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finnkode: preview.finnkode, consent: true }),
      });
      const data = (await response.json()) as
        | { checkoutUrl: string }
        | { error: string; message: string };
      if (!response.ok) {
        setError((data as { message: string }).message ?? "Noe gikk galt.");
        setPhase("preview");
        return;
      }
      window.location.href = (data as { checkoutUrl: string }).checkoutUrl;
    } catch {
      setError("Kunne ikke starte betalingen. Prøv igjen.");
      setPhase("preview");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setPhase("input");
          setPreview(null);
          setError(null);
          setConsent(false);
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            size="lg"
            className="h-11 rounded-full bg-cta px-6 text-[15px] font-semibold text-cta-foreground hover:bg-cta/90"
          >
            <Sparkles data-slot="icon" />
            Hent fra FINN-annonse
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Hent tall fra FINN</DialogTitle>
          <DialogDescription>
            Vi fyller ut tallene fra annonsen og gir deg en objektiv
            KI-vurdering av lønnsomheten.
          </DialogDescription>
        </DialogHeader>

        {phase === "input" || phase === "previewing" ? (
          <form
            ref={formRef}
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (url.trim()) void fetchPreview();
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="finn-url">Lim inn FINN-lenken</Label>
              <Input
                id="finn-url"
                placeholder="https://www.finn.no/…"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onPaste={() =>
                  setTimeout(() => formRef.current?.requestSubmit(), 50)
                }
                autoComplete="off"
                autoFocus
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-full"
              disabled={phase === "previewing" || !url.trim()}
            >
              {phase === "previewing" ? (
                <Loader2 data-slot="icon" className="animate-spin" />
              ) : (
                <Search data-slot="icon" />
              )}
              Finn annonsen
            </Button>
          </form>
        ) : null}

        {(phase === "preview" || phase === "paying") && preview ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border p-3">
              {preview.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview.imageUrl}
                  alt=""
                  className="size-16 shrink-0 rounded-md object-cover"
                />
              ) : null}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {preview.address ?? preview.title ?? `FINN-kode ${preview.finnkode}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {[
                    preview.propertyType,
                    preview.ownershipType,
                    preview.askingPrice ? formatNOK(preview.askingPrice) : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <button
                  type="button"
                  className="mt-0.5 text-xs text-primary hover:underline"
                  onClick={() => {
                    setPhase("input");
                    setPreview(null);
                  }}
                >
                  Feil bolig? Lim inn en annen lenke
                </button>
              </div>
            </div>

            {paymentsEnabled === false ? (
              <p className="rounded-lg bg-secondary p-3 text-sm text-secondary-foreground">
                Betaling er ikke tilgjengelig ennå – FINN-import lanseres snart.
                I mellomtiden kan du bruke den manuelle kalkulatoren gratis.
              </p>
            ) : (
              <>
                <label className="flex items-start gap-2.5 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 size-4 accent-primary"
                  />
                  <span>
                    Jeg samtykker til at leveringen starter umiddelbart, og at
                    angreretten dermed bortfaller (angrerettloven § 22 n).
                  </span>
                </label>
                <Button
                  className="w-full rounded-full bg-cta font-semibold text-cta-foreground hover:bg-cta/90"
                  size="lg"
                  disabled={!consent || phase === "paying"}
                  onClick={() => void startCheckout()}
                >
                  {phase === "paying" ? (
                    <Loader2 data-slot="icon" className="animate-spin" />
                  ) : (
                    <ArrowRight data-slot="icon" />
                  )}
                  Hent tall og beregn – {PRICE_NOK} kr
                </Button>
                <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="size-3.5" aria-hidden />
                  Sikker betaling med Stripe · Automatisk refusjon hvis henting
                  feiler
                </p>
              </>
            )}
          </div>
        ) : null}

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </DialogContent>
    </Dialog>
  );
}
