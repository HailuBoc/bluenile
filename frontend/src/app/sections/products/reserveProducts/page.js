"use client";

import { Suspense } from "react";
import ReserveProductsPage from "./ReserveProductsPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading reservation...</div>}>
      <ReserveProductsPage />
    </Suspense>
  );
}
