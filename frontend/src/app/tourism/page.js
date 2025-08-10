import { Map, Mountain, Landmark, Building } from "lucide-react";

export default function TourismEthiopia() {
  const tours = [
    {
      category: "Historic Northern Route",
      icon: <Landmark className="w-8 h-8 text-yellow-600" />,
      destinations: [
        "Lalibela – The world-famous rock-hewn churches",
        "Gondar – Castles of Ethiopian emperors",
        "Axum – Ancient obelisks and religious heritage",
        "Bahir Dar & Lake Tana – Monasteries and the Blue Nile Falls",
      ],
    },
    {
      category: "Natural Wonders & Adventure",
      icon: <Mountain className="w-8 h-8 text-green-600" />,
      destinations: [
        "Simien Mountains – Trekking and wildlife",
        "Bale Mountains – High-altitude nature experiences",
        "Danakil Depression – One of the hottest places on Earth",
        "Sof Omar Caves – One of Africa's largest cave systems",
      ],
    },
    {
      category: "Cultural & Southern Ethiopia",
      icon: <Map className="w-8 h-8 text-pink-600" />,
      destinations: [
        "Omo Valley – Unique ethnic cultures",
        "Hawassa – Lakeside relaxation",
        "Arba Minch – Twin lakes and National Park",
      ],
    },
    {
      category: "City Tours",
      icon: <Building className="w-8 h-8 text-blue-600" />,
      destinations: [
        "Addis Ababa – Museums, Unity Park, Entoto Park, and local cuisine",
      ],
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <header className="bg-gradient-to-r from-red-700 to-yellow-600 text-white py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          Tourism Services – Explore Ethiopia
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
          Tailor-made tours across Ethiopia, from historic routes to cultural
          and natural destinations. Services for local and international
          travelers, with a special focus on the Ethiopian diaspora.
        </p>
      </header>

      {/* Tour Categories */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold mb-8 text-gray-800 text-center">
          Top Ethiopian Tourist Destinations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tours.map((tour, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <div className="flex items-center gap-3 mb-4">
                {tour.icon}
                <h3 className="text-xl font-bold text-gray-800">
                  {tour.category}
                </h3>
              </div>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                {tour.destinations.map((dest, idx) => (
                  <li key={idx}>{dest}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-12">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-4">
            Plan Your Ethiopian Adventure Today
          </h2>
          <p className="mb-6 text-lg">
            Whether you’re a local, an international traveler, or part of the
            Ethiopian diaspora, we’ll help you explore the beauty and heritage
            of Ethiopia.
          </p>
          <button className="bg-white text-green-700 font-bold py-3 px-8 rounded-lg shadow hover:bg-gray-100 transition">
            Book a Tour
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8 text-center mt-10">
        <p>
          &copy; {new Date().getFullYear()} Explore Ethiopia Tours. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
