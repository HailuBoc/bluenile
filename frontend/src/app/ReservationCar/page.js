// products/page.js (server component)
"use client";
import { Suspense } from "react";
import Reservation from "./Reservation";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Reservation />
    </Suspense>
  );
}
