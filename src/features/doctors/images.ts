import type { Doctor } from "@/types/doctor";

const doctorPhotoCatalog: Record<string, string> = {
  "doc-001":
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=640&q=80",
  "doc-002":
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=640&q=80",
  "doc-003":
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=640&q=80",
  "doc-004":
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=640&q=80",
  "doc-005":
    "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=640&q=80",
  "doc-006":
    "https://images.unsplash.com/photo-1651008376812-b90baee37c1f?auto=format&fit=crop&w=640&q=80",
  "doc-007":
    "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=640&q=80",
  "doc-008":
    "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=640&q=80",
  "doc-009":
    "https://images.unsplash.com/photo-1527613426441-4da17471b7d5?auto=format&fit=crop&w=640&q=80",
  "doc-010":
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=640&q=80",
  "doc-011":
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=640&q=80",
  "doc-012":
    "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=640&q=80",
  "doc-013":
    "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=640&q=80",
  "doc-014":
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=640&q=80",
  "doc-015":
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=640&q=80",
  "doc-016":
    "https://images.unsplash.com/photo-1651008376812-b90baee37c1f?auto=format&fit=crop&w=640&q=80",
  "doc-017":
    "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=640&q=80",
  "doc-018":
    "https://images.unsplash.com/photo-1527613426441-4da17471b7d5?auto=format&fit=crop&w=640&q=80",
  "doc-019":
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=640&q=80",
  "doc-020":
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=640&q=80",
  "doc-021":
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=640&q=80",
};

export function getDoctorImageUrl(doctor: Pick<Doctor, "id" | "name" | "imageUrl">) {
  if (doctor.imageUrl) {
    return doctor.imageUrl;
  }

  if (doctorPhotoCatalog[doctor.id]) {
    return doctorPhotoCatalog[doctor.id];
  }

  const seed = encodeURIComponent(doctor.name.replace(/\s+/g, "-").toLowerCase());

  return `https://api.dicebear.com/9.x/avataaars/png?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
}
