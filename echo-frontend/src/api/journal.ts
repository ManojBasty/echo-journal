import api from "./axios";

export const createJournal = async (title: string, content: string) => {
  const response = await api.post("/api/journals", {
    title,
    content,
  });

  return response.data;
};

export const getJournals = async () => {
  const response = await api.get("/api/journals");
  return response.data;
};

export const deleteJournal = async (id: string) => {
  return api.delete(`/api/journals/${id}`);
};

export const updateJournal = async (
  id: string,
  title: string,
  content: string
) => {
  return api.put(`/api/journals/${id}`, {
    title,
    content,
  });
};

export const analyzeJournal = async (id: string) => {
  const response = await api.post(`/api/journals/${id}/analyze`, {});
  return response.data;
};