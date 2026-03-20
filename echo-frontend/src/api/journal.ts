import api from "./axios";

export const createJournal = async (title: string, content: string) => {
  const token = localStorage.getItem("token");

  const response = await api.post(
    "/api/journals", // ✅ FIXED (plural)
    { title, content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getJournals = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/api/journals", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteJournal = async (id: string) => {
  const token = localStorage.getItem("token");

  return api.delete(`/api/journals/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateJournal = async (
  id: string,
  title: string,
  content: string
) => {
  const token = localStorage.getItem("token");

  return api.put(
    `/api/journals/${id}`,
    { title, content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const analyzeJournal = async (id: string) => {
  const token = localStorage.getItem("token");

  const response = await api.post(
    `/api/journals/${id}/analyze`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};