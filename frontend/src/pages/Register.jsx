import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: params.get("role") === "vendor" ? "vendor" : "traveler",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      console.log("Sending registration:", form);

      const result = await register(form);

      console.log("Registration successful:", result);

      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm"
      >
        <h1 className="text-xl font-bold text-gray-800 mb-1">
          Create your account
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Join TravelBoost in seconds
        </p>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <label className="text-xs font-medium text-gray-600">
          Full name
        </label>

        <input
          type="text"
          required
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          className="w-full mt-1 mb-4 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
        />

        <label className="text-xs font-medium text-gray-600">
          Email
        </label>

        <input
          type="email"
          required
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
          className="w-full mt-1 mb-4 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
        />

        <label className="text-xs font-medium text-gray-600">
          Password
        </label>

        <input
          type="password"
          required
          minLength={6}
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
          className="w-full mt-1 mb-4 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
        />

        <label className="text-xs font-medium text-gray-600">
          I am a
        </label>

        <select
          value={form.role}
          onChange={(e) =>
            setForm({
              ...form,
              role: e.target.value,
            })
          }
          className="w-full mt-1 mb-6 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
        >
          <option value="traveler">Traveler</option>
          <option value="vendor">Hotel / Experience Vendor</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white py-2.5 rounded-lg font-semibold text-sm"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-brand-600 font-medium"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}