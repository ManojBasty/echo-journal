import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-black dark:text-white">

      <Sidebar />

      <div className="flex flex-col flex-1">
        <Navbar /> {/* ONLY HEADER */}

        <main className="p-6 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}