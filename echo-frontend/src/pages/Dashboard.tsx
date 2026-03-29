import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  getJournals,
  deleteJournal,
  updateJournal,
  analyzeJournal,
} from "../api/journal";
import {
  getDashboardSummary,
  getWeeklyReflection,
} from "../api/analytics";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
  const [summary, setSummary] = useState({
    totalJournals: 0,
    totalAnalyses: 0,
    avgMood: 0,
  });

  const [weekly, setWeekly] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const [chartData, setChartData] = useState<any[]>([]);

  // ✅ CUSTOM TOOLTIP (OUTSIDE JSX)
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0f172a] border border-purple-500/30 px-3 py-2 rounded-lg shadow-lg">
          <p className="text-purple-400 text-sm font-medium">
            Mood: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const journalsData = await getJournals();
        setJournals(journalsData || []);

        const moodData = (journalsData || []).map((j: Journal) => ({
          date: new Date(j.createdAt).toLocaleDateString(),
          mood: j.analyses?.[0]?.emotionalScore || 0,
        }));
        setChartData(moodData);
      } catch (err) {
        console.error("Journal fetch failed", err);
      }

      try {
        const data = await getDashboardSummary();

        setSummary({
          totalJournals: data?.totalJournals || 0,
          totalAnalyses: data?.totalAnalyses || 0,
          avgMood:
            data?.averageEmotionalScoreLast7Days || 0,
        });
      } catch (err) {
        console.error("Summary failed", err);
      }

      try {
        const weeklyData = await getWeeklyReflection();
        setWeekly(weeklyData.weeklyReflection || null);
      } catch (err) {
        console.error("Weekly reflection failed", err);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  // ================= HANDLERS =================
  const handleDelete = async (id: string) => {
    await deleteJournal(id);
    setJournals((prev) => prev.filter((j) => j.id !== id));
  };

  const handleEdit = (journal: Journal) => {
    setEditingId(journal.id);
    setEditTitle(journal.title);
    setEditContent(journal.content);
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    await updateJournal(editingId, editTitle, editContent);

    setJournals((prev) =>
      prev.map((j) =>
        j.id === editingId
          ? { ...j, title: editTitle, content: editContent }
          : j
      )
    );

    setEditingId(null);
  };

  const handleAnalyze = async (id: string) => {
    setLoadingId(id);
    const data = await analyzeJournal(id);

    setJournals((prev) =>
      prev.map((j) =>
        j.id === id ? { ...j, analyses: [data.analysis] } : j
      )
    );

    const summaryData = await getDashboardSummary();

    setSummary({
      totalJournals: summaryData?.totalJournals || 0,
      totalAnalyses: summaryData?.totalAnalyses || 0,
      avgMood:
        summaryData?.averageEmotionalScoreLast7Days || 0,
    });

    setLoadingId(null);
  };

  // ================= UI =================
  if (loading) {
    return (
      <MainLayout>
        <div className="p-10 text-center text-gray-400">
          Loading dashboard...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8 p-4">

        {/* ===== SUMMARY ===== */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { label: "Total Journals", value: summary.totalJournals },
            { label: "Analyses", value: summary.totalAnalyses },
            { label: "Avg Mood", value: `${summary.avgMood}/10` },
          ].map((card, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-white/60 dark:bg-[#1e293b]/80 
              border backdrop-blur transition hover:scale-105 hover:border-purple-500"
            >
              <p className="text-sm text-gray-500">{card.label}</p>
              <h3 className="text-2xl font-bold mt-2">
                {card.value}
              </h3>
            </div>
          ))}
        </div>

        {/* ===== ANALYTICS ===== */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* 📊 MOOD TREND */}
          <div className="p-5 rounded-xl bg-white/60 dark:bg-[#1e293b]/80 border backdrop-blur transition hover:border-purple-500">
            <h3 className="font-semibold mb-4">Mood Trend</h3>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={{ stroke: "#374151" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={{ stroke: "#374151" }}
                  tickLine={false}
                  domain={[0, 10]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 🧠 WEEKLY INSIGHT */}
          <div className="p-5 rounded-xl bg-white/60 dark:bg-[#1e293b]/80 border backdrop-blur space-y-3">
            <h3 className="font-semibold">Weekly Insight</h3>

            {!weekly ? (
              <div className="text-sm text-gray-400 space-y-2">
                <p>No insights generated yet.</p>
                <p className="text-purple-400">
                  💡 Analyze a few journals to unlock AI insights.
                </p>
              </div>
            ) : (
              <>
                <p className="text-gray-300 text-sm">
                  {weekly.overallTrend}
                </p>
                <p className="text-purple-400 text-sm">
                  💡 {weekly.actionStep}
                </p>
              </>
            )}
          </div>
        </div>

        {/* ===== JOURNALS ===== */}
        <div className="space-y-6">
          {journals.length === 0 && (
            <p className="text-center text-gray-400">
              No journals found
            </p>
          )}

          {journals.map((journal) => {
            const latestAnalysis = journal.analyses?.[0];

            return (
              <div
                key={journal.id}
                className="p-5 rounded-2xl bg-white/70 dark:bg-[#0f172a]/80 
                border backdrop-blur space-y-4 transition hover:border-purple-500"
              >
                {editingId === journal.id ? (
                  <>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-2 rounded bg-gray-100 dark:bg-[#1e293b]"
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-2 rounded bg-gray-100 dark:bg-[#1e293b]"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdate}
                        className="px-3 py-1 bg-green-500 text-white rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 bg-gray-500 text-white rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold">
                      {journal.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {journal.content.slice(0, 120)}...
                    </p>
                    {latestAnalysis && (
                      <p className="text-sm text-purple-400">
                        {latestAnalysis.summary}
                      </p>
                    )}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(journal)}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(journal.id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleAnalyze(journal.id)}
                        className="text-purple-500 hover:underline"
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
          })}
        </div>
      </div>
    </MainLayout>
  );
}