import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  getJournals,
  deleteJournal,
  updateJournal,
} from "../api/journal";

type Journal = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export default function Dashboard() {
  const [journals, setJournals] = useState<Journal[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

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

  const handleDelete = async (id: string) => {
    try {
      await deleteJournal(id);
      setJournals((prev) => prev.filter((j) => j.id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleEdit = (journal: Journal) => {
    setEditingId(journal.id);
    setEditTitle(journal.title);
    setEditContent(journal.content);
  };

  const handleUpdate = async () => {
    try {
      await updateJournal(editingId!, editTitle, editContent);

      setJournals((prev) =>
        prev.map((j) =>
          j.id === editingId
            ? { ...j, title: editTitle, content: editContent }
            : j
        )
      );

      setEditingId(null);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

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
              className="bg-white p-4 rounded shadow space-y-3"
            >

              {/* EDIT MODE */}
              {editingId === journal.id ? (
                <div className="space-y-2">

                  <input
                    className="w-full border p-2 rounded"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />

                  <textarea
                    className="w-full border p-2 rounded"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdate}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>

                </div>
              ) : (
                <>
                  {/* NORMAL VIEW */}
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

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleEdit(journal)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(journal.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}

      </div>
    </MainLayout>
  );
}