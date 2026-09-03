import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const serviceTypes = ["", "Taxi", "Airport Transfer", "Local Guide", "Bus", "Car Rental"];

export default function TravelServices() {
  const [services, setServices] = useState([]);
  const [destination, setDestination] = useState("");
  const [type, setType] = useState("");
  const [selected, setSelected] = useState(null);
  const [booking, setBooking] = useState({ date: "", guests: 1, couponCode: "" });
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  async function load() { const { data } = await api.get("/travel-services", { params: { destination, type } }); setServices(data); }
  useEffect(() => { load(); }, []);
  async function book() {
    if (!user) return navigate("/login");
    try {
      const { data } = await api.post("/bookings", { itemType: "TravelService", item: selected._id, checkIn: booking.date, guests: Number(booking.guests), couponCode: booking.couponCode });
      setMessage(`Travel service booked — total ₹${data.totalPrice}`);
    } catch (err) { setMessage(err.response?.data?.message || "Booking failed"); }
  }
  return <div className="space-y-6"><div><h1 className="text-xl font-bold text-gray-800">Local Travel Services</h1><p className="text-sm text-gray-500">Book verified local transport, transfers, rentals, and guides directly from tourism businesses.</p></div>
    <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 sm:flex-row"><input className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="Destination" value={destination} onChange={e => setDestination(e.target.value)} /><select className="rounded-lg border border-gray-200 px-3 py-2 text-sm" value={type} onChange={e => setType(e.target.value)}>{serviceTypes.map(value => <option key={value} value={value}>{value || "All service types"}</option>)}</select><button onClick={load} className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white">Search</button></div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{services.map(s => <article key={s._id} className="rounded-xl border border-gray-100 bg-white p-5"><div className="mb-3 flex items-start justify-between"><span className="rounded-lg bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">{s.type}</span><span className="text-sm text-amber-500">★ {s.rating || "New"}</span></div><h2 className="font-semibold text-gray-800">{s.title}</h2><p className="mt-1 text-sm text-gray-500">{s.destination} · up to {s.capacity} people · {s.durationHours}h</p><p className="mt-3 text-sm text-gray-600">{s.description || "Reliable local travel support from a verified tourism partner."}</p><div className="mt-4 flex items-center justify-between"><span className="font-bold text-brand-700">₹{s.price}<span className="text-xs font-normal text-gray-400"> / guest</span></span><button onClick={() => { setSelected(s); setMessage(""); }} className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white">Book</button></div></article>)}{services.length === 0 && <p className="text-sm text-gray-400">No travel services found. Try another destination.</p>}</div>
    {selected && <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 p-4"><div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl"><div className="flex justify-between"><div><h2 className="font-bold">{selected.title}</h2><p className="text-sm text-gray-500">₹{selected.price} per guest</p></div><button onClick={() => setSelected(null)} className="text-gray-400">✕</button></div><input required type="date" className="w-full rounded-lg border p-2 text-sm" value={booking.date} onChange={e => setBooking({ ...booking, date: e.target.value })}/><input min="1" type="number" className="w-full rounded-lg border p-2 text-sm" value={booking.guests} onChange={e => setBooking({ ...booking, guests: e.target.value })}/><input placeholder="Coupon code (optional)" className="w-full rounded-lg border p-2 text-sm" value={booking.couponCode} onChange={e => setBooking({ ...booking, couponCode: e.target.value.toUpperCase() })}/><button disabled={!booking.date} onClick={book} className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{user ? "Confirm travel booking" : "Sign in to book"}</button>{message && <p className="text-sm text-brand-700">{message}</p>}</div></div>}
  </div>;
}
