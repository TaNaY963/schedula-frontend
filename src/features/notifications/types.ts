export type PatientNotificationType =
  | "appointment"
  | "reminder"
  | "status"
  | "prescription";

export type PatientNotification = {
  id: string;
  appointmentId?: string;
  title: string;
  message: string;
  date: string;
  type: PatientNotificationType;
  href: string;
};
