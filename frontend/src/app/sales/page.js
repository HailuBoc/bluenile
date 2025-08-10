import { Home, Building, Map, Car } from "lucide-react";

export default function Sales() {
  const listings = [
    {
      title: "Modern 3-Bedroom Apartment",
      category: "Apartment",
      price: "$150,000",
      location: "Downtown, New York",
      icon: <Building className="w-10 h-10 text-blue-600" />,
    },
    {
      title: "Luxury Beachfront Villa",
      category: "House",
      price: "$1,200,000",
      location: "Malibu, California",
      icon: <Home className="w-10 h-10 text-green-600" />,
    },
    {
      title: "5 Acres of Prime Land",
      category: "Land",
      price: "$300,000",
      location: "Nairobi, Kenya",
      icon: <Map className="w-10 h-10 text-yellow-600" />,
    },
    {
      title: "2023 Luxury SUV",
      category: "Vehicle",
      price: "$80,000",
      location: "Dubai, UAE",
      icon: <Car className="w-10 h-10 text-red-600" />,
    },
  ];

  const highlights = [
    "Verified listings from trusted owners and companies",
    "Fair and transparent pricing",
    "Direct communication with sellers",
    "Regularly updated offers",
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <header className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Sales Listings</h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
          Verified listings of apartments, houses, lands, and vehicles for sale
          — direct from trusted owners or companies.
        </p>
      </header>

      {/* Listings */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold mb-8 text-gray-800 text-center">
          Featured Listings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {listings.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <div className="mb-4 flex justify-center">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-1 text-center">
                {item.title}
              </h3>
              <p className="text-gray-500 text-center">{item.category}</p>
              <p className="text-gray-500 text-sm text-center">
                {item.location}
              </p>
              <p className="text-yellow-600 font-semibold text-center mt-3">
                {item.price}
              </p>
              <button className="mt-4 w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition">
                Contact Seller
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Why Buy With Us?
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {highlights.map((item, idx) => (
              <li
                key={idx}
                className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition text-gray-700"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-4">
            Find Your Perfect Property or Vehicle Today
          </h2>
          <p className="mb-6 text-lg">
            Explore our verified listings and deal directly with trusted
            sellers.
          </p>
          <button className="bg-white text-blue-700 font-bold py-3 px-8 rounded-lg shadow hover:bg-gray-100 transition">
            Browse All Listings
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8 text-center mt-10">
        <p>
          &copy; {new Date().getFullYear()} Sales Listings. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
