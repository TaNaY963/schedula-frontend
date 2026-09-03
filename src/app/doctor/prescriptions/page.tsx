"use client";

import { useEffect, useState } from "react";
import type { Prescription } from "@/types/prescription";

export default function DoctorPrescriptionsPage() {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");
    const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);

    const [formData, setFormData] = useState({
        patientId: "",
        patientName: "",
        appointmentId: "",
        diagnosis: "",
        generalInstructions: "",
    });

    const [medicines, setMedicines] = useState([
        {
            id: `med-${Date.now()}`,
            name: "",
            dosage: "",
            frequency: "",
            duration: "",
            instructions: "",
        },
    ]);

    const addMedicine = () => {
        setMedicines((current) => [
            ...current,
            {
                id: `med-${Date.now()}-${current.length}`,
                name: "",
                dosage: "",
                frequency: "",
                duration: "",
                instructions: "",
            },
        ]);
    };

    const removeMedicine = (id: string) => {
        setMedicines((current) =>
            current.filter((medicine) => medicine.id !== id),
        );
    };

    const updateMedicine = (
        id: string,
        field: string,
        value: string,
    ) => {
        setMedicines((current) =>
            current.map((medicine) =>
                medicine.id === id
                    ? { ...medicine, [field]: value }
                    : medicine,
            ),
        );
    };

    const handleSavePrescription = async () => {
        setFormError("");

        if (
            !formData.patientId ||
            !formData.patientName ||
            !formData.appointmentId ||
            !formData.diagnosis
        ) {
            setFormError(
                "Please fill in all required patient and diagnosis details.",
            );
            return;
        }

        const hasInvalidMedicine = medicines.some(
            (medicine) =>
                !medicine.name ||
                !medicine.dosage ||
                !medicine.frequency ||
                !medicine.duration ||
                !medicine.instructions,
        );

        if (hasInvalidMedicine) {
            setFormError("Please complete all medicine details.");
            return;
        }

        setSaving(true);

        try {
            const response = await fetch("/api/prescriptions", {
                method: editingPrescription ? "PATCH" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    editingPrescription
                        ? {
                            id: editingPrescription.id,
                            diagnosis: formData.diagnosis,
                            medicines,
                            generalInstructions: formData.generalInstructions,
                        }
                        : {
                            appointmentId: formData.appointmentId,
                            doctorId: "doc-001",
                            doctorName: "Dr. Ananya Sharma",
                            patientId: formData.patientId,
                            patientName: formData.patientName,
                            diagnosis: formData.diagnosis,
                            medicines,
                            generalInstructions: formData.generalInstructions,
                        },
                ),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || "Failed to save prescription",
                );
            }

            setPrescriptions((current) =>
                editingPrescription
                    ? current.map((prescription) =>
                        prescription.id === editingPrescription.id
                            ? result.data
                            : prescription,
                    )
                    : [...current, result.data],
            );

            setShowCreateForm(false);
            setEditingPrescription(null);

            setFormData({
                patientId: "",
                patientName: "",
                appointmentId: "",
                diagnosis: "",
                generalInstructions: "",
            });

            setMedicines([
                {
                    id: `med-${Date.now()}`,
                    name: "",
                    dosage: "",
                    frequency: "",
                    duration: "",
                    instructions: "",
                },
            ]);
        } catch (error) {
            setFormError(
                error instanceof Error
                    ? error.message
                    : "Unable to save prescription.",
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEditPrescription = (prescription: Prescription) => {
        setEditingPrescription(prescription);

        setFormData({
            patientId: prescription.patientId,
            patientName: prescription.patientName,
            appointmentId: prescription.appointmentId,
            diagnosis: prescription.diagnosis,
            generalInstructions: prescription.generalInstructions || "",
        });

        setMedicines(prescription.medicines);

        setShowCreateForm(true);
    };
    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const response = await fetch("/api/prescriptions");

                if (!response.ok) {
                    throw new Error("Failed to fetch prescriptions");
                }

                const result = await response.json();
                setPrescriptions(result.data);
            } catch {
                setError("Unable to load prescriptions.");
            } finally {
                setLoading(false);
            }
        };

        fetchPrescriptions();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-sm text-gray-500">Loading prescriptions...</p>
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
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Prescription Management
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Create and manage prescriptions for your patients.
                        </p>
                    </div>

                    {/* Summary */}
                    {showCreateForm && (
                        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {editingPrescription
                                            ? "Update prescription details for your patient."
                                            : "Add prescription details for your patient."}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Add prescription details for your patient.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateForm(false);
                                        setEditingPrescription(null);
                                    }}
                                    className="text-sm font-medium text-gray-500 hover:text-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Patient Name
                                    </label>

                                    <input
                                        type="text"
                                        value={formData.patientName}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                patientName: e.target.value,
                                            })
                                        }
                                        placeholder="Enter patient name"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Patient ID
                                    </label>

                                    <input
                                        type="text"
                                        value={formData.patientId}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                patientId: e.target.value,
                                            })
                                        }
                                        placeholder="e.g. pat-004"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Appointment ID
                                    </label>

                                    <input
                                        type="text"
                                        value={formData.appointmentId}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                appointmentId: e.target.value,
                                            })
                                        }
                                        placeholder="e.g. apt-004"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Diagnosis
                                    </label>

                                    <input
                                        type="text"
                                        value={formData.diagnosis}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                diagnosis: e.target.value,
                                            })
                                        }
                                        placeholder="Enter diagnosis"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    General Instructions
                                </label>

                                <textarea
                                    value={formData.generalInstructions}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            generalInstructions: e.target.value,
                                        })
                                    }
                                    rows={3}
                                    placeholder="Add general instructions..."
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="mt-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-base font-semibold text-gray-900">
                                            Medicines
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Add the medicines prescribed to the patient.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addMedicine}
                                        className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                                    >
                                        + Add Medicine
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {medicines.map((medicine, index) => (
                                        <div
                                            key={medicine.id}
                                            className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                                        >
                                            <div className="mb-4 flex items-center justify-between">
                                                <h4 className="text-sm font-semibold text-gray-800">
                                                    Medicine {index + 1}
                                                </h4>

                                                {medicines.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMedicine(medicine.id)}
                                                        className="text-sm font-medium text-red-500 hover:text-red-600"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                                        Medicine Name
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={medicine.name}
                                                        onChange={(e) =>
                                                            updateMedicine(
                                                                medicine.id,
                                                                "name",
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="e.g. Paracetamol"
                                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                                        Dosage
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={medicine.dosage}
                                                        onChange={(e) =>
                                                            updateMedicine(
                                                                medicine.id,
                                                                "dosage",
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="e.g. 500 mg"
                                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                                        Frequency
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={medicine.frequency}
                                                        onChange={(e) =>
                                                            updateMedicine(
                                                                medicine.id,
                                                                "frequency",
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="e.g. Twice daily"
                                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                                        Duration
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={medicine.duration}
                                                        onChange={(e) =>
                                                            updateMedicine(
                                                                medicine.id,
                                                                "duration",
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="e.g. 5 days"
                                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                                    Medicine Instructions
                                                </label>

                                                <textarea
                                                    value={medicine.instructions}
                                                    onChange={(e) =>
                                                        updateMedicine(
                                                            medicine.id,
                                                            "instructions",
                                                            e.target.value,
                                                        )
                                                    }
                                                    rows={2}
                                                    placeholder="e.g. Take after meals"
                                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {formError && (
                                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                    {formError}
                                </div>
                            )}

                            <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateForm(false)}
                                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSavePrescription}
                                    disabled={saving}
                                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingPrescription
                                            ? "Save Changes"
                                            : "Save Prescription"}
                                </button>
                            </div>

                        </div>
                    )}



                    <button
                        type="button"
                        onClick={() => setShowCreateForm(true)}
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        + Create Prescription
                    </button>
                </div>

                {/* Summary */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">Total Prescriptions</p>
                        <p className="mt-2 text-2xl font-semibold text-gray-900">
                            {prescriptions.length}
                        </p>
                    </div>
                </div>

                {/* Prescription List */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 px-5 py-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Recent Prescriptions
                        </h2>
                    </div>

                    {prescriptions.length === 0 ? (
                        <div className="px-5 py-12 text-center">
                            <p className="text-sm text-gray-500">
                                No prescriptions found.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {prescriptions.map((prescription) => (
                                <div
                                    key={prescription.id}
                                    className="p-5 transition hover:bg-gray-50"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900">
                                                {prescription.patientName}
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-500">
                                                Diagnosis: {prescription.diagnosis}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-400">
                                                {prescription.medicines.length} medicine
                                                {prescription.medicines.length !== 1 ? "s" : ""}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleEditPrescription(prescription)}
                                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                        >
                                            Edit Prescription
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}