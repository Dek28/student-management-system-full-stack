import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import client from "../../api/client";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await client.post("/users/register", form); // <-- change if your route differs
      const data = res.data;

      if (data?.token) localStorage.setItem("token", data.token);

      // go to login (recommended) or dashboard
      navigate("/login");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to register user";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-semibold text-center mb-6">Register Admin</h1>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full rounded-lg border p-3 outline-none focus:ring"
              placeholder="e.g. admin"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border p-3 outline-none focus:ring"
              placeholder="********"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 text-white py-3 font-medium disabled:opacity-60"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
