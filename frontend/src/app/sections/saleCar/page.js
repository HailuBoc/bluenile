// products/page.js (server component)
import { Suspense } from "react";
//import ProductsList from "./ProductsList"; // Client component
import SaleCard from "./SaleCar";
export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SaleCard />
    </Suspense>
  );
}
