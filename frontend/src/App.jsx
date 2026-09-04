import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Explore from "./pages/Explore";
import HotelDetail from "./pages/HotelDetail";
import Experiences from "./pages/Experiences";
import Bookings from "./pages/Bookings";
import Planner from "./pages/Planner";
import VendorDashboard from "./pages/VendorDashboard";
import TravelServices from "./pages/TravelServices";
import Profile from "./pages/Profile";
import LocationTracker from "./pages/LocationTracker";
import Fab from "./components/Fab";

export default function App() {
  return (
    <>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/explore" element={<Layout><Explore /></Layout>} />
      <Route path="/hotels" element={<Layout><Explore /></Layout>} />
      <Route path="/hotels/:id" element={<Layout><HotelDetail /></Layout>} />
      <Route path="/experiences" element={<Layout><Experiences /></Layout>} />
      <Route path="/travel-services" element={<Layout><TravelServices /></Layout>} />
      <Route path="/bookings" element={<Layout><Bookings /></Layout>} />
      <Route path="/planner" element={<Layout><Planner /></Layout>} />
      <Route path="/vendor/onboarding" element={<Layout><VendorDashboard /></Layout>} />
      <Route path="/profile" element={<Layout><Profile /></Layout>} />
      <Route path="/tracker" element={<Layout><LocationTracker /></Layout>} />
    </Routes>
    <Fab  />
    </>
  );
}
