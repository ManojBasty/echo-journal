import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggle = () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setDark(isDark);
  };

  return (
    <div
      onClick={toggle}
      className="w-12 h-6 flex items-center bg-gray-300 dark:bg-gray-700 rounded-full p-1 cursor-pointer transition"
    >
      <div
        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${
          dark ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </div>
  );
}