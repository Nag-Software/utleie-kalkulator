import { PDFArray, PDFDocument, PDFName, PDFNumber, PDFRawStream } from "pdf-lib";

/**
 * Krymper en PDF i nettleseren ved å skalere ned og komprimere bildene på
 * nytt. Tekst og vektorgrafikk røres ikke, så dokumentet er like lesbart –
 * det er fotografiene som veier i en salgsoppgave.
 *
 * Alt skjer på kundens maskin: ingen server, ingen tjeneste, ingen kostnad.
 * Modulen lastes bare når en fil faktisk er for stor (dynamisk import).
 */
const NAME = {
  subtype: PDFName.of("Subtype"),
  image: PDFName.of("Image"),
  filter: PDFName.of("Filter"),
  dct: PDFName.of("DCTDecode"),
  imageMask: PDFName.of("ImageMask"),
  width: PDFName.of("Width"),
  height: PDFName.of("Height"),
  colorSpace: PDFName.of("ColorSpace"),
  deviceRgb: PDFName.of("DeviceRGB"),
  bits: PDFName.of("BitsPerComponent"),
  decode: PDFName.of("Decode"),
  decodeParms: PDFName.of("DecodeParms"),
};

/** Stadig hardere innstillinger; vi stopper på den første som er liten nok. */
const PASSES = [
  { maxSide: 2000, quality: 0.7 },
  { maxSide: 1400, quality: 0.55 },
  { maxSide: 1000, quality: 0.45 },
  { maxSide: 800, quality: 0.35 },
];

/** Bilder under dette er ikke verdt å røre (logoer, ikoner). */
const MIN_IMAGE_BYTES = 40_000;

function isJpeg(filter: unknown): boolean {
  if (filter === NAME.dct) return true;
  return filter instanceof PDFArray && filter.size() === 1 && filter.get(0) === NAME.dct;
}

async function reencode(
  jpeg: Uint8Array,
  maxSide: number,
  quality: number,
): Promise<{ bytes: Uint8Array; width: number; height: number } | null> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(new Blob([jpeg as BlobPart], { type: "image/jpeg" }));
  } catch {
    return null; // Nettleseren kan ikke lese bildet: la det stå.
  }
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return null;
  // JPEG har ingen gjennomsiktighet; hvit bunn hindrer svarte flater.
  context.fillStyle = "#fff";
  context.fillRect(0, 0, width, height);
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality),
  );
  canvas.width = 0;
  canvas.height = 0;
  if (!blob) return null;
  return { bytes: new Uint8Array(await blob.arrayBuffer()), width, height };
}

async function compressOnce(
  source: ArrayBuffer,
  pass: (typeof PASSES)[number],
  onProgress?: (done: number, total: number) => void,
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(source);
  const images = doc.context.enumerateIndirectObjects().filter(
    ([, object]) =>
      object instanceof PDFRawStream &&
      object.dict.get(NAME.subtype) === NAME.image &&
      isJpeg(object.dict.get(NAME.filter)) &&
      !object.dict.has(NAME.imageMask) &&
      object.contents.byteLength >= MIN_IMAGE_BYTES,
  );

  let done = 0;
  for (const [ref, object] of images) {
    const stream = object as PDFRawStream;
    const next = await reencode(stream.contents, pass.maxSide, pass.quality);
    done += 1;
    onProgress?.(done, images.length);
    if (!next || next.bytes.byteLength >= stream.contents.byteLength * 0.9) continue;

    const dict = stream.dict;
    dict.set(NAME.width, PDFNumber.of(next.width));
    dict.set(NAME.height, PDFNumber.of(next.height));
    dict.set(NAME.filter, NAME.dct);
    // Det nye bildet er alltid 8-bits RGB, uansett hva originalen var.
    dict.set(NAME.colorSpace, NAME.deviceRgb);
    dict.set(NAME.bits, PDFNumber.of(8));
    dict.delete(NAME.decode);
    dict.delete(NAME.decodeParms);
    doc.context.assign(ref, PDFRawStream.of(dict, next.bytes));
  }
  return doc.save({ useObjectStreams: true });
}

/**
 * Returnerer en PDF på høyst `targetBytes`, eller kaster hvis den ikke lar
 * seg krympe nok (f.eks. skannede dokumenter i et annet bildeformat, eller
 * passordbeskyttede filer).
 */
export async function compressPdf(
  file: File,
  targetBytes: number,
  onProgress?: (done: number, total: number) => void,
): Promise<File> {
  const source = await file.arrayBuffer();
  for (const pass of PASSES) {
    const bytes = await compressOnce(source, pass, onProgress);
    if (bytes.byteLength <= targetBytes) {
      return new File([bytes as BlobPart], file.name, { type: "application/pdf" });
    }
  }
  throw new Error("PDF-en lot seg ikke komprimere nok");
}
