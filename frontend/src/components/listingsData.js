const listings = [
  // 🌟 Popular Stays
  {
    id: 1,
    img: "/p1.png",
    title: "Cozy cabin in the woods",
    location: "📍 Meskel Flower",
    price: "120 birr/night",
    description:
      "A peaceful retreat surrounded by nature, perfect for a weekend getaway.",
    rating: 4.9,
    guestFavorite: true,
  },
  {
    id: 2,
    img: "/p2.png",
    title: "Modern apartment near downtown",
    location: "📍 CMC",
    price: "180 birr/night",
    description:
      "Stylish and comfortable, this apartment is ideal for city explorers.",
    rating: 4.7,
    guestFavorite: true,
  },
  {
    id: 3,
    img: "/p14.jpg",
    title: "Beachside bungalow",
    location: "📍 Kolfe",
    price: "220 birr/night",
    description:
      "Enjoy the sound of waves and stunning sunsets from this beachfront property.",
    rating: 4.8,
    guestFavorite: true,
  },
  {
    id: 4,
    img: "/p13.jpg",
    title: "Mountain view retreat",
    location: "📍 Arada",
    price: "150 birr/night",
    description:
      "A serene escape with breathtaking mountain views, perfect for hiking enthusiasts.",
    rating: 4.6,
    guestFavorite: true,
  },
  {
    id: 5,
    img: "/p10.jpg",
    title: "Rustic country home",
    location: "📍 Semit 72",
    price: "110 birr/night",
    description:
      "Experience the charm of rural living in this cozy country home with modern amenities.",
    rating: 4.5,
    guestFavorite: true,
  },
  {
    id: 6,
    img: "/p11.jpg",
    title: "Tiny house getaway",
    location: "📍 Bole Arabsa",
    price: "90 birr/night",
    description:
      "A minimalist living experience in a beautifully designed tiny house, perfect for solo travelers or couples.",
    rating: 4.7,
    guestFavorite: true,
  },

  // 🚗 Cars for this week
  {
    id: 7,
    img: "/car1.png",
    title: "Desert Cruiser 4x4",
    location: "📍 Fiyel Bet",
    price: "140 birr/day",
    description:
      "A rugged 4x4 built for desert terrain. Perfect for off-road adventures and remote explorations.",
    rating: 4.8,
    guestFavorite: true,
  },
  {
    id: 8,
    img: "/car2.png",
    title: "Skyline Sedan",
    location: "📍 Kaliti",
    price: "175 birr/day",
    description:
      "A sleek and modern sedan, ideal for city driving with great mileage and a smooth ride.",
    rating: 4.9,
    guestFavorite: true,
  },
  {
    id: 9,
    img: "/car3.png",
    title: "Countryside SUV",
    location: "📍 Jemo 1",
    price: "200 birr/day",
    description:
      "Spacious and powerful SUV, excellent for family trips or long countryside drives.",
    rating: 4.6,
    guestFavorite: true,
  },
  {
    id: 10,
    img: "/car4.png",
    title: "Eco Tree Compact",
    location: "📍 Asko Addis-Sefer",
    price: "160 birr/day",
    description:
      "Compact and eco-friendly hatchback, great for navigating city streets with ease and efficiency.",
    rating: 4.7,
    guestFavorite: true,
  },
  {
    id: 11,
    img: "/car5.png",
    title: "Jungle Runner Jeep",
    location: "📍 Betel",
    price: "165 birr/day",
    description:
      "Durable and adventurous Jeep, designed for rough terrain and wild escapes. A thrill-seeker’s favorite.",
    rating: 4.8,
    guestFavorite: true,
  },
  {
    id: 12,
    img: "/car6.jpg",
    title: "Luxury Cruiser X",
    location: "📍 Megenagna",
    price: "170 birr/day",
    description:
      "Premium SUV with luxurious interiors, panoramic sunroof, and top-tier comfort for long drives.",
    rating: 4.9,
    guestFavorite: true,
  },

  // 🏞 Tourism Sites in Ethiopia
  {
    id: 13,
    img: "/lali.jpg",
    title: "Lalibela Rock-Hewn Churches",
    location: "📍 Lalibela, Amhara",
    price: "250 birr/ticket",
    description:
      "Ancient rock-hewn churches carved in the 12th century, a UNESCO World Heritage site and spiritual center of Ethiopia.",
    rating: 5.0,
    guestFavorite: true,
  },
  {
    id: 14,
    img: "/axum.png",
    title: "Axum Obelisks",
    location: "📍 Axum, Tigray",
    price: "200 birr/ticket",
    description:
      "Monolithic obelisks from the ancient Kingdom of Axum, offering a glimpse into Ethiopia’s glorious past.",
    rating: 4.9,
    guestFavorite: true,
  },
  {
    id: 15,
    img: "/semien.png",
    title: "Simien Mountains National Park",
    location: "📍 Gondar, Amhara",
    price: "300 birr/entry",
    description:
      "Breathtaking mountain ranges with rare wildlife like Gelada baboons and Walia ibex.",
    rating: 5.0,
    guestFavorite: true,
  },
  {
    id: 16,
    img: "/danakil.jpg",
    title: "Danakil Depression",
    location: "📍 Afar Region",
    price: "350 birr/tour",
    description:
      "One of the hottest and most unique landscapes on Earth, with colorful salt flats, sulfur springs, and active volcanoes.",
    rating: 4.8,
    guestFavorite: true,
  },
  {
    id: 17,
    img: "/wonchi.jpg",
    title: "Wonchi Crater Lake",
    location: "📍 Near Ambo, Oromia",
    price: "200 birr/entry",
    description:
      "A breathtaking volcanic crater lake surrounded by lush hills, hot springs, and stunning hiking trails.",
    rating: 4.8,
    guestFavorite: true,
  },
  {
    id: 18,
    img: "/jegol.jpg",
    title: "Jegol Wall",
    location: "📍 Harar, Harari Region",
    price: "150 birr/entry",
    description:
      "Ancient city wall encircling Harar Jugol, a UNESCO World Heritage Site rich in history and culture.",
    rating: 4.8,
    guestFavorite: true,
  },

  // 🏠 Properties for Sale
  {
    id: 19,
    img: "/house1.jpg",
    title: "Modern Family Home",
    location: "📍 Ayat",
    price: "5,200,000 birr",
    description:
      "Spacious 4-bedroom home with a large backyard, modern kitchen, and secure parking.",
    rating: 4.9,
    guestFavorite: true,
  },
  {
    id: 20,
    img: "/house7.jpg",
    title: "Luxury Villa with Pool",
    location: "📍 Bole",
    price: "12,500,000 birr",
    description:
      "Elegant villa featuring a private pool, landscaped gardens, and high-end finishes.",
    rating: 5.0,
    guestFavorite: true,
  },
  {
    id: 21,
    img: "/house3.jpg",
    title: "City Center Apartment",
    location: "📍 Piassa",
    price: "3,200,000 birr",
    description:
      "Stylish 2-bedroom apartment in the heart of the city, close to shops and restaurants.",
    rating: 4.7,
    guestFavorite: true,
  },
  {
    id: 22,
    img: "/house4.jpg",
    title: "Riverside Cottage",
    location: "📍 Entoto",
    price: "2,800,000 birr",
    description:
      "Charming cottage with a scenic river view, perfect for a peaceful lifestyle.",
    rating: 4.8,
    guestFavorite: true,
  },
  {
    id: 23,
    img: "/house5.jpg",
    title: "Penthouse Suite",
    location: "📍 Sar Bet",
    price: "8,900,000 birr",
    description:
      "Top-floor penthouse with panoramic city views, premium interiors, and a private terrace.",
    rating: 4.9,
    guestFavorite: true,
  },
  {
    id: 24,
    img: "/house6.jpg",
    title: "Suburban Duplex",
    location: "📍 Summit",
    price: "4,100,000 birr",
    description:
      "Modern duplex home with open-plan living, a garden, and great community amenities.",
    rating: 4.6,
    guestFavorite: true,
  },

  // 🚗 Cars for Sale
  {
    id: 25,
    img: "/casualcar1.jpg",
    title: "Toyota Land Cruiser Prado",
    location: "📍 Bole",
    price: "3,200,000 birr",
    description:
      "A luxury 4x4 SUV known for its reliability, comfort, and off-road capabilities.",
    rating: 4.9,
    guestFavorite: true,
  },
  {
    id: 26,
    img: "/casualcar2.jpg",
    title: "Hyundai Tucson 2022",
    location: "📍 CMC",
    price: "2,100,000 birr",
    description:
      "A modern compact SUV with excellent fuel efficiency and advanced safety features.",
    rating: 4.8,
    guestFavorite: true,
  },
  {
    id: 27,
    img: "/casualcar3.jpg",
    title: "Toyota Corolla 2021",
    location: "📍 Sar Bet",
    price: "1,500,000 birr",
    description:
      "Reliable sedan with great mileage, perfect for both city and highway driving.",
    rating: 4.7,
    guestFavorite: true,
  },
  {
    id: 28,
    img: "/casualcar4.jpg",
    title: "Nissan Patrol V8",
    location: "📍 Megenagna",
    price: "4,500,000 birr",
    description:
      "A high-performance full-size SUV with a powerful V8 engine and premium features.",
    rating: 5.0,
    guestFavorite: true,
  },
  {
    id: 29,
    img: "/casualcar7.jpg",
    title: "Honda CR-V 2020",
    location: "📍 Ayat",
    price: "1,800,000 birr",
    description:
      "Spacious and versatile SUV, perfect for families with great cargo capacity.",
    rating: 4.8,
    guestFavorite: true,
  },
  {
    id: 30,
    img: "/casualcar6.jpg",
    title: "Ford Ranger Wildtrak",
    location: "📍 Gerji",
    price: "3,000,000 birr",
    description:
      "A rugged pickup truck designed for both work and leisure, with advanced tech and safety.",
    rating: 4.9,
    guestFavorite: true,
  },
];

export default listings;
