import type { AssistantConfig } from "../types";

export const patientAssistantConfig: AssistantConfig = {
  initialMessage: "Hi! 👋 How can I help you today?",
  fallbackMessage:
    "I'm still learning! You can choose one of the options below and I'll guide you.",
  menuOptions: [
    {
      id: "find-doctor",
      label: "Find a doctor",
      keywords: [
        "find doctor",
        "search doctor",
        "find a doctor",
        "search doctors",
        "doctor search",
      ],
      response:
        "Browse our directory of doctors by specialty, name, or location.",
      actions: [
        {
          id: "patient-find-doctor",
          label: "Find a Doctor",
          type: "navigate",
          href: "/doctors",
        },
      ],
    },
    {
      id: "book-appointment",
      label: "Book an appointment",
      keywords: [
        "book appointment",
        "book an appointment",
        "schedule appointment",
        "make appointment",
        "booking",
      ],
      response:
        "Select a doctor and choose an available time slot to book your appointment.",
      actions: [
        {
          id: "patient-book",
          label: "Book Appointment",
          type: "navigate",
          href: "/doctors",
        },
      ],
    },
    {
      id: "my-appointments",
      label: "My appointments",
      keywords: [
        "my appointments",
        "appointments",
        "upcoming appointments",
        "view appointments",
      ],
      response: "View and manage your upcoming and past appointments.",
      actions: [
        {
          id: "patient-appointments",
          label: "My Appointments",
          type: "navigate",
          href: "/user/appointments",
        },
      ],
    },
    {
      id: "my-prescriptions",
      label: "My prescriptions",
      keywords: [
        "my prescriptions",
        "prescription",
        "prescriptions",
        "medication",
        "medicine",
      ],
      response: "View prescriptions issued by your doctors.",
      actions: [
        {
          id: "patient-prescriptions",
          label: "My Prescriptions",
          type: "navigate",
          href: "/user/prescriptions",
        },
      ],
    },
    {
      id: "my-profile",
      label: "My profile",
      keywords: ["my profile", "profile", "account settings", "my account"],
      response: "Update your personal information and account details.",
      actions: [
        {
          id: "patient-profile",
          label: "My Profile",
          type: "navigate",
          href: "/user/profile",
        },
      ],
    },
    {
      id: "help",
      label: "Help",
      keywords: ["help", "support", "how to", "guide"],
      response:
        "As a patient on Schedula, you can:\n\n• Search and browse doctors\n• Book appointments with available doctors\n• View and manage your appointments\n• Access your prescriptions\n• Update your profile\n\nUse the navigation menu or the options below to get started.",
    },
  ],
};
