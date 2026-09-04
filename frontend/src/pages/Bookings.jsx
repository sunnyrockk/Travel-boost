import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const statusColor = {
  confirmed: "bg-green-50 text-green-700",
  pending: "bg-amber-50 text-amber-700",
  cancelled: "bg-red-50 text-red-700",
  completed: "bg-gray-100 text-gray-600",
};

export default function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError("");

    api.get("/bookings/mine")
      .then((res) => {
        setBookings(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Bookings fetch error:", err);
        setError(
          err.response?.data?.message ||
          "Failed to load bookings"
        );
      })
      .finally(() => setLoading(false));
  }, [user]);

  async function cancel(id) {
    try {
      await api.patch(`/bookings/${id}/cancel`);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: "cancelled" } : b
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to cancel booking"
      );
    }
  }

  if (!user) {
    return (
      <p className="text-sm text-gray-500">
        Please{" "}
        <Link to="/login" className="text-brand-600 font-medium">
          sign in
        </Link>{" "}
        to view your bookings.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-800">My Bookings</h1>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-100 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      {loading && (
        <p className="text-sm text-gray-400">Loading bookings...</p>
      )}

      {!loading && !error && bookings.length === 0 && (
        <p className="text-sm text-gray-400">
          You have no bookings yet.
        </p>
      )}

      {bookings.map((b) => (
        <div
          key={b._id}
          className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-lg bg-brand-50 flex items-center justify-center text-2xl">
            {b.itemType === "Hotel" ? "🏨" : "🎈"}
          </div>

          <div className="flex-1">
            <p className="font-semibold text-gray-800">
              {b.item?.name || b.item?.title || "Booked Item"}
            </p>

            <p className="text-xs text-gray-500">
              {new Date(b.checkIn).toLocaleDateString()}
              {b.checkOut &&
                ` - ${new Date(b.checkOut).toLocaleDateString()}`}
            </p>
          </div>

          <span className="font-semibold text-brand-700">
            ₹{b.totalPrice}
          </span>

          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${
              statusColor[b.status] || "bg-gray-100 text-gray-600"
            }`}
          >
            {b.status}
          </span>

          {b.status === "confirmed" && (
            <button
              onClick={() => cancel(b._id)}
              className="text-xs text-red-600 font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
