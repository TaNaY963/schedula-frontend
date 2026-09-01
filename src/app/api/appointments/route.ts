// import { appointments } from "@/lib/mock-data/appointments";
// export async function GET() { return Response.json({ data: appointments, meta: { total: appointments.length } }); }


import { appointments } from "@/lib/mock-data/appointments";
import { AppointmentStatus } from "@/types/appointment";

// GET — Fetch appointments
export async function GET() {
  return Response.json({
    data: appointments,
    meta: {
      total: appointments.length,
    },
  });
}

// PATCH — Update an appointment
export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const {
      id,
      status,
      date,
      startTime,
      endTime,
    } = body;

    if (!id) {
      return Response.json(
        { error: "Appointment ID is required" },
        { status: 400 }
      );
    }

    const appointment = appointments.find(
      (appointment) => appointment.id === id
    );

    if (!appointment) {
      return Response.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Update status if provided
    if (status) {
      const validStatuses: AppointmentStatus[] = [
        "pending",
        "confirmed",
        "upcoming",
        "completed",
        "cancelled",
        "missed",
      ];

      if (!validStatuses.includes(status)) {
        return Response.json(
          { error: "Invalid appointment status" },
          { status: 400 }
        );
      }

      appointment.status = status;
    }

    // Update date/time when rescheduling
    if (date) {
      appointment.date = date;
    }

    if (startTime) {
      appointment.startTime = startTime;
    }

    if (endTime) {
      appointment.endTime = endTime;
    }

    appointment.updatedAt = new Date().toISOString();

    return Response.json({
      message: "Appointment updated successfully",
      data: appointment,
    });
  } catch {
    return Response.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
