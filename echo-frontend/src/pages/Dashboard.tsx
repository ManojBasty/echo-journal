import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getJournals } from "../api/journal";

type Journal = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export default function Dashboard() {
  const [journals, setJournals] = useState<Journal[]>([]);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const data = await getJournals();
        setJournals(data);
      } catch (error) {
        console.error("Failed to fetch journals", error);
      }
    };

    fetchJournals();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">

        <h2 className="text-3xl font-semibold">
          Your Journals
        </h2>

        {journals.length === 0 ? (
          <p>No journals yet.</p>
        ) : (
          journals.map((journal) => (
            <div
              key={journal.id}
              className="bg-white p-4 rounded shadow space-y-2"
            >
              <h3 className="text-xl font-semibold">
                {journal.title}
              </h3>

              <p className="text-gray-700">
                {journal.content.length > 150
                ? journal.content.slice(0, 150) + "..."
                : journal.content}
              </p>

              <p className="text-sm text-gray-400">
                {new Date(journal.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}

      </div>
    </MainLayout>
  );
}