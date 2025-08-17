import { Car, Bus } from "lucide-react";
export const fleet = [
  {
    id: "1",
    title: "Luxury Sedan",
    description:
      "Executive comfort for business or VIP travel with a professional driver.",
    icon: <Car className="w-10 h-10 text-blue-600" />,
    price: "$120 / day",
    image: "/casualcar1.jpg",
  },
  {
    id: "2",
    title: "SUV / 4x4",
    description:
      "Spacious and powerful, perfect for family trips or adventure tours.",
    icon: <Car className="w-10 h-10 text-green-600" />,
    price: "$150 / day",
    image: "/casualcar2.jpg",
  },
  {
    id: "3",
    title: "Executive Van",
    description: "Ideal for group travel, events, and corporate shuttles.",
    icon: <Bus className="w-10 h-10 text-purple-600" />,
    price: "$200 / day",
    image: "/casualcar3.jpg",
  },
  {
    id: "4",
    title: "Tour Bus",
    description:
      "Comfortable large buses for city tours and out-of-town excursions.",
    icon: <Bus className="w-10 h-10 text-pink-600" />,
    price: "Contact for quote",
    image: "/casualcar4.jpg",
  },
];
