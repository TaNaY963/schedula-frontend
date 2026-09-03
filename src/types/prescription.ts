export interface PrescriptionMedicine {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }
  
  export interface Prescription {
    id: string;
    appointmentId: string;
    doctorId: string;
    doctorName: string;
    patientId: string;
    patientName: string;
    diagnosis: string;
    medicines: PrescriptionMedicine[];
    generalInstructions?: string;
    createdAt: string;
    updatedAt: string;
  }