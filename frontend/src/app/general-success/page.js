"use client";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function GeneralSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4">
      <CheckCircle className="w-20 h-20 text-green-600 mb-6" />
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        Payment Successful!
      </h1>
      <p className="text-lg text-green-800 mb-6 text-center">
        Thank you for your booking. Your payment has been received and your
        event is confirmed.
      </p>
      <Link href="/event/generalevents">
        <button className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition">
          Back to Bookings
        </button>
      </Link>
    </div>
  );
}
