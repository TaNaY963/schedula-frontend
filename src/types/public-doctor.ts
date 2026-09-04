export type PublicDoctor = {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experienceYears: number;
  location: string;
  consultationFee: number;
  acceptingAppointments: boolean;
  imageUrl?: string;
  bio: string;
  consultationTypes: Array<"in-person" | "video">;
};
