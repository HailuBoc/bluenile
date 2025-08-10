"use client";

import { Suspense } from "react";
import ReservationContent from "./ReservationContent";

export default function Page() {
  return (
    <Suspense
      fallback={<div className="p-6 text-center">Loading reservation...</div>}
    >
      <ReservationContent />
    </Suspense>
  );
}
