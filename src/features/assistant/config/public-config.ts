import { buildAuthHref } from "@/features/auth/redirect";

import type { AssistantConfig } from "../types";

export const publicAssistantConfig: AssistantConfig = {
  initialMessage:
    "Hi! 👋 I'm the Schedula Assistant.\n\nHow can I help you today?",
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
        "discover doctor",
      ],
      response:
        "Sure! I can help you find a doctor. You can search doctors by name, specialty, or other public information available on Schedula.",
      actions: [
        {
          id: "find-doctor-scroll",
          label: "Find a Doctor",
          type: "scroll",
          scrollTarget: "find-doctors",
        },
      ],
    },
    {
      id: "book-appointment",
      label: "How do I book an appointment?",
      keywords: [
        "book appointment",
        "book an appointment",
        "schedule appointment",
        "make appointment",
        "booking",
      ],
      response:
        "You can explore doctors without logging in. To book an appointment, you'll need to log in or create a patient account first.",
      actions: [
        {
          id: "book-login",
          label: "Login",
          type: "navigate",
          href: buildAuthHref("/login", { role: "user" }),
        },
        {
          id: "book-register",
          label: "Create Account",
          type: "navigate",
          href: buildAuthHref("/register", { role: "user" }),
        },
        {
          id: "book-find-doctor",
          label: "Find a Doctor",
          type: "scroll",
          scrollTarget: "find-doctors",
        },
      ],
    },
    {
      id: "login-signup",
      label: "Login / Sign up",
      keywords: ["login", "log in", "sign up", "signup", "register", "account"],
      response:
        "Already have an account? Log in to manage your appointments and book consultations.\n\nNew to Schedula? Create a patient account to get started.",
      actions: [
        {
          id: "auth-login",
          label: "Login",
          type: "navigate",
          href: buildAuthHref("/login", { role: "user" }),
        },
        {
          id: "auth-register",
          label: "Register",
          type: "navigate",
          href: buildAuthHref("/register", { role: "user" }),
        },
      ],
    },
    {
      id: "how-it-works",
      label: "How does Schedula work?",
      keywords: [
        "how does schedula work",
        "how it works",
        "how schedula works",
        "what is schedula",
      ],
      response:
        "Schedula makes healthcare scheduling simple:\n\n1. Find a doctor\n2. View their profile\n3. Log in or create an account\n4. Book an appointment\n5. Manage your appointments from your dashboard",
      actions: [
        {
          id: "how-find-doctor",
          label: "Find a Doctor",
          type: "scroll",
          scrollTarget: "find-doctors",
        },
      ],
    },
    {
      id: "are-you-doctor",
      label: "Are you a doctor?",
      keywords: [
        "are you a doctor",
        "doctor portal",
        "i am a doctor",
        "doctor login",
        "doctor register",
      ],
      response:
        "Schedula also provides a dedicated portal for doctors to manage availability, appointments, calendars and prescriptions.",
      actions: [
        {
          id: "doctor-login",
          label: "Doctor Login",
          type: "navigate",
          href: buildAuthHref("/login", { role: "doctor" }),
        },
        {
          id: "doctor-register",
          label: "Doctor Registration",
          type: "navigate",
          href: buildAuthHref("/register", { role: "doctor" }),
        },
      ],
    },
    {
      id: "what-can-i-do",
      label: "What can I do with Schedula?",
      keywords: [
        "what can i do",
        "features",
        "capabilities",
        "what does schedula do",
      ],
      response:
        "With Schedula you can:\n\n• Discover doctors\n• View doctor profiles\n• Book appointments\n• Manage your appointments\n\nDoctors can manage their schedules and appointments through a dedicated portal.",
    },
    {
      id: "slots-restricted",
      label: "",
      keywords: [
        "available slot",
        "availability",
        "time slot",
        "appointment time",
        "available times",
        "show slots",
        "open slots",
      ],
      response:
        "Available appointment times are shown during the authenticated booking process. Please log in to continue.",
      actions: [
        {
          id: "slots-login",
          label: "Login",
          type: "navigate",
          href: buildAuthHref("/login", { role: "user" }),
        },
      ],
    },
  ],
};
