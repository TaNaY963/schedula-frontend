import type { Prescription } from "@/types/prescription";

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

export default function PrescriptionDetails({
  prescription,
}: {
  prescription: Prescription;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-[var(--line)] p-4">
          <p className="text-sm text-[var(--muted)]">Doctor</p>
          <p className="mt-1 font-medium">{prescription.doctorName}</p>
        </div>

        <div className="rounded-lg border border-[var(--line)] p-4">
          <p className="text-sm text-[var(--muted)]">Diagnosis</p>
          <p className="mt-1 font-medium">{prescription.diagnosis}</p>
        </div>

        <div className="rounded-lg border border-[var(--line)] p-4">
          <p className="text-sm text-[var(--muted)]">Prescribed on</p>
          <p className="mt-1 font-medium">
            {formatDateTime(prescription.createdAt)}
          </p>
        </div>

        <div className="rounded-lg border border-[var(--line)] p-4">
          <p className="text-sm text-[var(--muted)]">Appointment</p>
          <p className="mt-1 font-medium">{prescription.appointmentId}</p>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold">Medicines</h3>

        <div className="mt-3 space-y-3">
          {prescription.medicines.map((medicine, index) => (
            <div
              key={medicine.id}
              className="rounded-lg border border-[var(--line)] bg-[var(--canvas)] p-4"
            >
              <p className="text-sm font-semibold">
                {index + 1}. {medicine.name}
              </p>

              <div className="mt-2 grid gap-2 text-sm sm:grid-cols-3">
                <p>
                  <span className="text-[var(--muted)]">Dosage: </span>
                  {medicine.dosage}
                </p>
                <p>
                  <span className="text-[var(--muted)]">Frequency: </span>
                  {medicine.frequency}
                </p>
                <p>
                  <span className="text-[var(--muted)]">Duration: </span>
                  {medicine.duration}
                </p>
              </div>

              <p className="mt-2 text-sm">
                <span className="text-[var(--muted)]">Instructions: </span>
                {medicine.instructions}
              </p>
            </div>
          ))}
        </div>
      </div>

      {prescription.generalInstructions && (
        <div className="rounded-lg border border-[var(--line)] p-4">
          <p className="text-sm text-[var(--muted)]">
            General instructions
          </p>
          <p className="mt-1 text-sm">{prescription.generalInstructions}</p>
        </div>
      )}
    </div>
  );
}
