"use client";

import { Suspense } from "react";
import ReserveCarPage from "./ReserveCarPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading reservation...</div>}>
      <ReserveCarPage />
    </Suspense>
  );
}
