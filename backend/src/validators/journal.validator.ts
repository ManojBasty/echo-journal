import { z } from "zod";

export const journalSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});
