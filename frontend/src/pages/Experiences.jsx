import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/client";
import ExperienceCard from "../components/ExperienceCard";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const categories = ["Adventure", "Cultural", "Food & Dining", "Nature", "Wellness"];

export default function Experiences() {
  const [params] = useSearchParams();
  const [category, setCategory] = useState(params.get("category") || "");
  const [experiences, setExperiences] = useState([]);
  const [selected, setSelected] = useState(null);
  const [booking, setBooking] = useState({ date: "", guests: 1, couponCode: "" });
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  async function load() {
    const { data } = await api.get("/experiences", { params: { category } });
    setExperiences(data);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  async function bookExperience() {
    if (!user) return navigate("/login");
    try {
      const { data } = await api.post("/bookings", { itemType: "Experience", item: selected._id, checkIn: booking.date, guests: Number(booking.guests), couponCode: booking.couponCode });
      setMessage(`Booked successfully — total ₹${data.totalPrice}`);
    } catch (err) { setMessage(err.response?.data?.message || "Booking failed"); }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-800">Experiences</h1>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategory("")}
          className={`px-4 py-1.5 rounded-full text-sm ${category === "" ? "bg-brand-600 text-white" : "bg-white border border-gray-200 text-gray-600"}`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-1.5 rounded-full text-sm ${category === c ? "bg-brand-600 text-white" : "bg-white border border-gray-200 text-gray-600"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {experiences.map((e) => (
          <ExperienceCard key={e._id} exp={e} onBook={(exp) => { setSelected(exp); setMessage(""); }} />
        ))}
        {experiences.length === 0 && <p className="text-sm text-gray-400 col-span-full">No experiences found.</p>}
      </div>
      {selected && <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 p-4"><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4"><div className="flex justify-between gap-4"><div><h2 className="font-bold">{selected.title}</h2><p className="text-sm text-gray-500">₹{selected.price} per guest</p></div><button onClick={() => setSelected(null)} className="text-gray-400">✕</button></div><input required type="date" className="w-full rounded-lg border p-2 text-sm" value={booking.date} onChange={e=>setBooking({...booking,date:e.target.value})}/><input min="1" type="number" className="w-full rounded-lg border p-2 text-sm" value={booking.guests} onChange={e=>setBooking({...booking,guests:e.target.value})}/><input placeholder="Coupon code (optional)" className="w-full rounded-lg border p-2 text-sm" value={booking.couponCode} onChange={e=>setBooking({...booking,couponCode:e.target.value.toUpperCase()})}/><button disabled={!booking.date} onClick={bookExperience} className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{user ? "Confirm booking" : "Sign in to book"}</button>{message && <p className="text-sm text-brand-700">{message}</p>}</div></div>}
    </div>
  );
}
