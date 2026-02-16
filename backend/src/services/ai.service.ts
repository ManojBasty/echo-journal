import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export interface AIAnalysisResult {
  summary: string;
  mood: string;
  emotionalScore: number; // 1–10
  reflectionPrompt: string;
  detectedPatterns: string[];
}

export const analyzeJournalContent = async (
  content: string
): Promise<AIAnalysisResult> => {
  try {
    const prompt = `
You are an advanced journaling analysis AI.

Analyze the following journal entry and return ONLY valid JSON with this structure:

{
  "summary": "Short summary of the journal",
  "mood": "One word mood",
  "emotionalScore": number (1-10 where 1 = very negative, 10 = very positive),
  "reflectionPrompt": "A thoughtful question to help the user reflect deeper",
  "detectedPatterns": ["pattern1", "pattern2"]
}

Journal Entry:
"""
${content}
"""
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You must return ONLY valid JSON. No explanations.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
    });

    const responseText =
      completion.choices[0]?.message?.content?.trim() || "";

    // Remove accidental markdown formatting
    const cleaned = responseText.replace(/```json|```/g, "");

    const parsed: AIAnalysisResult = JSON.parse(cleaned);

    return parsed;
  } catch (error) {
    console.error("Groq AI Error:", error);
    throw new Error("AI analysis failed");
  }
};
