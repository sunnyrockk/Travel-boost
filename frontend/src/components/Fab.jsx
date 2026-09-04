import { Link } from "react-router-dom";

export default function Fab() {
  return (
    <Link
      to="/planner"
      aria-label="AI Travel Planner"
      title="AI Travel Planner"
      className="
        fixed bottom-6 right-6 z-50
        w-14 h-14
        rounded-full
        bg-brand-600
        hover:bg-brand-700
        text-white
        flex items-center justify-center
        shadow-lg
        hover:shadow-xl
        hover:scale-105
        transition-all duration-200
      "
    >
      <span className="text-2xl">✨</span>
    </Link>
  );
}