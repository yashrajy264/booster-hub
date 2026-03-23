import { PDFDocument } from "pdf-lib";

export type PreviewRange = {
  startPage: number;
  endPage: number;
};

export function parsePreviewRange(start: unknown, end: unknown): PreviewRange | null {
  const startPage = Number(start);
  const endPage = Number(end);
  if (!Number.isInteger(startPage) || !Number.isInteger(endPage)) return null;
  if (startPage < 1 || endPage < 1) return null;
  if (endPage < startPage) return null;
  return { startPage, endPage };
}

export async function clipPdfToRange(pdfBytes: ArrayBuffer, range: PreviewRange): Promise<Uint8Array> {
  const sourceDoc = await PDFDocument.load(pdfBytes);
  const totalPages = sourceDoc.getPageCount();
  if (range.startPage > totalPages || range.endPage > totalPages) {
    throw new Error("Requested preview range exceeds available pages");
  }

  const outDoc = await PDFDocument.create();
  const pageIndexes = Array.from(
    { length: range.endPage - range.startPage + 1 },
    (_, idx) => range.startPage - 1 + idx,
  );
  const pages = await outDoc.copyPages(sourceDoc, pageIndexes);
  for (const page of pages) outDoc.addPage(page);
  return outDoc.save();
}
