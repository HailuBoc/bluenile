import Image from "next/image";

export default function Home() {
  const properties = [
    {
      id: 1,
      title: "Luxury Beachfront Villa",
      type: "House",
      location: "Malibu, California",
      price: "$450 / night",
      img: "/images/villa.jpg",
    },
    {
      id: 2,
      title: "City Center Apartment",
      type: "Apartment",
      location: "New York City, USA",
      price: "$200 / night",
      img: "/images/apartment.jpg",
    },
    {
      id: 3,
      title: "Cozy Guesthouse",
      type: "Guesthouse",
      location: "Kyoto, Japan",
      price: "$120 / night",
      img: "/images/guesthouse.jpg",
    },
    {
      id: 4,
      title: "Modern Hotel Apartment",
      type: "Hotel Apartment",
      location: "Dubai, UAE",
      price: "$300 / night",
      img: "/images/hotel-apartment.jpg",
    },
  ];

  const events = [
    {
      id: 1,
      title: "Grand Wedding Hall",
      location: "Paris, France",
      price: "$2000 / event",
      img: "/images/wedding-hall.jpg",
    },
    {
      id: 2,
      title: "Corporate Meeting Hall",
      location: "London, UK",
      price: "$800 / day",
      img: "/images/meeting-hall.jpg",
    },
  ];

  const services = [
    "Catering & Food Service",
    "Photography & Videography",
    "Event Decoration",
    "Airport Pickup & Drop",
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-16 px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          Property Rentals & Event Bookings
        </h1>
        <p className="mt-4 text-lg md:text-xl">
          Houses, apartments, guesthouses, hotel apartments, wedding & meeting
          halls — all in one place.
        </p>
      </header>

      {/* Properties Section */}
      <div className="bg-slate-400">
        <section className="max-w-7xl  mx-auto px-6 py-12">
          <h2 className="text-3xl font-semibold mb-8 text-gray-800">
            Short & Long-Term Stays
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <Image
                  src={property.img}
                  alt={property.title}
                  width={500}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {property.title}
                  </h3>
                  <p className="text-gray-500">{property.type}</p>
                  <p className="text-gray-500 text-sm">{property.location}</p>
                  <p className="text-blue-600 font-bold mt-2">
                    {property.price}
                  </p>
                  <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      {/* Events Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold mb-8 text-gray-800">
          Event Venues
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              <Image
                src={event.img}
                alt={event.title}
                width={500}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800">
                  {event.title}
                </h3>
                <p className="text-gray-500 text-sm">{event.location}</p>
                <p className="text-blue-600 font-bold mt-2">{event.price}</p>
                <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                  Reserve Venue
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Extra Services
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service, index) => (
              <li
                key={index}
                className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                {service}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8 text-center mt-10">
        <p>
          &copy; {new Date().getFullYear()} Property Rentals & Bookings. All
          rights reserved.
        </p>
      </footer>
    </div>
  );
}
