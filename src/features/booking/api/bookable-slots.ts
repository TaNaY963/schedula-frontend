type BookableDatesResponse = {
  data: string[];
};

type BookableTimesResponse = {
  data: string[];
};

type VisitHistoryResponse = {
  data: {
    hasVisitedDoctor: boolean;
  };
};

export async function getBookableDates(
  doctorId: string,
  durationMinutes: number,
) {
  const response = await fetch(
    `/api/availability/bookable?doctorId=${encodeURIComponent(doctorId)}&durationMinutes=${durationMinutes}`,
  );

  if (!response.ok) {
    throw new Error("Unable to load available dates");
  }

  const body = (await response.json()) as BookableDatesResponse;

  return body.data;
}

export async function getBookableStartTimes(
  doctorId: string,
  date: string,
  durationMinutes: number,
) {
  const response = await fetch(
    `/api/availability/bookable?doctorId=${encodeURIComponent(doctorId)}&date=${encodeURIComponent(date)}&durationMinutes=${durationMinutes}`,
  );

  if (!response.ok) {
    throw new Error("Unable to load available times");
  }

  const body = (await response.json()) as BookableTimesResponse;

  return body.data;
}

export async function getPatientDoctorVisitHistory(
  patientId: string,
  doctorId: string,
) {
  const response = await fetch(
    `/api/appointments/visit-history?patientId=${encodeURIComponent(patientId)}&doctorId=${encodeURIComponent(doctorId)}`,
  );

  if (!response.ok) {
    throw new Error("Unable to load visit history");
  }

  const body = (await response.json()) as VisitHistoryResponse;

  return body.data.hasVisitedDoctor;
}
