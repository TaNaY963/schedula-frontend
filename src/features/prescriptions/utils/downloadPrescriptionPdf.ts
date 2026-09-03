import type { Prescription } from "@/types/prescription";

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 54;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function sanitize(text: string) {
  return text
    .normalize("NFKC")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/[^\x20-\x7E]/g, (character) => {
      const replacements: Record<string, string> = {
        "\u2018": "'",
        "\u2019": "'",
        "\u201C": '"',
        "\u201D": '"',
        "\u2013": "-",
        "\u2014": "-",
        "\u2026": "...",
        "\u00A0": " ",
      };

      return replacements[character] ?? "?";
    });
}

function escapePdfText(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrapText(text: string, fontSize: number, maxWidth = CONTENT_WIDTH) {
  const averageCharWidth = fontSize * 0.52;
  const words = sanitize(text).split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return [""];
  }

  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;

    if (next.length * averageCharWidth > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

export function createPrescriptionPdf(prescription: Prescription) {
  type Line = {
    text: string;
    font: "F1" | "F2";
    size: number;
    gapAfter: number;
  };

  const lines: Line[] = [];

  const push = (
    text: string,
    font: Line["font"],
    size: number,
    gapAfter: number,
  ) => {
    const wrappedLines = wrapText(text, size);

    wrappedLines.forEach((wrapped, index) => {
      lines.push({
        text: wrapped,
        font,
        size,
        gapAfter: index === wrappedLines.length - 1 ? gapAfter : 4,
      });
    });
  };

  push("Schedula Prescription", "F1", 18, 10);
  push("Official copy for the patient", "F2", 11, 22);

  push(`Patient: ${prescription.patientName}`, "F2", 12, 8);
  push(`Doctor: ${prescription.doctorName}`, "F2", 12, 8);
  push(`Diagnosis: ${prescription.diagnosis}`, "F2", 12, 8);
  push(`Prescribed on: ${formatDateTime(prescription.createdAt)}`, "F2", 12, 8);
  push(`Appointment: ${prescription.appointmentId}`, "F2", 12, 18);

  push("Medicines", "F1", 14, 12);

  prescription.medicines.forEach((medicine, index) => {
    push(`${index + 1}. ${medicine.name}`, "F1", 12, 8);
    push(`Dosage: ${medicine.dosage}`, "F2", 11, 6);
    push(`Frequency: ${medicine.frequency}`, "F2", 11, 6);
    push(`Duration: ${medicine.duration}`, "F2", 11, 6);
    push(`Instructions: ${medicine.instructions}`, "F2", 11, 14);
  });

  if (prescription.generalInstructions) {
    push("General instructions", "F1", 14, 10);
    push(prescription.generalInstructions, "F2", 11, 8);
  }

  const pageStreams: string[] = [];
  let y = PAGE_HEIGHT - MARGIN;
  let currentCommands: string[] = [];

  const startPage = () => {
    y = PAGE_HEIGHT - MARGIN;
    currentCommands = ["BT"];
  };

  const finishPage = () => {
    currentCommands.push("ET");
    pageStreams.push(currentCommands.join("\n"));
  };

  startPage();

  for (const line of lines) {
    if (y - line.size < MARGIN + 24) {
      finishPage();
      startPage();
    }

    currentCommands.push(
      `/${line.font} ${line.size} Tf`,
      `1 0 0 1 ${MARGIN} ${y - line.size} Tm`,
      `(${escapePdfText(line.text)}) Tj`,
    );
    y -= line.size + line.gapAfter;
  }

  finishPage();

  const objects: string[] = [];
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");

  const pageCount = pageStreams.length;
  const firstPageObject = 3;
  const pageObjectNumbers = pageStreams.map(
    (_, index) => firstPageObject + index * 2,
  );
  const kids = pageObjectNumbers.map((number) => `${number} 0 R`).join(" ");

  objects.push(`<< /Type /Pages /Kids [${kids}] /Count ${pageCount} >>`);

  pageStreams.forEach((stream, index) => {
    const pageObjectNumber = pageObjectNumbers[index];
    const contentObjectNumber = pageObjectNumber + 1;

    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Contents ${contentObjectNumber} 0 R /Resources << /Font << /F1 ${firstPageObject + pageCount * 2} 0 R /F2 ${firstPageObject + pageCount * 2 + 1} 0 R >> >> >>`,
    );
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  });

  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  let offset = 0;

  const append = (text: string) => {
    const bytes = encoder.encode(text);
    chunks.push(bytes);
    offset += bytes.length;
  };

  append("%PDF-1.4\n");

  const xrefOffsets = [0];

  objects.forEach((object, index) => {
    xrefOffsets.push(offset);
    append(`${index + 1} 0 obj\n${object}\nendobj\n`);
  });

  const startxref = offset;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;

  for (let index = 1; index < xrefOffsets.length; index += 1) {
    xref += `${String(xrefOffsets[index]).padStart(10, "0")} 00000 n \n`;
  }

  append(xref);
  append(
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF\n`,
  );

  const pdf = new Uint8Array(offset);
  let cursor = 0;

  for (const chunk of chunks) {
    pdf.set(chunk, cursor);
    cursor += chunk.length;
  }

  return pdf;
}

export function downloadPrescriptionPdf(prescription: Prescription) {
  const pdf = createPrescriptionPdf(prescription);
  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `prescription-${prescription.id}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
