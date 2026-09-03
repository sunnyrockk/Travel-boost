import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/client";
import HotelCard from "../components/HotelCard";

export default function Explore() {
  const [params] = useSearchParams();
  const [destination, setDestination] = useState(params.get("destination") || "");
  const [sort, setSort] = useState("rating");
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  async function search() {
    setLoading(true);
    try {
      const { data } = await api.get("/hotels", { params: { destination, sort } });
      setHotels(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-800">Explore Stays</h1>

      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-gray-100">
        <input
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Destination (e.g. Goa, Manali)"
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
        >
          <option value="rating">Top rated</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
        <button onClick={search} className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg text-sm font-semibold">
          Search
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {hotels.map((h) => (
            <HotelCard key={h._id} hotel={h} />
          ))}
          {hotels.length === 0 && <p className="text-sm text-gray-400 col-span-full">No stays found. Try a different destination.</p>}
        </div>
      )}
    </div>
  );
}
