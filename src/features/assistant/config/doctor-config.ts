import type { AssistantConfig } from "../types";

export const doctorAssistantConfig: AssistantConfig = {
  initialMessage: "Hi Doctor! 👋 How can I help you today?",
  fallbackMessage:
    "I'm still learning! You can choose one of the options below and I'll guide you.",
  menuOptions: [
    {
      id: "todays-appointments",
      label: "Today's appointments",
      keywords: [
        "today appointments",
        "today's appointments",
        "todays appointments",
        "appointments today",
        "schedule today",
      ],
      response:
        "Your appointment schedule can be managed from your doctor dashboard.",
      actions: [
        {
          id: "doctor-dashboard",
          label: "Open Dashboard",
          type: "navigate",
          href: "/doctor/dashboard",
        },
      ],
    },
    {
      id: "add-availability",
      label: "Add availability",
      keywords: [
        "add availability",
        "add time slot",
        "new slot",
        "add slot",
        "set availability",
      ],
      response:
        "Add your available consultation times from the availability section.",
      actions: [
        {
          id: "doctor-availability-add",
          label: "Manage Availability",
          type: "navigate",
          href: "/doctor/profile",
        },
      ],
    },
    {
      id: "remove-slot",
      label: "Remove a time slot",
      keywords: [
        "remove slot",
        "remove time slot",
        "delete slot",
        "remove availability",
        "delete availability",
      ],
      response:
        "Open availability management to remove an existing available time slot.",
      actions: [
        {
          id: "doctor-availability-remove",
          label: "Manage Availability",
          type: "navigate",
          href: "/doctor/profile",
        },
      ],
    },
    {
      id: "open-calendar",
      label: "Open calendar",
      keywords: ["calendar", "open calendar", "my calendar", "schedule calendar"],
      response: "View your appointments and availability on the calendar.",
      actions: [
        {
          id: "doctor-calendar",
          label: "Open Calendar",
          type: "navigate",
          href: "/doctor/calendar",
        },
      ],
    },
    {
      id: "manage-appointments",
      label: "Manage appointments",
      keywords: [
        "manage appointments",
        "appointments",
        "patient appointments",
        "view appointments",
      ],
      response: "Review, confirm, and manage your patient appointments.",
      actions: [
        {
          id: "doctor-appointments",
          label: "Manage Appointments",
          type: "navigate",
          href: "/doctor/appointments",
        },
      ],
    },
    {
      id: "manage-prescriptions",
      label: "Manage prescriptions",
      keywords: [
        "manage prescriptions",
        "prescriptions",
        "write prescription",
        "prescription",
      ],
      response: "Create and manage prescriptions for your patients.",
      actions: [
        {
          id: "doctor-prescriptions",
          label: "Manage Prescriptions",
          type: "navigate",
          href: "/doctor/prescriptions",
        },
      ],
    },
    {
      id: "my-profile",
      label: "My profile",
      keywords: ["my profile", "profile", "doctor profile", "account"],
      response: "Update your professional profile and availability settings.",
      actions: [
        {
          id: "doctor-profile",
          label: "My Profile",
          type: "navigate",
          href: "/doctor/profile",
        },
      ],
    },
    {
      id: "help",
      label: "Help",
      keywords: ["help", "support", "how to", "guide"],
      response:
        "The doctor portal lets you:\n\n• View today's appointments on your dashboard\n• Manage your availability and time slots\n• Use the calendar to see your schedule\n• Manage patient appointments\n• Create and manage prescriptions\n• Update your professional profile\n\nSelect an option below to navigate to the right page.",
    },
  ],
};
