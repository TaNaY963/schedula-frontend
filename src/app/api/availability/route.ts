import { availabilitySlots } from "@/lib/mock-data/availability";

export async function GET() {
  return Response.json({
    data: availabilitySlots,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      doctorId,
      date,
      startTime,
      endTime,
      recurring,
      recurrence,
    } = body;

    if (!doctorId || !date || !startTime || !endTime) {
      return Response.json(
        {
          error:
            "doctorId, date, startTime and endTime are required",
        },
        { status: 400 },
      );
    }

    if (startTime >= endTime) {
      return Response.json(
        {
          error: "End time must be later than start time",
        },
        { status: 400 },
      );
    }

    const overlappingSlot = availabilitySlots.find(
      (slot) =>
        slot.doctorId === doctorId &&
        slot.date === date &&
        slot.available &&
        startTime < slot.endTime &&
        endTime > slot.startTime,
    );

    if (overlappingSlot) {
      return Response.json(
        {
          error:
            "This availability slot overlaps with an existing slot",
        },
        { status: 409 },
      );
    }

    const newSlot = {
      id: `slot-${Date.now()}`,
      doctorId,
      date,
      startTime,
      endTime,
      available: true,
      recurring: Boolean(recurring),
      ...(recurring && recurrence
        ? { recurrence }
        : {}),
    };

    availabilitySlots.push(newSlot);

    return Response.json(
      {
        data: newSlot,
      },
      { status: 201 },
    );
  } catch {
    return Response.json(
      {
        error: "Unable to create availability slot",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return Response.json(
        {
          error: "Slot id is required",
        },
        { status: 400 },
      );
    }

    const index = availabilitySlots.findIndex(
      (slot) => slot.id === id,
    );

    if (index === -1) {
      return Response.json(
        {
          error: "Availability slot not found",
        },
        { status: 404 },
      );
    }

    const removedSlot = availabilitySlots.splice(index, 1)[0];

    return Response.json({
      data: removedSlot,
    });
  } catch {
    return Response.json(
      {
        error: "Unable to remove availability slot",
      },
      { status: 500 },
    );
  }
}
