import { appointments } from "@/lib/mock-data/appointments";
import { prescriptions } from "@/lib/mock-data/prescriptions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get("patientId");
  const appointmentId = searchParams.get("appointmentId");
  const doctorId = searchParams.get("doctorId");

  let data = prescriptions;

  if (patientId) {
    data = data.filter((prescription) => prescription.patientId === patientId);
  }

  if (appointmentId) {
    data = data.filter(
      (prescription) => prescription.appointmentId === appointmentId,
    );
  }

  if (doctorId) {
    data = data.filter((prescription) => prescription.doctorId === doctorId);
  }

  return Response.json({
    data,
    meta: {
      total: data.length,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      appointmentId,
      doctorId,
      doctorName,
      patientId,
      patientName,
      diagnosis,
      medicines,
      generalInstructions,
    } = body;

    if (
      !appointmentId ||
      !doctorId ||
      !doctorName ||
      !patientId ||
      !patientName ||
      !diagnosis ||
      !Array.isArray(medicines) ||
      medicines.length === 0
    ) {
      return Response.json(
        { error: "Missing required prescription details" },
        { status: 400 },
      );
    }

    const existingPrescription = prescriptions.find(
        (prescription) =>
          prescription.appointmentId === appointmentId,
      );
      
      if (existingPrescription) {
        return Response.json(
          {
            error: "A prescription already exists for this appointment",
          },
          { status: 409 },
        );
      }

    const now = new Date().toISOString();

    const newPrescription = {
      id: `pres-${Date.now()}`,
      appointmentId,
      doctorId,
      doctorName,
      patientId,
      patientName,
      diagnosis,
      medicines,
      generalInstructions: generalInstructions || "",
      createdAt: now,
      updatedAt: now,
    };

    prescriptions.push(newPrescription);

    const appointment = appointments.find(
      (item) => item.id === appointmentId,
    );

    if (appointment) {
      appointment.prescriptionAvailable = true;
      appointment.updatedAt = now;
    }

    return Response.json(
      {
        message: "Prescription created successfully",
        data: newPrescription,
      },
      { status: 201 },
    );
  } catch {
    return Response.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const {
      id,
      diagnosis,
      medicines,
      generalInstructions,
    } = body;

    if (!id) {
      return Response.json(
        { error: "Prescription ID is required" },
        { status: 400 },
      );
    }

    const prescription = prescriptions.find(
      (item) => item.id === id,
    );

    if (!prescription) {
      return Response.json(
        { error: "Prescription not found" },
        { status: 404 },
      );
    }

    if (diagnosis !== undefined) {
      prescription.diagnosis = diagnosis;
    }

    if (medicines !== undefined) {
      if (!Array.isArray(medicines) || medicines.length === 0) {
        return Response.json(
          { error: "At least one medicine is required" },
          { status: 400 },
        );
      }

      prescription.medicines = medicines;
    }

    if (generalInstructions !== undefined) {
      prescription.generalInstructions = generalInstructions;
    }

    prescription.updatedAt = new Date().toISOString();

    return Response.json({
      message: "Prescription updated successfully",
      data: prescription,
    });
  } catch {
    return Response.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}