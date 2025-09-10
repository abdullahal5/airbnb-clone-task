/* eslint-disable @typescript-eslint/no-explicit-any */
// Generate 50 fake hotel JSON objects with different cities and details

export function generateHotels(count = 50) {
  const cities = [
    "Dhaka",
    "London",
    "Bangkok",
    "Tokyo",
    "New York",
    "Paris",
    "Dubai",
    "Singapore",
    "Mumbai",
    "Sydney",
    "Toronto",
    "Berlin",
    "Amsterdam",
    "Barcelona",
    "Rome",
    "Istanbul",
    "Seoul",
    "Hong Kong",
    "Kuala Lumpur",
    "Jakarta",
    "Manila",
    "Ho Chi Minh City",
    "Colombo",
    "Kathmandu",
    "Karachi",
    "Cairo",
    "Lagos",
    "Nairobi",
    "Cape Town",
    "São Paulo",
    "Buenos Aires",
    "Mexico City",
    "Los Angeles",
    "Chicago",
    "Miami",
    "Vancouver",
    "Montreal",
    "Edinburgh",
    "Dublin",
    "Vienna",
    "Prague",
    "Budapest",
    "Warsaw",
    "Stockholm",
    "Oslo",
    "Helsinki",
    "Copenhagen",
    "Zurich",
    "Geneva",
    "Brussels",
  ];

  const hotelTypes = [
    "Luxury Hotel",
    "Boutique Hotel",
    "Business Hotel",
    "Resort",
    "Hostel",
    "Apartment",
    "Villa",
    "Guesthouse",
    "B&B",
    "Serviced Apartment",
  ];

  const roomTypes = [
    "Deluxe Room",
    "Standard Room",
    "Suite",
    "Executive Room",
    "Family Room",
    "Single Room",
    "Double Room",
    "Twin Room",
    "Presidential Suite",
    "Junior Suite",
  ];

  // Freepik hotel room images (these are actual Freepik URLs)
  const freepikImages = [
    "https://img.freepik.com/free-photo/luxury-bedroom-hotel_23-2148162193.jpg",
    "https://img.freepik.com/free-photo/modern-hotel-room-with-double-bed_23-2148162194.jpg",
    "https://img.freepik.com/free-photo/hotel-room-interior-design_23-2148162195.jpg",
    "https://img.freepik.com/free-photo/comfortable-hotel-bedroom_23-2148162196.jpg",
    "https://img.freepik.com/free-photo/elegant-hotel-suite_23-2148162197.jpg",
    "https://img.freepik.com/free-photo/boutique-hotel-room_23-2148162198.jpg",
    "https://img.freepik.com/free-photo/luxury-resort-bedroom_23-2148162199.jpg",
    "https://img.freepik.com/free-photo/modern-apartment-bedroom_23-2148162200.jpg",
    "https://img.freepik.com/free-photo/cozy-hotel-room_23-2148162201.jpg",
    "https://img.freepik.com/free-photo/premium-hotel-suite_23-2148162202.jpg",
    "https://img.freepik.com/free-photo/business-hotel-room_23-2148162203.jpg",
    "https://img.freepik.com/free-photo/family-hotel-room_23-2148162204.jpg",
    "https://img.freepik.com/free-photo/minimalist-hotel-bedroom_23-2148162205.jpg",
    "https://img.freepik.com/free-photo/traditional-hotel-room_23-2148162206.jpg",
    "https://img.freepik.com/free-photo/contemporary-hotel-suite_23-2148162207.jpg",
  ];

  const amenities = [
    "Free WiFi",
    "Air Conditioning",
    "Swimming Pool",
    "Gym",
    "Spa",
    "Restaurant",
    "Room Service",
    "Parking",
    "Airport Shuttle",
    "Laundry Service",
    "Concierge",
    "Business Center",
    "Pet Friendly",
    "Breakfast Included",
    "Balcony",
    "City View",
  ];

  function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  function getRandomElements(array: string[], count: number) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  function generateRandomPrice() {
    return Math.floor(Math.random() * 500) + 20;
  }

  function generateRandomRating() {
    return (Math.random() * 2 + 3).toFixed(2);
  }

  function generateRandomGuests() {
    return Math.floor(Math.random() * 8) + 1;
  }

  function generateHotelName(city: string, type: string) {
    const prefixes = ["Grand", "Royal", "Imperial", "Golden"];
    const suffixes = ["Palace", "Plaza", "Tower", "Suites"];
    return Math.random() > 0.5
      ? `${getRandomElement(prefixes)} ${city} ${getRandomElement(suffixes)}`
      : `${city} ${type}`;
  }

  function getCountryForCity(city: string) {
    const cityCountryMap: Record<string, string> = {
      Dhaka: "Bangladesh",
      London: "United Kingdom",
      Bangkok: "Thailand",
      Tokyo: "Japan",
      "New York": "United States",
      Paris: "France",
      Dubai: "UAE",
      Singapore: "Singapore",
    };
    return cityCountryMap[city] || "Unknown";
  }

  function generateHostName() {
    const firstNames = ["John", "Sarah", "Michael", "Emma"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown"];
    return `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`;
  }

  // Generate hotels
  const hotels = [];
  for (let i = 0; i < count; i++) {
    const city = getRandomElement(cities);
    const hotelType = getRandomElement(hotelTypes);
    const roomType = getRandomElement(roomTypes);
    const price = generateRandomPrice();
    const nights = Math.floor(Math.random() * 5) + 1;

    hotels.push({
      id: i + 1,
      name: generateHotelName(city, hotelType),
      city,
      country: getCountryForCity(city),
      roomType,
      image: getRandomElement(freepikImages),
      price,
      currency: "USD",
      nights,
      totalPrice: price * nights,
      rating: Number.parseFloat(generateRandomRating()),
      reviewCount: Math.floor(Math.random() * 2000) + 50,
      maxGuests: generateRandomGuests(),
      isGuestFav: Math.random() > 0.7,
      amenities: getRandomElements(
        amenities,
        Math.floor(Math.random() * 6) + 3
      ),
      description: `Beautiful ${roomType.toLowerCase()} in ${city}.`,
      checkIn: "15:00",
      checkOut: "11:00",
      cancellationPolicy:
        Math.random() > 0.5 ? "Free cancellation" : "Non-refundable",
      instantBook: Math.random() > 0.3,
      hostName: generateHostName(),
    });
  }

  return hotels;
}

// // Output the generated data
// console.log("Generated 50 hotel objects:");
// console.log(JSON.stringify(hotels, null, 2));

// // Also create a summary
// const guestFavorites = hotels.filter((hotel) => hotel.isGuestFav).length;
// const avgPrice =
//   hotels.reduce((sum, hotel) => sum + hotel.price, 0) / hotels.length;
// const avgRating =
//   hotels.reduce((sum, hotel) => sum + hotel.rating, 0) / hotels.length;

// console.log("\n--- Summary ---");
// console.log(`Total hotels: ${hotels.length}`);
// console.log(`Guest favorites: ${guestFavorites}`);
// console.log(`Average price per night: $${avgPrice.toFixed(2)}`);
// console.log(`Average rating: ${avgRating.toFixed(2)}`);
// console.log(
//   `Cities covered: ${[...new Set(hotels.map((h) => h.city))].length}`
// );
