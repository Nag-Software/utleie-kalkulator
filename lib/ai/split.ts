import { PDFDocument } from "pdf-lib";

export interface PdfPart {
  bytes: Buffer;
  /** Sidetallet i originalen som denne delens side 1 tilsvarer. */
  firstPage: number;
  pageCount: number;
}

/**
 * KI-leverandøren tar ikke filer over 50 MB, men salgsoppgaver med mange
 * bilder kan være større. Store filer deles derfor i like store sidebolker
 * som leses hver for seg. En fil under grensen røres ikke – da slipper vi
 * også å tolke PDF-er som pdf-lib ikke forstår.
 */
export async function splitPdf(pdf: Buffer, maxPartBytes: number): Promise<PdfPart[]> {
  if (pdf.byteLength <= maxPartBytes) {
    return [{ bytes: pdf, firstPage: 1, pageCount: 0 }];
  }

  const source = await PDFDocument.load(pdf, { ignoreEncryption: false });
  const total = source.getPageCount();
  let count = Math.min(total, Math.ceil(pdf.byteLength / maxPartBytes));

  // Sidene er ikke like tunge, så en jevn deling kan gi en del som fortsatt
  // er for stor. Da deler vi i flere biter og prøver igjen.
  for (; count <= total; count += 1) {
    const size = Math.ceil(total / count);
    const parts: PdfPart[] = [];
    for (let start = 0; start < total; start += size) {
      const indices = Array.from(
        { length: Math.min(size, total - start) },
        (_, offset) => start + offset,
      );
      const part = await PDFDocument.create();
      for (const page of await part.copyPages(source, indices)) part.addPage(page);
      parts.push({
        bytes: Buffer.from(await part.save()),
        firstPage: start + 1,
        pageCount: indices.length,
      });
    }
    if (parts.every((part) => part.bytes.byteLength <= maxPartBytes)) return parts;
  }
  throw new Error("én enkelt side er større enn grensen");
}
