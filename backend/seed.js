require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./models/User");
const Hotel = require("./models/Hotel");
const Experience = require("./models/Experience");
const TravelService = require("./models/TravelService");

async function seed() {
  await connectDB();

  await Promise.all([User.deleteMany({}), Hotel.deleteMany({}), Experience.deleteMany({}), TravelService.deleteMany({})]);

  const vendor = await User.create({
    name: "Demo Vendor",
    email: "vendor@travelboost.com",
    password: "password123",
    role: "vendor",
  });

  await User.create({
    name: "Abhay",
    email: "traveler@travelboost.com",
    password: "password123",
    role: "traveler",
  });

  const hotels = await Hotel.insertMany([
    {
      name: "The Himalayan Resort",
      destination: "Manali",
      state: "Himachal Pradesh",
      pricePerNight: 4500,
      rating: 4.8,
      reviewCount: 1200,
      images: [],
      amenities: ["WiFi", "Mountain View", "Breakfast"],
      tags: ["adventure", "nature"],
      vendor: vendor._id,
    },
    {
      name: "Goa Beach Resort",
      destination: "Goa",
      state: "Goa",
      pricePerNight: 3800,
      rating: 4.7,
      reviewCount: 2100,
      images: [],
      amenities: ["Pool", "Beach Access", "Bar"],
      tags: ["beach", "nightlife"],
      vendor: vendor._id,
    },
    {
      name: "Lake Palace View",
      destination: "Udaipur",
      state: "Rajasthan",
      pricePerNight: 5200,
      rating: 4.6,
      reviewCount: 1100,
      images: [],
      amenities: ["Lake View", "Heritage", "Spa"],
      tags: ["cultural", "heritage"],
      vendor: vendor._id,
    },
    {
      name: "Tea Garden Retreat",
      destination: "Darjeeling",
      state: "West Bengal",
      pricePerNight: 3200,
      rating: 4.5,
      reviewCount: 987,
      images: [],
      amenities: ["Tea Estate Tour", "Mountain View"],
      tags: ["nature", "cultural"],
      vendor: vendor._id,
    },
    {
      name: "Coral Bay Villas",
      destination: "Andaman",
      state: "Andaman & Nicobar",
      pricePerNight: 6000,
      rating: 4.9,
      reviewCount: 1300,
      images: [],
      amenities: ["Scuba Diving", "Private Beach"],
      tags: ["beach", "adventure"],
      vendor: vendor._id,
    },
    {
      name: "Nawabi Heritage Stay",
      destination: "Lucknow",
      state: "Uttar Pradesh",
      description: "A comfortable heritage-inspired stay close to Lucknow's food lanes and historic monuments.",
      pricePerNight: 2900,
      rating: 4.7,
      reviewCount: 342,
      images: [],
      amenities: ["WiFi", "Breakfast", "Airport Transfer"],
      tags: ["cultural", "food", "heritage"],
      vendor: vendor._id,
    },
  ]);

  await Experience.insertMany([
    {
      title: "Paragliding in Manali",
      category: "Adventure",
      destination: "Manali",
      price: 2500,
      durationHours: 2,
      rating: 4.7,
      vendor: vendor._id,
    },
    {
      title: "Scuba Diving Andaman",
      category: "Adventure",
      destination: "Andaman",
      price: 3500,
      durationHours: 3,
      rating: 4.9,
      vendor: vendor._id,
    },
    {
      title: "Udaipur Heritage Walk",
      category: "Cultural",
      destination: "Udaipur",
      price: 800,
      durationHours: 2,
      rating: 4.6,
      vendor: vendor._id,
    },
    {
      title: "Goan Seafood Trail",
      category: "Food & Dining",
      destination: "Goa",
      price: 1200,
      durationHours: 3,
      rating: 4.8,
      vendor: vendor._id,
    },
    {
      title: "Darjeeling Tea Tasting",
      category: "Cultural",
      destination: "Darjeeling",
      price: 600,
      durationHours: 1,
      rating: 4.5,
      vendor: vendor._id,
    },
    {
      title: "Himalayan Yoga Retreat",
      category: "Wellness",
      destination: "Manali",
      price: 1500,
      durationHours: 2,
      rating: 4.6,
      vendor: vendor._id,
    },
    {
      title: "Lucknow Old City Food Walk",
      category: "Food & Dining",
      destination: "Lucknow",
      price: 950,
      durationHours: 3,
      rating: 4.8,
      vendor: vendor._id,
    },
  ]);

  await TravelService.insertMany([
    { title: "Manali Mountain Taxi", type: "Taxi", destination: "Manali", price: 1800, capacity: 4, durationHours: 8, rating: 4.7, vendor: vendor._id },
    { title: "Goa Airport Beach Transfer", type: "Airport Transfer", destination: "Goa", price: 1200, capacity: 4, durationHours: 2, rating: 4.8, vendor: vendor._id },
    { title: "Udaipur Heritage Guide", type: "Local Guide", destination: "Udaipur", price: 1500, capacity: 8, durationHours: 4, rating: 4.9, vendor: vendor._id },
    { title: "Darjeeling Hill Car Rental", type: "Car Rental", destination: "Darjeeling", price: 2400, capacity: 4, durationHours: 10, rating: 4.6, vendor: vendor._id },
    { title: "Lucknow Heritage Taxi", type: "Taxi", destination: "Lucknow", price: 1400, capacity: 4, durationHours: 6, rating: 4.7, vendor: vendor._id },
  ]);

  console.log("Seed complete: 2 users, 5 hotels, 6 experiences, 4 travel services created.");
  console.log("Login with traveler@travelboost.com / password123");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
