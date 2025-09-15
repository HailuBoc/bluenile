// products/page.js (server component)
import { Suspense } from "react";
//import ProductsList from "./ProductsList"; // Client component
import TourismList from "./TourismList";
export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TourismList />
    </Suspense>
  );
}
