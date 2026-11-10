"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { KI_PRODUCTS, type KiProductId } from "@/lib/site";

/** Betalingsvalget for en opplastet salgsoppgave som ikke er betalt. */
export function PayPanel({ id }: { id: string }) {
  const [busy, setBusy] = useState<KiProductId | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function pay(product: KiProductId) {
    setBusy(product);
    setError(null);
    try {
      const response = await fetch(`/api/analyse/${id}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consent: true, product }),
      });
      const data = (await response.json()) as { redirectUrl?: string; message?: string };
      if (!response.ok || !data.redirectUrl) {
        throw new Error(data.message ?? "Kunne ikke starte betalingen.");
      }
      window.location.assign(data.redirectUrl);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Kunne ikke starte betalingen.");
      setBusy(null);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void pay("ki-analyse-1")}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-[15px] font-medium text-[#111] transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {busy === "ki-analyse-1" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          Betal {KI_PRODUCTS["ki-analyse-1"].priceNok} kr med Vipps
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void pay("ki-analyse-5")}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-4 text-[15px] font-medium transition-colors hover:bg-white/10 disabled:opacity-60"
        >
          {busy === "ki-analyse-5" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          Fem analyser for {KI_PRODUCTS["ki-analyse-5"].priceNok} kr
        </button>
      </div>
      {error ? <p className="mt-3 text-sm text-[#ff8a66]">{error}</p> : null}
      <p className="mt-4 text-xs text-white/55">
        Ingen konto, ingen binding. Feiler analysen, betaler du ikke for den. Ved å
        betale godtar du{" "}
        <Link href="/vilkar" className="underline underline-offset-2">
          salgsvilkårene
        </Link>
        .
      </p>
    </div>
  );
}

/**
 * Starter analysen og venter på den. Kjøringen startes med et eksplisitt
 * POST herfra – aldri av at siden lastes – og serveren sørger for at to
 * faner ikke kan starte samme analyse to ganger.
 */
export function RunPanel({
  id,
  initialError,
}: {
  id: string;
  initialError: string | null;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(initialError);
  const [running, setRunning] = useState(initialError === null);
  const started = useRef(false);

  const poll = useCallback(async () => {
    for (;;) {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      const response = await fetch(`/api/analyse/${id}`, { cache: "no-store" });
      const data = (await response.json()) as { status?: string; error?: string | null };
      if (data.status === "done") return router.refresh();
      if (data.status === "failed") {
        setError(data.error ?? "Analysen feilet. Du er ikke belastet – prøv igjen.");
        setRunning(false);
        return;
      }
    }
  }, [id, router]);

  const run = useCallback(async () => {
    setError(null);
    setRunning(true);
    try {
      const response = await fetch(`/api/analyse/${id}/run`, { method: "POST" });
      const data = (await response.json()) as { status?: string; message?: string };
      if (response.ok && data.status === "done") return router.refresh();
      if (response.ok && data.status === "running") return poll();
      throw new Error(data.message ?? "Analysen feilet. Du er ikke belastet – prøv igjen.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Analysen feilet.");
      setRunning(false);
    }
  }, [id, poll, router]);

  useEffect(() => {
    if (started.current || initialError !== null) return;
    started.current = true;
    void run();
  }, [run, initialError]);

  if (running) {
    return (
      <div className="flex items-center gap-3 text-[15px]">
        <Loader2 className="size-5 animate-spin" aria-hidden />
        <div>
          <p className="font-medium">KI-en leser salgsoppgaven</p>
          <p className="text-sm text-white/60">
            Det kan ta et par minutter. La siden stå åpen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[15px] text-[#ff8a66]">{error}</p>
      <button
        type="button"
        onClick={() => void run()}
        className="mt-4 inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-medium text-[#111]"
      >
        Prøv igjen
      </button>
    </div>
  );
}
