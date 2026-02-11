"use client";
export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation";
import SharedDetailPage from "../../../../components/SharedDetailPage";

export default function SaleCarReservationContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <SharedDetailPage
      type="saleCar"
      itemId={id}
      apiEndpoint="/admin/properties/"
      title="Car for Sale"
      breadcrumbs={["Home", "Sales", "Car Details"]}
    />
  );
}
