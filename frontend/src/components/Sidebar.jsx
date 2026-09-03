import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/explore", label: "Explore", icon: "🧭" },
  { to: "/bookings", label: "Bookings", icon: "🗂️" },
  { to: "/hotels", label: "Hotels", icon: "🏨" },
  { to: "/experiences", label: "Experiences", icon: "🎈" },
  { to: "/travel-services", label: "Travel Services", icon: "🚕" },
  { to: "/tracker", label: "Near Me", icon: "📍" },
  { to: "/planner", label: "AI Planner", icon: "✨", badge: "New" },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col w-60 shrink-0 border-r border-gray-100 bg-white min-h-screen px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <span className="text-brand-600 text-2xl">✈️</span>
        <div>
          <p className="font-extrabold text-lg leading-none">
            Travel<span className="text-brand-600">Boost</span>
          </p>
          <p className="text-[11px] text-gray-400 tracking-wide">Explore. Experience. Excel.</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <span>{l.icon}</span>
            <span className="flex-1">{l.label}</span>
            {l.badge && (
              <span className="text-[10px] bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded-full font-semibold">
                {l.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white p-5">
        <p className="font-semibold mb-1">List your Hotel / Homestay</p>
        <p className="text-xs text-brand-100 mb-4">Grow your business with us</p>
        <NavLink
          to="/register?role=vendor"
          className="block text-center bg-white text-brand-700 text-sm font-semibold rounded-lg py-2"
        >
          Get Started →
        </NavLink>
      </div>
    </aside>
  );
}
