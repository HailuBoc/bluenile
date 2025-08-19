"use client";

import { Suspense } from "react";
import ReserveHousePage from "./ReserveHousePage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading reservation...</div>}>
      <ReserveHousePage />
    </Suspense>
  );
}
