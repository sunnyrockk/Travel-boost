import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function HotelDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [coupon, setCoupon] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get(`/hotels/${id}`).then((res) => setHotel(res.data));
  }, [id]);

  async function handleBook() {
    if (!user) return navigate("/login");
    setMessage("");
    try {
      const { data } = await api.post("/bookings", {
        itemType: "Hotel",
        item: id,
        checkIn,
        checkOut,
        guests,
        couponCode: coupon,
      });
      setMessage(`Booked! Total: ₹${data.totalPrice}`);
    } catch (err) {
      setMessage(err.response?.data?.message || "Booking failed");
    }
  }

  if (!hotel) return <p className="text-sm text-gray-400">Loading...</p>;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="h-64 bg-gradient-to-br from-brand-300 to-brand-600 rounded-2xl flex items-center justify-center text-white text-5xl">
          🏨
        </div>
        <h1 className="text-2xl font-bold text-gray-800">{hotel.name}</h1>
        <p className="text-gray-500">{hotel.destination}, {hotel.state}</p>
        <p className="text-amber-500 text-sm">★ {hotel.rating} ({hotel.reviewCount} reviews)</p>
        <div className="flex flex-wrap gap-2">
          {hotel.amenities?.map((a) => (
            <span key={a} className="text-xs bg-brand-50 text-brand-700 px-3 py-1 rounded-full">{a}</span>
          ))}
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">
          {hotel.description || "A comfortable, well-reviewed stay perfect for exploring the region."}
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-5 h-fit sticky top-6">
        <p className="text-xl font-bold text-brand-700 mb-4">₹{hotel.pricePerNight}<span className="text-sm text-gray-400 font-normal">/night</span></p>

        <label className="text-xs font-medium text-gray-600">Check-in</label>
        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full mt-1 mb-3 px-3 py-2 border border-gray-200 rounded-lg text-sm" />

        <label className="text-xs font-medium text-gray-600">Check-out</label>
        <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full mt-1 mb-3 px-3 py-2 border border-gray-200 rounded-lg text-sm" />

        <label className="text-xs font-medium text-gray-600">Guests</label>
        <input type="number" min={1} value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="w-full mt-1 mb-3 px-3 py-2 border border-gray-200 rounded-lg text-sm" />

        <label className="text-xs font-medium text-gray-600">Coupon code (optional)</label>
        <input value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="TRAVEL20" className="w-full mt-1 mb-4 px-3 py-2 border border-gray-200 rounded-lg text-sm" />

        <button onClick={handleBook} className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-lg font-semibold text-sm">
          {user ? "Confirm Booking" : "Sign in to Book"}
        </button>

        {message && <p className="text-sm text-center mt-3 text-brand-700">{message}</p>}
      </div>
    </div>
  );
}
