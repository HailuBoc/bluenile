"use client";

import { Suspense } from "react";
import ReserveSalePage from "./ReserveSalePage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading reservation...</div>}>
      <ReserveSalePage />
    </Suspense>
  );
}
