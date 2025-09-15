"use client";

import { Suspense } from "react";
import ReserveTour from "./ReserveTour";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading reservation...</div>}>
      <ReserveTour />
    </Suspense>
  );
}
