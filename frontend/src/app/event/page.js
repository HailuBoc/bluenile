import { Camera, Utensils, Gift, Users } from "lucide-react";

export default function EventServices() {
  const services = [
    {
      title: "Photography & Videography",
      description:
        "Professional coverage to capture every special moment of your event with stunning clarity.",
      icon: <Camera className="w-10 h-10 text-blue-600" />,
    },
    {
      title: "Catering & Food Service",
      description:
        "Custom menus and world-class catering for weddings, meetings, and private gatherings.",
      icon: <Utensils className="w-10 h-10 text-green-600" />,
    },
    {
      title: "Event Decoration",
      description:
        "Beautiful, personalized decorations to match your theme and style perfectly.",
      icon: <Gift className="w-10 h-10 text-pink-600" />,
    },
    {
      title: "Guest Management",
      description:
        "Seamless coordination, seating, and hospitality services for your attendees.",
      icon: <Users className="w-10 h-10 text-purple-600" />,
    },
  ];

  const highlights = [
    "Experienced event planning professionals",
    "Premium equipment & modern designs",
    "Customizable packages for any budget",
    "Timely delivery & hassle-free setup",
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Event Services</h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
          Full event support including photography, catering, decoration, and
          other professional services for weddings, meetings, and gatherings.
        </p>
      </header>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold mb-8 text-gray-800 text-center">
          Our Professional Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <div className="mb-4 flex justify-center">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                {service.title}
              </h3>
              <p className="text-gray-600 text-center">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Why Choose Us?
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {highlights.map((item, index) => (
              <li
                key={index}
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
            Let’s Make Your Event Unforgettable
          </h2>
          <p className="mb-6 text-lg">
            Contact our team today to start planning your perfect event with
            full professional support.
          </p>
          <button className="bg-white text-blue-700 font-bold py-3 px-8 rounded-lg shadow hover:bg-gray-100 transition">
            Get a Quote
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8 text-center mt-10">
        <p>
          &copy; {new Date().getFullYear()} Event Services. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
