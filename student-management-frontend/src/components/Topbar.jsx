import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-gray-900 text-white flex items-center justify-between px-6 shadow">
      {/* App name */}
      <h1 className="text-lg font-semibold">Student Management System</h1>

      {/* Right section */}
      <div className="flex items-center gap-6">
        {/* Profile link */}
        <Link
          to="/profile"
          className="text-sm font-medium hover:text-blue-400 transition"
        >
          {user?.username || "Profile"}
        </Link>

        {/* Logout button */}
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1.5 rounded-md transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
