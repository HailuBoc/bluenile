import BookingForm from "./BookingForm";

// Sample properties data
const properties = [
  {
    id: 1,
    title: "Luxury Beachfront Villa",
    type: "House",
    location: "Malibu, California",
    price: "450 birr / night",
    img: "/p1.png",
    charge: 450,
  },
  {
    id: 2,
    title: "City Center Apartment",
    type: "Apartment",
    location: "New York City, USA",
    price: "200 birr / night",
    img: "/p2.png",
    charge: 200,
  },
  {
    id: 3,
    title: "Cozy Guesthouse",
    type: "Guesthouse",
    location: "Kyoto, Japan",
    price: "120 birr / night",
    charge: 120,
    img: "/p3.png",
  },
  {
    id: 4,
    title: "Modern Hotel Apartment",
    type: "Hotel Apartment",
    location: "Dubai, UAE",
    price: "300 birr / night",
    charge: 300,
    img: "/p4.png",
  },
];

export default function PropertyBookingPage({ params }) {
  const property =
    properties.find((p) => String(p.id) === String(params.id)) || properties[0];

  return <BookingForm property={property} />;
}
