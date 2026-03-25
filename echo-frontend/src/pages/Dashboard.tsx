import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  getJournals,
  deleteJournal,
  updateJournal,
  analyzeJournal,
} from "../api/journal";

type Analysis = {
  mood: string;
  emotionalScore: number;
  summary: string;
  analyzedAt: string;
};

type Journal = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  analyses: Analysis[];
};

export default function Dashboard() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const data = await getJournals();
        setJournals(data);
      } catch (error) {
        console.error("Failed to fetch journals", error);
      } finally {
        setLoading(false);
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

  const handleAnalyze = async (id: string) => {
    try {
      setLoadingId(id);

      const data = await analyzeJournal(id);

      setJournals((prev) =>
        prev.map((j) =>
          j.id === id
            ? {
                ...j,
                analyses: [data.analysis],
              }
            : j
        )
      );
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setLoadingId(null);
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "happy":
        return "bg-green-100 text-green-700";
      case "sad":
        return "bg-blue-100 text-blue-700";
      case "angry":
        return "bg-red-100 text-red-700";
      case "neutral":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-purple-100 text-purple-700";
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="p-10 text-center text-gray-500">
          Loading journals...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">

        <h2 className="text-3xl font-semibold">
          Your Journals
        </h2>

        {journals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
            <h3 className="text-xl font-semibold text-gray-700">
              No journals yet
            </h3>
            <p className="text-gray-500">
              Start writing your thoughts and track your emotions
            </p>
          </div>
        ) : (
          journals.map((journal) => {
            const latestAnalysis =
              journal.analyses && journal.analyses.length > 0
                ? journal.analyses[0]
                : null;

            return (
              <div
                key={journal.id}
                className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition space-y-4 border"
              >

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
                        className="bg-green-500 hover:bg-green-600 transition text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 hover:bg-gray-500 transition text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>

                  </div>
                ) : (
                  <>
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

                    {latestAnalysis && (
                      <div className="bg-gray-50 p-3 rounded space-y-2">

                        <div className="flex justify-between items-center">
                          <span
                            className={`px-3 py-1 text-sm rounded-full font-medium ${getMoodColor(
                              latestAnalysis.mood
                            )}`}
                          >
                            {latestAnalysis.mood}
                          </span>

                          <span className="text-sm text-gray-500">
                            {latestAnalysis.emotionalScore}/10
                          </span>
                        </div>

                        <p className="text-sm text-gray-700">
                          {latestAnalysis.summary}
                        </p>

                      </div>
                    )}

                    <div className="flex gap-3 pt-2 flex-wrap">
                      <button
                        onClick={() => handleEdit(journal)}
                        className="bg-blue-500 hover:bg-blue-600 transition text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(journal.id)}
                        className="bg-red-500 hover:bg-red-600 transition text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>

                      <button
                        onClick={() => handleAnalyze(journal.id)}
                        className="bg-purple-600 hover:bg-purple-700 transition text-white px-3 py-1 rounded"
                      >
                        {loadingId === journal.id
                          ? "Analyzing..."
                          : "Analyze"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}

      </div>
    </MainLayout>
  );
}