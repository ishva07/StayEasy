import env from "../config/env";

const MODEL = "gemini-3.5-flash-lite";
const GEMINI_TIMEOUT_MS = 8000;

const responseSchema = {
  type: "object",
  properties: {
    intent: { type: "string", enum: ["search", "unclear"] },
    cityId: { type: "string", nullable: true },
    propertyTypeId: { type: "string", nullable: true },
    amenityIds: { type: "array", items: { type: "string" } },
    guests: { type: "integer", nullable: true },
    checkIn: { type: "string", nullable: true },
    checkOut: { type: "string", nullable: true },
    minRating: { type: "number", nullable: true },
    minPrice: { type: "number", nullable: true },
    maxPrice: { type: "number", nullable: true },
    keywordFallback: { type: "string", nullable: true },
  },
  required: ["intent"],
};


export async function callGemini(prompt: string): Promise<unknown> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-goog-api-key": env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema,
      },
    }),
    signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Gemini API returned ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini response missing expected text content");
  }

  return JSON.parse(text);
}