"use client";

import { Suspense } from "react";
import ReservationPage from "./page";

export default function Reservation() {
  return (
    <Suspense
      fallback={<div className="p-6 text-center">Loading reservation...</div>}
    >
      <ReservationPage />
    </Suspense>
  );
}
