import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold">ECHO Journal</h1>

      <button
        onClick={handleLogout}
        className="text-sm bg-black text-white px-4 py-1 rounded"
      >
        Logout
      </button>
    </div>
  );
}