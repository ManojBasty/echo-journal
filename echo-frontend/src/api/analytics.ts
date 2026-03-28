import api from "./axios";

export const getDashboardSummary = async () => {
  const res = await api.get("/api/analytics/dashboard-summary");
  return res.data.data;
};

export const getWeeklyReflection = async () => {
  const res = await api.get("/api/analytics/weekly-reflection");
  return res.data.data;
};