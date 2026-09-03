import { useState } from "react";

const categories = [
  {
    title: "Nearby Hotels",
    icon: "🏨",
    query: "hotels",
  },
  {
    title: "Food & Restaurants",
    icon: "🍴",
    query: "restaurants",
  },
  {
    title: "Tourist Attractions",
    icon: "🎯",
    query: "tourist attractions",
  },
  {
    title: "Transport",
    icon: "🚕",
    query: "taxi transport car rental",
  },
  {
    title: "Local Guides",
    icon: "🧑‍💼",
    query: "local tour guides",
  },
  {
    title: "Safety & Help",
    icon: "🛡️",
    query: "police hospital emergency services",
  },
];

export default function LocationTracker() {
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState(
    "Share your location to discover nearby tourism services."
  );
  const [loading, setLoading] = useState(false);

  function track() {
    if (!navigator.geolocation) {
      setMessage("Location tracking is not supported by this browser.");
      return;
    }

    setLoading(true);
    setMessage("Finding your current location…");

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
        });

        setLoading(false);
        setMessage(
          "Location found! Choose a category below to explore nearby places."
        );
      },
      (error) => {
        setLoading(false);

        if (error.code === 1) {
          setMessage(
            "Location permission was denied. Allow location access in your browser and try again."
          );
        } else if (error.code === 2) {
          setMessage(
            "Your location could not be detected. Please check GPS/location services."
          );
        } else if (error.code === 3) {
          setMessage(
            "Location request timed out. Please try again."
          );
        } else {
          setMessage("Unable to get your location. Please try again.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000,
      }
    );
  }

  function mapsSearch(query = "") {
    if (!location) return "#";

    const searchQuery = query
      ? `${query} near ${location.latitude},${location.longitude}`
      : `${location.latitude},${location.longitude}`;

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      searchQuery
    )}`;
  }

  const googleMapsUrl = mapsSearch();

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">
          📍 Near Me
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Discover hotels, food, transport, attractions and safety
          services around your current location.
        </p>
      </div>

      {/* Location Card */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex h-52 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-brand-300">
          <div className="text-center">
            <div className="text-6xl">📍</div>

            <p className="mt-3 text-sm font-medium text-gray-700">
              {location
                ? "Your current location"
                : "Location not detected"}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-600">
          {message}
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={track}
            disabled={loading}
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Finding location…"
              : location
              ? "🔄 Refresh Location"
              : "📍 Use My Current Location"}
          </button>

          {location && (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"
            >
              🗺️ Open Google Maps
            </a>
          )}
        </div>

        {location && (
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-400">
                Latitude
              </p>
              <p className="mt-1 font-semibold text-gray-800">
                {location.latitude.toFixed(5)}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-400">
                Longitude
              </p>
              <p className="mt-1 font-semibold text-gray-800">
                {location.longitude.toFixed(5)}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-400">
                Accuracy
              </p>
              <p className="mt-1 font-semibold text-gray-800">
                ±{Math.round(location.accuracy)} m
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Nearby Categories */}
      {location ? (
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              Explore Nearby
            </h2>

            <p className="text-sm text-gray-500">
              Search Google Maps around your current location.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <a
                key={category.title}
                href={mapsSearch(category.query)}
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-2xl">
                    {category.icon}
                  </div>

                  <span className="text-gray-300 transition group-hover:text-brand-600">
                    ↗
                  </span>
                </div>

                <h3 className="mt-4 font-semibold text-gray-800">
                  {category.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Find verified and nearby {category.title.toLowerCase()}.
                </p>

                <p className="mt-4 text-xs font-semibold text-brand-600">
                  Explore nearby →
                </p>
              </a>
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
          <div className="text-4xl">🗺️</div>

          <h2 className="mt-3 font-semibold text-gray-800">
            Find places around you
          </h2>

          <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
            Allow location access to discover nearby hotels,
            restaurants, attractions, transport and emergency services.
          </p>
        </section>
      )}

      {/* Safety */}
      <section className="rounded-2xl border border-green-100 bg-green-50 p-5">
        <div className="flex gap-3">
          <div className="text-2xl">🛡️</div>

          <div>
            <h2 className="font-semibold text-green-800">
              Travel Safety
            </h2>

            <p className="mt-1 text-sm leading-6 text-green-700">
              For important decisions, verify prices, business identity,
              reviews and official information before paying or sharing
              personal details. Emergency services should always be
              contacted through official channels.
            </p>

            {location && (
              <a
                href={mapsSearch(
                  "police station hospital emergency services"
                )}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm font-semibold text-green-800 underline"
              >
                Find nearby help →
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <p className="text-center text-xs text-gray-400">
        🔒 Your location is used by this page to create nearby Google Maps
        searches and is not saved to TravelBoost.
      </p>
    </div>
  );
}