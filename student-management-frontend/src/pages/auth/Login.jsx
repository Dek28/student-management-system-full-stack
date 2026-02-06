// src/pages/auth/Login.jsx  (or wherever your Login.jsx is)
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import client from "../../api/client";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await client.post("/users/login", form);

      const token = res.data?.token;
      const userFromApi = res.data?.user;

      if (!token || !userFromApi) {
        throw new Error("Invalid login response: token/user missing");
      }

      // Ensure user has a "name" for Topbar
      const normalizedUser = {
        ...userFromApi,
        name:
          userFromApi.name ||
          userFromApi.username ||
          userFromApi.email ||
          "User",
      };

      // ✅ Persist so refresh doesn't lose auth
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(normalizedUser));

      // ✅ Update app auth state
      login({ token, user: normalizedUser });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);

      // If server sent a message, show it; else fallback
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please check credentials.";

      setError(msg);

      // Optional safety: clear bad tokens
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-xl shadow-md px-6 py-6"
      >
        <h2 className="text-xl font-semibold text-center mb-4">Admin Login</h2>

        {error && (
          <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
