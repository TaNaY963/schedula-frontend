"use client";

import { useEffect, useState } from "react";
import type { Appointment } from "@/types/appointment";

type AppointmentTab = "upcoming" | "completed" | "cancelled";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] =
    useState<AppointmentTab>("upcoming");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("/api/appointments");

        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const result = await response.json();

        setAppointments(result.data);
      } catch {
        setError("Unable to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const upcomingAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "pending" ||
      appointment.status === "confirmed" ||
      appointment.status === "upcoming",
  );

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "completed",
  );

  const cancelledAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "cancelled" ||
      appointment.status === "missed",
  );

  const visibleAppointments =
    activeTab === "upcoming"
      ? upcomingAppointments
      : activeTab === "completed"
        ? completedAppointments
        : cancelledAppointments;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading appointments...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            My Appointments
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View and manage your appointments.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex overflow-x-auto rounded-xl border border-gray-200 bg-white p-1">
          <button
            type="button"
            onClick={() => setActiveTab("upcoming")}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium ${
              activeTab === "upcoming"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Upcoming
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium ${
              activeTab === "completed"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Completed
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cancelled")}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium ${
              activeTab === "cancelled"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Cancelled
          </button>
        </div>

        {/* Appointment List */}
        <div className="space-y-4">
          {visibleAppointments.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white px-5 py-12 text-center">
              <p className="text-sm text-gray-500">
                No {activeTab} appointments found.
              </p>
            </div>
          ) : (
            visibleAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {appointment.doctorName}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {appointment.date} · {appointment.startTime} -{" "}
                      {appointment.endTime}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {appointment.type === "video"
                        ? "Video Consultation"
                        : "In-person Consultation"}
                    </p>

                    {appointment.reason && (
                      <p className="mt-2 text-sm text-gray-600">
                        {appointment.reason}
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700">
                      {appointment.status}
                    </span>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}