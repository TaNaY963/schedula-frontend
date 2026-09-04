export type SpecialtyMeta = {
  label: string;
  accentClass: string;
  iconBgClass: string;
  iconColorClass: string;
};

const specialtyCatalog: Record<string, SpecialtyMeta> = {
  "General Medicine": {
    label: "General Medicine",
    accentClass: "border-sky-200 bg-sky-50/70",
    iconBgClass: "bg-sky-100",
    iconColorClass: "text-sky-700",
  },
  Dermatology: {
    label: "Dermatology",
    accentClass: "border-violet-200 bg-violet-50/70",
    iconBgClass: "bg-violet-100",
    iconColorClass: "text-violet-700",
  },
  Cardiology: {
    label: "Cardiology",
    accentClass: "border-rose-200 bg-rose-50/70",
    iconBgClass: "bg-rose-100",
    iconColorClass: "text-rose-700",
  },
  Pediatrics: {
    label: "Pediatrics",
    accentClass: "border-amber-200 bg-amber-50/70",
    iconBgClass: "bg-amber-100",
    iconColorClass: "text-amber-700",
  },
  Orthopedics: {
    label: "Orthopedics",
    accentClass: "border-orange-200 bg-orange-50/70",
    iconBgClass: "bg-orange-100",
    iconColorClass: "text-orange-700",
  },
  Neurology: {
    label: "Neurology",
    accentClass: "border-indigo-200 bg-indigo-50/70",
    iconBgClass: "bg-indigo-100",
    iconColorClass: "text-indigo-700",
  },
  Ophthalmology: {
    label: "Ophthalmology",
    accentClass: "border-cyan-200 bg-cyan-50/70",
    iconBgClass: "bg-cyan-100",
    iconColorClass: "text-cyan-700",
  },
};

const defaultSpecialtyMeta: SpecialtyMeta = {
  label: "Specialist",
  accentClass: "border-emerald-200 bg-emerald-50/70",
  iconBgClass: "bg-emerald-100",
  iconColorClass: "text-emerald-700",
};

export function getSpecialtyMeta(specialty: string): SpecialtyMeta {
  return (
    specialtyCatalog[specialty] ?? {
      ...defaultSpecialtyMeta,
      label: specialty,
    }
  );
}

export function buildSpecialtyHref(specialty: string) {
  return `/doctors?specialty=${encodeURIComponent(specialty)}`;
}
