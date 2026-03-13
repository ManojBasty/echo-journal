import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-black text-white flex flex-col">

      <div className="p-6 text-2xl font-bold">
        ECHO
      </div>

      <nav className="flex flex-col gap-4 px-6">

        <Link to="/dashboard" className="hover:text-gray-300">
          Dashboard
        </Link>

        <Link to="/journal" className="hover:text-gray-300">
          Journal
        </Link>

      </nav>

    </div>
  );
}