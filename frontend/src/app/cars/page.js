// products/page.js (server component)
import { Suspense } from "react";
//import ProductsList from "./ProductsList"; // Client component
import CarsList from "./CarsList";
export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CarsList />
    </Suspense>
  );
}
