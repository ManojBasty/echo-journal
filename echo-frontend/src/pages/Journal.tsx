import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { createJournal } from "../api/journal";

export default function Journal() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSave = async () => {
    try {
      await createJournal(title, content);

      alert("Journal saved!");

      setTitle("");
      setContent("");
    } catch (error: any) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to save journal");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-4">

        <h2 className="text-3xl font-semibold">
          Write Your Journal
        </h2>

        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Content */}
        <textarea
          className="w-full h-60 border p-3 rounded"
          placeholder="Write your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={handleSave}
          className="bg-black text-white px-6 py-2 rounded"
        >
          Save Journal
        </button>

      </div>
    </MainLayout>
  );
}