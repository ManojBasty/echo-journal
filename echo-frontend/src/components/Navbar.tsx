import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="h-16 bg-white dark:bg-gray-900 border-b dark:border-gray-800 flex items-center justify-between px-6">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <h1 className="text-xl font-semibold">ECHO</h1>
      </div>

      {/* RIGHT SIDE */}
      <button
        onClick={handleLogout}
        className="text-sm bg-black text-white px-4 py-1 rounded"
      >
        Logout
      </button>

    </div>
  );
}