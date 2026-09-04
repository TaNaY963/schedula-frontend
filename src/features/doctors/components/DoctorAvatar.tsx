import Image from "next/image";

import { getDoctorImageUrl } from "@/features/doctors/images";
import type { Doctor } from "@/types/doctor";

type DoctorAvatarProps = {
  doctor: Doctor;
  size?: "md" | "lg" | "xl";
  className?: string;
};

const sizeClasses = {
  md: "size-14 text-sm",
  lg: "size-20 text-base",
  xl: "size-full text-2xl",
};

export default function DoctorAvatar({
  doctor,
  size = "md",
  className = "",
}: DoctorAvatarProps) {
  const imageUrl = getDoctorImageUrl(doctor);
  const initials = doctor.name
    .replace("Dr. ", "")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (size === "xl") {
    return (
      <div className={`relative overflow-hidden bg-[var(--canvas)] ${className}`}>
        <Image
          src={imageUrl}
          alt={`Portrait of ${doctor.name}`}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-2xl bg-[var(--canvas)] ring-2 ring-white ${sizeClasses[size]} ${className}`}
    >
      <Image
        src={imageUrl}
        alt={`Portrait of ${doctor.name}`}
        fill
        sizes="80px"
        className="object-cover"
      />

      <span className="sr-only">{initials}</span>
    </div>
  );
}
