import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2">
        <span className="text-blue-400 text-xl font-bold">📊</span>
        <h1 className="text-lg font-semibold tracking-wide">
          Vigility Dashboard
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-300">
          Hello,{" "}
          <span className="text-white font-medium">{user?.username}</span>
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1.5 rounded-md transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
