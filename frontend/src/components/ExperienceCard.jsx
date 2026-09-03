const iconByCategory = {
  Adventure: "🧗",
  Cultural: "🏛️",
  "Food & Dining": "🍽️",
  Nature: "🌿",
  Wellness: "🧘",
};

export default function ExperienceCard({ exp, onBook }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-lg">
          {iconByCategory[exp.category] || "✨"}
        </span>
        <div>
          <p className="font-semibold text-gray-800">{exp.title}</p>
          <p className="text-xs text-gray-500">{exp.destination} • {exp.category}</p>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-amber-500">★ {exp.rating}</span>
        <span className="font-semibold text-brand-700">₹{exp.price}</span>
      </div>
      <button onClick={() => onBook(exp)} className="mt-3 w-full rounded-lg bg-brand-50 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-100">
        Book experience
      </button>
    </div>
  );
}
