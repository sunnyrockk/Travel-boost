import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

export default function Profile() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!user) return;
    api.get("/bookings/mine").then(({ data }) => setBookings(data)).catch(() => {}).finally(() => setLoading(false));
  }, [user]);
  if (!user) return <p className="text-sm text-gray-500">Please <Link className="font-medium text-brand-600" to="/login">sign in</Link> to view your profile.</p>;
  return <div className="max-w-2xl space-y-6"><div><h1 className="text-xl font-bold text-gray-800">My profile</h1><p className="text-sm text-gray-500">Your TravelBoost account details and recent bookings.</p></div><section className="rounded-2xl border border-gray-100 bg-white p-6"><div className="flex items-center gap-4"><span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700">{user.name?.[0]?.toUpperCase()}</span><div><p className="font-semibold text-gray-800">{user.name}</p><p className="text-sm text-gray-500">{user.role === "vendor" ? "Tourism business partner" : "Traveler"}</p></div></div><dl className="mt-6 grid gap-4 border-t pt-5 text-sm sm:grid-cols-2"><div><dt className="text-gray-400">Email</dt><dd className="font-medium text-gray-800">{user.email}</dd></div><div><dt className="text-gray-400">Account type</dt><dd className="font-medium capitalize text-gray-800">{user.role}</dd></div></dl></section><section className="rounded-2xl border border-gray-100 bg-white p-6"><div className="mb-4 flex items-center justify-between"><h2 className="font-semibold text-gray-800">Recent bookings</h2><Link to="/bookings" className="text-sm font-medium text-brand-600">View all →</Link></div>{loading ? <p className="text-sm text-gray-400">Loading bookings…</p> : bookings.length ? <div className="space-y-3">{bookings.slice(0, 3).map((booking) => <div key={booking._id} className="flex items-center justify-between rounded-xl bg-gray-50 p-3 text-sm"><div><p className="font-medium text-gray-800">{booking.item?.name || booking.item?.title || "Booking"}</p><p className="text-xs text-gray-500">{booking.itemType} · {new Date(booking.checkIn).toLocaleDateString()}</p></div><div className="text-right"><p className="font-semibold text-brand-700">₹{booking.totalPrice}</p><p className="text-xs capitalize text-gray-500">{booking.status}</p></div></div>)}</div> : <p className="text-sm text-gray-400">No bookings yet. Start planning your trip!</p>}</section><div className="flex flex-wrap gap-3"><Link to="/bookings" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">View my bookings</Link>{["vendor", "admin"].includes(user.role) && <Link to="/vendor/onboarding" className="rounded-lg border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-700">Open vendor dashboard</Link>}</div></div>;
}
