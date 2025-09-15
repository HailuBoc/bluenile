"use client";

import { Suspense } from "react";
import ReserveHouse from "./ReserveHouse";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading reservation...</div>}>
      <ReserveHouse />
    </Suspense>
  );
}
