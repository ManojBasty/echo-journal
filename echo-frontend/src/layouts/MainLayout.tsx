import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">

      <Sidebar />

      <div className="flex flex-col flex-1">
        <Navbar />

        <main className="p-6 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}