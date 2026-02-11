// pages/bookings/success.js
export default function Success({ searchParams }) {
  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold">🎉 Payment Successful!</h1>
      <p>Booking ID: {searchParams.bookingId}</p>
    </div>
  );
}
