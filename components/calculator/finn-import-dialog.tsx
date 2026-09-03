"use client";

import {
  ArrowRight,
  Download,
  Loader2,
  Search,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { VippsMark } from "@/components/vipps-mark";
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
import {
  COMPANY,
  KLIPP_GYLDIGHET_MANEDER,
  KLIPP_PER_KJOP,
  KLIPP_PRIS_NOK,
} from "@/lib/site";

type Phase = "input" | "previewing" | "preview" | "working";

interface Me {
  paymentsEnabled: boolean;
  loginEnabled: boolean;
  loggedIn: boolean;
  klippekort: { remaining: number; total: number; unlocked: string[] };
}

const OFFLINE_ME: Me = {
  paymentsEnabled: false,
  loginEnabled: false,
  loggedIn: false,
  klippekort: { remaining: 0, total: 0, unlocked: [] },
};

export function FinnImportDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("input");
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<FinnPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [me, setMe] = useState<Me | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const loadPreview = useCallback(async (finnUrl: string) => {
    setPhase("previewing");
    setError(null);
    try {
      const response = await fetch("/api/finn/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finnUrl }),
      });
      const data = (await response.json()) as FinnPreview | { message: string };
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
  }, []);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetch("/api/me")
      .then((response) => response.json())
      .then((data: Me) => {
        if (!cancelled) setMe(data);
      })
      .catch(() => {
        if (!cancelled) setMe(OFFLINE_ME);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  async function unlock() {
    if (!preview) return;
    setPhase("working");
    setError(null);
    try {
      const response = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finnUrl: preview.finnkode }),
      });
      const data = (await response.json()) as
        | { calculationUrl: string }
        | { message: string };
      if (!response.ok) {
        setError((data as { message: string }).message ?? "Noe gikk galt.");
        setPhase("preview");
        return;
      }
      window.location.href = (data as { calculationUrl: string }).calculationUrl;
    } catch {
      setError("Kunne ikke åpne beregningen. Prøv igjen.");
      setPhase("preview");
    }
  }

  async function buy() {
    if (!preview) return;
    setPhase("working");
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consent: true, finnkode: preview.finnkode }),
      });
      const data = (await response.json()) as
        | { redirectUrl: string }
        | { message: string };
      if (!response.ok) {
        setError((data as { message: string }).message ?? "Noe gikk galt.");
        setPhase("preview");
        return;
      }
      window.location.href = (data as { redirectUrl: string }).redirectUrl;
    } catch {
      setError("Kunne ikke starte betalingen. Prøv igjen.");
      setPhase("preview");
    }
  }

  const remaining = me?.klippekort.remaining ?? 0;
  const alreadyUnlocked = Boolean(
    preview && me?.klippekort.unlocked.includes(preview.finnkode),
  );
  const canUnlock = remaining > 0 || alreadyUnlocked;
  const busy = phase === "working";
  // Etter innlogging lander brukeren på klippekortsiden med annonsen i
  // lomma, så kjøpet der sender ham rett til beregningen han var ute etter.
  const loginHref = preview
    ? `/api/auth/login?returnTo=${encodeURIComponent(`/klippekort?finn=${preview.finnkode}`)}`
    : "/api/auth/login?returnTo=%2Fklippekort";

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
          setMe(null);
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="cta" size="lg">
            <Download data-slot="icon" />
            Hent fra FINN-annonse
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Hent tall fra FINN</DialogTitle>
          <DialogDescription>
            Vi leser kjøpesum, felleskostnader, fellesgjeld og omkostninger
            fra annonsen og fyller ut kalkulatoren.
          </DialogDescription>
        </DialogHeader>

        {me?.klippekort.total ? (
          <p className="flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 text-[13px] font-medium">
            <Ticket className="size-3.5 text-cta" aria-hidden />
            {remaining} klipp igjen
          </p>
        ) : null}

        {phase === "input" || phase === "previewing" ? (
          <form
            ref={formRef}
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (url.trim()) void loadPreview(url);
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="finn-url">Lim inn FINN-lenken</Label>
              <Input
                id="finn-url"
                placeholder="https://www.finn.no/…"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                onPaste={() =>
                  setTimeout(() => formRef.current?.requestSubmit(), 50)
                }
                autoComplete="off"
                autoFocus
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              size="lg"
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

        {(phase === "preview" || phase === "working") && preview ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-border p-3">
              {preview.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview.imageUrl}
                  alt=""
                  className="size-16 shrink-0 rounded-lg object-cover"
                />
              ) : null}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {preview.address ??
                    preview.title ??
                    `FINN-kode ${preview.finnkode}`}
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
                  className="mt-0.5 text-xs text-cta hover:underline"
                  onClick={() => {
                    setPhase("input");
                    setPreview(null);
                  }}
                >
                  Feil bolig? Lim inn en annen lenke
                </button>
              </div>
            </div>

            {!me ? (
              <Button className="w-full" size="lg" disabled>
                <Loader2 data-slot="icon" className="animate-spin" />
                Henter klippekort
              </Button>
            ) : !me.paymentsEnabled ? (
              <p className="rounded-xl border border-border bg-secondary p-3.5 text-sm">
                Betaling er ikke tilgjengelig ennå. Den manuelle kalkulatoren
                er gratis i mellomtiden.
              </p>
            ) : canUnlock ? (
              <>
                <Button
                  variant="cta"
                  size="lg"
                  className="w-full"
                  disabled={busy}
                  onClick={() => void unlock()}
                >
                  {busy ? (
                    <Loader2 data-slot="icon" className="animate-spin" />
                  ) : (
                    <ArrowRight data-slot="icon" />
                  )}
                  {alreadyUnlocked
                    ? "Åpne beregningen igjen"
                    : "Hent tallene – bruk 1 klipp"}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  {alreadyUnlocked
                    ? "Denne annonsen er allerede låst opp og koster ikke et nytt klipp."
                    : `Du har ${remaining} klipp igjen.`}
                </p>
              </>
            ) : (
              // Ingen innlogging før kjøp: Vipps deler profilen som del av
              // betalingen, så kontoen opprettes av seg selv. Ett hopp til
              // Vipps, og kunden lander rett på beregningen.
              <>
                <label className="flex items-start gap-2.5 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => setConsent(event.target.checked)}
                    className="mt-0.5 size-4 accent-[#ff5d30]"
                  />
                  <span>
                    Jeg samtykker til at klippekortet leveres umiddelbart, og at
                    angreretten dermed bortfaller (angrerettloven § 22 n). Jeg
                    har lest{" "}
                    <a
                      href="/vilkar"
                      target="_blank"
                      className="font-medium text-foreground underline decoration-cta decoration-2 underline-offset-2 hover:text-cta"
                    >
                      salgsvilkårene
                    </a>
                    .
                  </span>
                </label>
                <Button
                  variant="cta"
                  size="lg"
                  className="w-full"
                  disabled={!consent || busy}
                  onClick={() => void buy()}
                >
                  {busy ? (
                    <Loader2 data-slot="icon" className="animate-spin" />
                  ) : (
                    <VippsMark data-slot="icon" />
                  )}
                  Betal {KLIPP_PRIS_NOK} kr med Vipps
                </Button>
                <div className="space-y-1.5 text-center text-xs text-muted-foreground">
                  <p className="flex items-center justify-center gap-1.5">
                    <ShieldCheck className="size-3.5" aria-hidden />
                    {KLIPP_PER_KJOP} klipp · engangsbetaling · gyldig{" "}
                    {KLIPP_GYLDIGHET_MANEDER} måneder
                  </p>
                  <p>
                    Selger: {COMPANY.legalName}, org.nr.{" "}
                    {COMPANY.organizationNumberFormatted}
                  </p>
                  {!me.loggedIn ? (
                    <p>
                      Har du klipp fra før?{" "}
                      <a
                        href={loginHref}
                        className="font-medium text-foreground underline"
                      >
                        Logg inn med Vipps
                      </a>
                    </p>
                  ) : null}
                </div>
              </>
            )}
          </div>
        ) : null}

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </DialogContent>
    </Dialog>
  );
}
