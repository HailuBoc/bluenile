// products/page.js (server component)
import { Suspense } from "react";
import ProductsList from "./ProductsList"; // Client component

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsList />
    </Suspense>
  );
}
