const Hotel = require("../models/Hotel");
const Experience = require("../models/Experience");
const TravelService = require("../models/TravelService");

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const titleCase = (value) =>
  value
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

async function searchGooglePlaces(query) {
  if (!GOOGLE_API_KEY) {
    console.warn("GOOGLE_MAPS_API_KEY is missing");
    return [];
  }

  try {
    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_API_KEY,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.location,places.googleMapsUri,places.types",
        },
        body: JSON.stringify({
          textQuery: query,
          languageCode: "en",
          regionCode: "IN",
          pageSize: 10,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "Google Places API error:",
        response.status,
        errorText
      );

      return [];
    }

    const data = await response.json();

    return data.places || [];
  } catch (error) {
    console.error("Google Places request failed:", error.message);
    return [];
  }
}

function formatPlace(place) {
  return {
    id: place.id,
    name: place.displayName?.text || "Unknown place",
    address: place.formattedAddress || "",
    rating: place.rating || null,
    ratingCount: place.userRatingCount || 0,
    mapsUrl:
      place.googleMapsUri ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        place.displayName?.text || ""
      )}`,
    types: place.types || [],
    location: place.location || null,
  };
}

function uniquePlaces(places) {
  const seen = new Set();

  return places.filter((place) => {
    const key = place.id || place.name?.toLowerCase();

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

exports.generateItinerary = async (req, res) => {
  try {
    const destination = titleCase(req.body.destination || "");

    const days = Math.max(
      1,
      Math.min(10, Number(req.body.days) || 3)
    );

    const budget = Math.max(
      1000,
      Number(req.body.budget) || 15000
    );

    const interests = Array.isArray(req.body.interests)
      ? req.body.interests
      : [];

    if (!destination) {
      return res.status(400).json({
        message: "destination is required",
      });
    }

    console.log(
      `\n🌍 Generating real travel plan for: ${destination}`
    );

    /*
     * =====================================================
     * GOOGLE PLACES SEARCH
     * =====================================================
     */

    const [
      attractionsResult,
      landmarksResult,
      marketsResult,
      foodResult,
    ] = await Promise.all([
      searchGooglePlaces(
        `best tourist attractions and famous places in ${destination}, India`
      ),

      searchGooglePlaces(
        `famous landmarks sightseeing places in ${destination}, India`
      ),

      searchGooglePlaces(
        `famous markets shopping places bazaars in ${destination}, India`
      ),

      searchGooglePlaces(
        `famous local food restaurants street food in ${destination}, India`
      ),
    ]);

    /*
     * =====================================================
     * COMBINE + REMOVE DUPLICATES
     * =====================================================
     */

    const attractions = uniquePlaces([
      ...attractionsResult,
      ...landmarksResult,
      ...marketsResult,
    ])
      .map(formatPlace)
      .slice(0, 12);

    const foodPlaces = uniquePlaces(foodResult)
      .map(formatPlace)
      .slice(0, 10);

    console.log(
      `📍 Found ${attractions.length} real places`
    );

    console.log(
      `🍽️ Found ${foodPlaces.length} food places`
    );

    /*
     * =====================================================
     * DATABASE LISTINGS
     * =====================================================
     */

    const placeFilter = {
      destination: new RegExp(destination, "i"),
    };

    const experienceFilter = {
      ...placeFilter,
    };

    if (interests.length) {
      experienceFilter.category = {
        $in: interests,
      };
    }

    const [
      hotels,
      experiences,
      travelServices,
    ] = await Promise.all([
      Hotel.find(placeFilter)
        .sort({
          rating: -1,
          pricePerNight: 1,
        })
        .limit(5),

      Experience.find(experienceFilter)
        .sort({
          rating: -1,
        })
        .limit(20),

      TravelService.find(placeFilter)
        .sort({
          rating: -1,
          price: 1,
        })
        .limit(10),
    ]);

    const stay = hotels[0] || null;
    const transport = travelServices[0] || null;

    /*
     * =====================================================
     * FALLBACK ONLY IF GOOGLE RETURNS NOTHING
     * =====================================================
     */

    const finalAttractions =
      attractions.length > 0
        ? attractions
        : [
            {
              id: "fallback-1",
              name: `${destination} tourist attractions`,
              address: `${destination}, India`,
              rating: null,
              ratingCount: 0,
              mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${destination} tourist attractions`
              )}`,
            },
          ];

    const finalFoodPlaces =
      foodPlaces.length > 0
        ? foodPlaces
        : [
            {
              id: "fallback-food-1",
              name: `Popular local food in ${destination}`,
              address: `${destination}, India`,
              rating: null,
              ratingCount: 0,
              mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `popular local food ${destination}`
              )}`,
            },
          ];

    /*
     * =====================================================
     * DAILY COST
     * =====================================================
     */

    const perDay = {
      stay:
        stay?.pricePerNight ||
        Math.round((budget * 0.35) / days),

      food: Math.round((budget * 0.18) / days),

      transport:
        transport?.price ||
        Math.round((budget * 0.15) / days),

      activity:
        Math.round((budget * 0.25) / days),
    };

    /*
     * =====================================================
     * ITINERARY
     * =====================================================
     */

    const itinerary = Array.from(
      { length: days },
      (_, index) => {
        const place =
          finalAttractions[
            index % finalAttractions.length
          ];

        const food =
          finalFoodPlaces[
            index % finalFoodPlaces.length
          ];

        const experience =
          experiences.length > 0
            ? experiences[
                index % experiences.length
              ]
            : null;

        const activityCost =
          experience?.price ||
          perDay.activity;

        return {
          day: index + 1,

          route:
            index === 0
              ? `${
                  stay?.name || "Your stay"
                } → ${place.name} → ${food.name}`
              : `${place.name} → ${
                  experience?.title ||
                  "Local exploration"
                } → ${food.name}`,

          mapQuery: `${place.name}, ${destination}, India`,

          timings: [
            {
              time: "08:30",
              label: "Breakfast",
              detail:
                `Find a popular breakfast place near ${destination}`,
            },

            {
              time: "10:00",
              label: "Explore",
              detail: place.name,
            },

            {
              time: "13:30",
              label: "Local food",
              detail: food.name,
            },

            {
              time: "16:30",
              label: "Activity",
              detail:
                experience?.title ||
                `Explore ${place.name}`,
            },

            {
              time: "19:00",
              label: "Evening",
              detail:
                `Explore nearby markets, local shopping and dinner`,
            },
          ],

          stay: stay
            ? {
                name: stay.name,
                pricePerNight:
                  stay.pricePerNight,
              }
            : {
                name: "Choose a local stay",
                pricePerNight: perDay.stay,
              },

          transport: transport
            ? {
                title: transport.title,
                type: transport.type,
                price: transport.price,
              }
            : {
                title:
                  "Local taxi / metro / public transport",
                type: "Local Transport",
                price: perDay.transport,
              },

          activity: experience
            ? {
                title: experience.title,
                category: experience.category,
                price: experience.price,
                durationHours:
                  experience.durationHours,
              }
            : {
                title: place.name,
                category: "Sightseeing",
                price: activityCost,
                durationHours: 3,
              },

          alternativePlan:
            "Museum, indoor attraction, café or local cultural experience",

          estimatedCost:
            perDay.stay +
            perDay.food +
            perDay.transport +
            activityCost,
        };
      }
    );

    const totalEstimate =
      itinerary.reduce(
        (total, day) =>
          total + day.estimatedCost,
        0
      );

    /*
     * =====================================================
     * RESPONSE
     * =====================================================
     */

    res.json({
      destination,
      days,
      budget,

      totalEstimate,

      recommendedHotel: stay,

      recommendedTransport: transport,

      budgetBreakdown: {
        stay: perDay.stay * days,

        food: perDay.food * days,

        transport:
          perDay.transport * days,

        activities:
          itinerary.reduce(
            (total, day) =>
              total + day.activity.price,
            0
          ),

        buffer: Math.max(
          0,
          budget - totalEstimate
        ),
      },

      /*
       * REAL GOOGLE PLACES
       */

      attractions: finalAttractions,

      foodPlaces: finalFoodPlaces,

      /*
       * Keep compatibility
       */

      hiddenGems: finalAttractions.slice(4, 8),

      itinerary,

      mapsSearchUrl:
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${destination}, India`
        )}`,

      note:
        attractions.length > 0
          ? "Places and food recommendations are based on Google Places data."
          : "Google Places did not return results. Showing map-based discovery suggestions.",
    });
  } catch (error) {
    console.error(
      "Planner error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to generate itinerary",
      error: error.message,
    });
  }
};