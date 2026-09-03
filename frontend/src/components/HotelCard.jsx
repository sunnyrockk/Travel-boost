import { Link } from "react-router-dom";

export default function HotelCard({ hotel }) {
  return (
    <Link
      to={`/hotels/${hotel._id}`}
      className="group rounded-xl overflow-hidden border border-gray-100 bg-white hover:shadow-lg transition-shadow"
    >
      <div className="h-40 bg-gradient-to-br from-brand-200 to-brand-400 flex items-center justify-center text-white text-3xl">
        🏨
      </div>
      <div className="p-4">
        <p className="font-semibold text-gray-800 group-hover:text-brand-700">{hotel.name}</p>
        <p className="text-sm text-gray-500">{hotel.destination}, {hotel.state}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-sm text-amber-500">★ {hotel.rating} <span className="text-gray-400">({hotel.reviewCount})</span></span>
          <span className="font-semibold text-brand-700">₹{hotel.pricePerNight}<span className="text-xs text-gray-400">/night</span></span>
        </div>
      </div>
    </Link>
  );
}
