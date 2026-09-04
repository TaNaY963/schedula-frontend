import { Suspense } from "react";

import PortalMain from "@/components/portal/PortalMain";
import DoctorsPageContent from "../DoctorsPageContent";

export default function DoctorsPage() {
  return (
    <Suspense
      fallback={
        <PortalMain maxWidth="6xl">
          <div className="h-8 w-56 animate-pulse rounded bg-stone-100" />
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-xl bg-stone-100"
              />
            ))}
          </div>
        </PortalMain>
      }
    >
      <DoctorsPageContent />
    </Suspense>
  );
}
