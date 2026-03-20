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