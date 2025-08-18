// products/page.js (server component)
import { Suspense } from "react";
import HousesList from "./houses/HousesList"; // Client component

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HousesList />
    </Suspense>
  );
}
