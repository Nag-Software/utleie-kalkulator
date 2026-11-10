"use client";

import { ArrowRight, FileUp, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  KI_COMPRESS_TARGET_BYTES,
  KI_MAX_BYTES,
  KI_RAW_MAX_BYTES,
} from "@/lib/site";

/**
 * Opplasting av salgsoppgaven. Filen går rett fra nettleseren til
 * lagringen (den er for stor til å gå gjennom serveren vår), og kunden
 * sendes videre til rapportsiden, der betaling og analyse skjer.
 */
const megabytes = (bytes: number) => Math.round(bytes / 1024 / 1024);

/**
 * Filer over grensen komprimeres her i nettleseren før de lastes opp. Det
 * koster ingenting og krever ingen tjeneste; biblioteket hentes først når
 * det trengs.
 */
async function shrinkIfNeeded(
  file: File,
  onStatus: (status: string) => void,
): Promise<File> {
  if (file.size <= KI_MAX_BYTES) return file;
  if (file.size > KI_RAW_MAX_BYTES) {
    throw new Error(`PDF-en er for stor. Grensen er ${megabytes(KI_RAW_MAX_BYTES)} MB.`);
  }
  onStatus("Komprimerer …");
  try {
    const { compressPdf } = await import("@/lib/pdf-compress");
    return await compressPdf(file, KI_COMPRESS_TARGET_BYTES, (done, total) =>
      onStatus(`Komprimerer ${Math.round((done / total) * 100)} %`),
    );
  } catch {
    throw new Error(
      `PDF-en er ${megabytes(file.size)} MB og lot seg ikke komprimere under ${megabytes(KI_MAX_BYTES)} MB. Prøv en mindre versjon av salgsoppgaven.`,
    );
  }
}

async function upload(
  original: File,
  onStatus: (status: string) => void,
): Promise<string> {
  if (!/\.pdf$/i.test(original.name)) throw new Error("Last opp salgsoppgaven som PDF.");
  const file = await shrinkIfNeeded(original, onStatus);
  onStatus("Laster opp …");

  const created = await fetch("/api/analyse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, sizeBytes: file.size }),
  });
  const data = (await created.json()) as { id?: string; uploadUrl?: string; message?: string };
  if (!created.ok || !data.id || !data.uploadUrl) {
    throw new Error(data.message ?? "Kunne ikke starte opplastingen.");
  }

  const put = await fetch(data.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": "application/pdf" },
    body: file,
  });
  if (!put.ok) throw new Error("Opplastingen feilet. Prøv igjen.");

  const confirmed = await fetch(`/api/analyse/${data.id}/uploaded`, { method: "POST" });
  if (!confirmed.ok) throw new Error("Opplastingen feilet. Prøv igjen.");
  return data.id;
}

export function UploadProspectus({ variant }: { variant: "hero" | "button" }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  const busy = status !== null;
  const [dragging, setDragging] = useState(false);

  async function handle(file: File | undefined) {
    if (!file || busy) return;
    setStatus("Laster opp …");
    try {
      const id = await upload(file, setStatus);
      router.push(`/analyse/${id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Opplastingen feilet.");
      setStatus(null);
    }
  }

  const input = (
    <input
      ref={inputRef}
      type="file"
      accept="application/pdf,.pdf"
      className="sr-only"
      tabIndex={-1}
      onChange={(event) => {
        void handle(event.target.files?.[0]);
        event.target.value = "";
      }}
    />
  );

  if (variant === "button") {
    return (
      <>
        {input}
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-[#111] transition-opacity hover:opacity-90 disabled:opacity-70"
        >
          {busy ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <FileUp className="size-4" aria-hidden />
          )}
          {status ?? "Last opp salgsoppgave"}
        </button>
      </>
    );
  }

  return (
    <>
      {input}
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void handle(event.dataTransfer.files?.[0]);
        }}
        className={`flex w-full max-w-md items-center gap-3 rounded-full bg-white p-1.5 pl-5 text-left text-foreground shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] transition-shadow ${
          dragging ? "ring-4 ring-white/50" : ""
        }`}
      >
        <FileUp className="size-[18px] shrink-0" aria-hidden />
        <span className="min-w-0 flex-1 truncate text-[15px] text-muted-foreground">
          {status ?? (dragging ? "Slipp for å laste opp" : "Slipp salgsoppgaven her")}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background">
          {busy ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <>
              Analyser
              <ArrowRight className="size-4" aria-hidden />
            </>
          )}
        </span>
      </button>
    </>
  );
}
