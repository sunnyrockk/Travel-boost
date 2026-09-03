import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "traveler@travelboost.com", password: "password123" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold text-gray-800 mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 mb-6">Sign in to continue to TravelBoost</p>

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <label className="text-xs font-medium text-gray-600">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full mt-1 mb-4 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
        />

        <label className="text-xs font-medium text-gray-600">Password</label>
        <input
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full mt-1 mb-6 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
        />

        <button className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-lg font-semibold text-sm">
          Sign In
        </button>

        <p className="text-xs text-gray-500 mt-4 text-center">
          New here? <Link to="/register" className="text-brand-600 font-medium">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
