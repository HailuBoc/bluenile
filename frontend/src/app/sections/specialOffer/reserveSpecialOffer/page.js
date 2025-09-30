// products/page.js (server component)
import { Suspense } from "react";
//import ProductsList from "./ProductsList"; // Client component
import ReserveSpecialOffer from "./ReserveSpecialOffer";
export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReserveSpecialOffer />
    </Suspense>
  );
}
