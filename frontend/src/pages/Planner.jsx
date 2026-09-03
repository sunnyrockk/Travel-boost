import { useState } from "react";
import api from "../api/client";

const interests = [
  "Adventure",
  "Cultural",
  "Food & Dining",
  "Nature",
  "Wellness",
];

const mapsLink = (query) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query
  )}`;

export default function Planner() {
  const [form, setForm] = useState({
    destination: "",
    days: 3,
    budget: 15000,
    interests: [],
  });

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggle = (value) => {
    setForm((current) => ({
      ...current,
      interests: current.interests.includes(value)
        ? current.interests.filter((item) => item !== value)
        : [...current.interests, value],
    }));
  };

  async function generate(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/planner", form);
      setPlan(data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Could not generate itinerary. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* LEFT - FORM */}
      <form
        onSubmit={generate}
        className="h-fit space-y-4 rounded-2xl border border-gray-100 bg-white p-5"
      >
        <div>
          <p className="font-bold text-gray-800">
            ✨ Smart India Trip Planner
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Enter any Indian destination and create a complete trip plan.
          </p>
        </div>

        {/* Destination */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700">
            Destination
          </label>

          <input
            required
            className="w-full rounded-lg border p-2 text-sm outline-none focus:border-brand-500"
            placeholder="Lucknow, Jaipur, Goa, Delhi..."
            value={form.destination}
            onChange={(e) =>
              setForm({
                ...form,
                destination: e.target.value,
              })
            }
          />
        </div>

        {/* Days + Budget */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              Days
            </label>

            <input
              required
              min="1"
              max="10"
              type="number"
              className="w-full rounded-lg border p-2 text-sm"
              value={form.days}
              onChange={(e) =>
                setForm({
                  ...form,
                  days: Number(e.target.value),
                })
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              Budget ₹
            </label>

            <input
              required
              min="1000"
              type="number"
              className="w-full rounded-lg border p-2 text-sm"
              value={form.budget}
              onChange={(e) =>
                setForm({
                  ...form,
                  budget: Number(e.target.value),
                })
              }
            />
          </div>
        </div>

        {/* Interests */}
        <div>
          <p className="mb-2 text-xs font-semibold text-gray-700">
            Your interests
          </p>

          <div className="flex flex-wrap gap-2">
            {interests.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => toggle(item)}
                className={`rounded-full px-3 py-1 text-xs ${
                  form.interests.includes(item)
                    ? "bg-brand-600 text-white"
                    : "border bg-gray-50 text-gray-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Generate */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading
            ? "Building your trip..."
            : "Generate complete itinerary"}
        </button>

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-xs text-red-600">
            {error}
          </p>
        )}
      </form>

      {/* RIGHT - RESULT */}
      <div className="space-y-4 lg:col-span-2">
        {!plan && (
          <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <p className="text-sm text-gray-500">
              🗺️ Enter a destination like{" "}
              <b>Lucknow</b>, <b>Jaipur</b>, <b>Goa</b> or{" "}
              <b>Varanasi</b> to generate your trip.
            </p>

            <p className="mt-2 text-xs text-gray-400">
              TravelBoost will show famous places, local food,
              accommodation, transport and a day-wise itinerary.
            </p>
          </div>
        )}

        {plan && (
          <>
            {/* SUMMARY */}
            <section className="rounded-2xl border border-brand-100 bg-brand-50 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="font-bold text-brand-800">
                    {plan.destination} · {plan.days} days
                  </h1>

                  <p className="text-sm text-brand-700">
                    Estimated ₹{plan.totalEstimate} of ₹{plan.budget} budget
                  </p>
                </div>

                <a
                  target="_blank"
                  rel="noreferrer"
                  href={
                    plan.mapsSearchUrl ||
                    mapsLink(`${plan.destination}, India`)
                  }
                  className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-brand-700"
                >
                  Open in Google Maps ↗
                </a>
              </div>

              {plan.note && (
                <p className="mt-3 text-xs text-brand-700">
                  {plan.note}
                </p>
              )}

              {/* Budget breakdown */}
              {plan.budgetBreakdown && (
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                  {Object.entries(plan.budgetBreakdown).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="rounded-lg bg-white p-2"
                      >
                        <p className="capitalize text-gray-400">
                          {key}
                        </p>

                        <p className="font-semibold text-gray-800">
                          ₹{value}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </section>

            {/* FAMOUS PLACES + FOOD */}
            <section className="grid gap-3 sm:grid-cols-2">
              <Info
                title="📍 Famous places to visit"
                items={plan.attractions || []}
              />

              <Info
                title="🍽️ Famous local food"
                items={plan.foodPlaces || []}
              />
            </section>

            {/* DAY-WISE ITINERARY */}
            <div className="space-y-4">
              {(plan.itinerary || []).map((day) => (
                <article
                  key={day.day}
                  className="rounded-2xl border border-gray-100 bg-white p-5"
                >
                  <div className="flex flex-wrap justify-between gap-2">
                    <div>
                      <h2 className="font-bold text-gray-800">
                        Day {day.day} · route order
                      </h2>

                      <p className="text-sm text-brand-700">
                        🧭 {day.route}
                      </p>
                    </div>

                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={mapsLink(day.mapQuery || plan.destination)}
                      className="text-xs font-semibold text-brand-600"
                    >
                      Map route ↗
                    </a>
                  </div>

                  {/* Timings */}
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      {(day.timings || []).map((slot) => (
                        <div
                          key={`${day.day}-${slot.time}`}
                          className="flex gap-3 rounded-lg bg-gray-50 p-2 text-sm"
                        >
                          <span className="font-semibold text-brand-700">
                            {slot.time}
                          </span>

                          <span>
                            <b>{slot.label}:</b> {slot.detail}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Day details */}
                    <div className="space-y-2 text-sm">
                      {day.stay && (
                        <div className="rounded-lg border p-3">
                          🏨 <b>Stay:</b>{" "}
                          {day.stay.name}
                          {day.stay.pricePerNight
                            ? ` · ₹${day.stay.pricePerNight}/night`
                            : ""}
                        </div>
                      )}

                      {day.transport && (
                        <div className="rounded-lg border p-3">
                          🚗 <b>Transport:</b>{" "}
                          {day.transport.title}
                          {day.transport.price
                            ? ` · ₹${day.transport.price}`
                            : ""}
                        </div>
                      )}

                      {day.activity && (
                        <div className="rounded-lg border p-3">
                          🎟️ <b>Activity:</b>{" "}
                          {day.activity.title}
                          {day.activity.price
                            ? ` · ₹${day.activity.price}`
                            : ""}
                        </div>
                      )}

                      {day.alternativePlan && (
                        <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                          🌧️ <b>Alternative plan:</b>{" "}
                          {day.alternativePlan}
                        </div>
                      )}
                    </div>
                  </div>

                  {day.estimatedCost && (
                    <p className="mt-3 text-right text-sm font-semibold text-gray-700">
                      Day estimate: ₹{day.estimatedCost}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   INFO CARD
========================================================= */

function Info({ title, items = [] }) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white p-4">
      <h2 className="mb-3 font-semibold text-gray-800">
        {title}
      </h2>

      {items.length === 0 ? (
        <p className="text-sm text-gray-400">
          No verified listings available yet.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => {
            const isObject =
              typeof item === "object" && item !== null;

            const name = isObject
              ? item.name
              : item;

            const rating = isObject
              ? item.rating
              : null;

            const address = isObject
              ? item.address
              : "";

            const mapsUrl =
              isObject && item.mapsUrl
                ? item.mapsUrl
                : mapsLink(name);

            return (
              <div
                key={
                  (isObject && item.id) ||
                  `${name}-${index}`
                }
                className="rounded-lg border bg-gray-50 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-800">
                      📍 {name}
                    </p>

                    {address && (
                      <p className="mt-1 text-xs text-gray-500">
                        {address}
                      </p>
                    )}

                    {rating && (
                      <p className="mt-1 text-xs text-yellow-600">
                        ⭐ {rating}

                        {isObject &&
                        item.ratingCount
                          ? ` (${item.ratingCount} reviews)`
                          : ""}
                      </p>
                    )}
                  </div>

                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-xs font-semibold text-brand-600"
                  >
                    Map ↗
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}