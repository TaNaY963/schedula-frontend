"use client";

import { useState } from "react";

import type { Prescription } from "@/types/prescription";
import { downloadPrescriptionPdf } from "@/features/prescriptions/utils/downloadPrescriptionPdf";

export default function DownloadPrescriptionButton({
  prescription,
}: {
  prescription: Prescription;
}) {
  const [error, setError] = useState("");

  function handleDownload() {
    try {
      setError("");
      downloadPrescriptionPdf(prescription);
    } catch (err) {
      console.error(err);
      setError("Unable to download this prescription.");
    }
  }

  return (
    <div className="flex flex-col items-start gap-1 sm:items-end">
      <button
        type="button"
        onClick={handleDownload}
        className="rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-deep)]"
      >
        Download PDF
      </button>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
