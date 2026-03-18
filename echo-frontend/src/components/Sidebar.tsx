import { Link, NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-black text-white flex flex-col">

      <div className="p-6 text-2xl font-bold">
        ECHO
      </div>

      <nav className="flex flex-col gap-4 px-6">

        <NavLink to="/dashboard" className="hover:text-gray-300">
          Dashboard
        </NavLink>

        <NavLink to="/journal" className="hover:text-gray-300">
          Journal
        </NavLink>

      </nav>

    </div>
  );
}