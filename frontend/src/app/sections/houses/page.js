// products/page.js (server component)
import { Suspense } from "react";
//import ProductsList from "./ProductsList"; // Client component
import HousesList from "./HousesList";
import HouseSale from "./HouseSale";
export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HousesList />
      <HouseSale />
    </Suspense>
  );
}
