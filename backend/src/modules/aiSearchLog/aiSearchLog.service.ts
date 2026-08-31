import { callGemini } from "../../config/gemini";
import { ResolvedFilters } from "./aiSearchLog.type";
import { aiFilterSchema, AiFilterResult } from "./aiSearchLog.validation";
import {
  getGroundingData,
  matchEntities,
  GroundingData,
} from "./entityMatcher";

function buildPrompt(query: string, grounding: GroundingData): string {
  const today = new Date().toISOString().split("T")[0];

  return `You convert a hotel search sentence into structured filters for StayEasy.

Today's date is ${today}. Use it to resolve relative dates like "next weekend" or "tomorrow" into actual ISO dates (YYYY-MM-DD).

Rules:
- Only pick cityId, propertyTypeId, and amenityIds from the lists below, using their exact id values. Never invent an id that isn't listed.
- If you cannot confidently determine a field, return null for it rather than guessing.
- If the input doesn't relate to hotel search at all, or is too vague/gibberish to extract anything meaningful, set intent to "unclear" and leave other fields null.
- Put any descriptive words that don't map to a structured field (e.g. "cozy", "quiet", "honeymoon") into keywordFallback as a short phrase, so they can still be used for a keyword search.
- The word "hotel" used generically (meaning "a place to stay") should NOT be mapped to propertyTypeId. Only set propertyTypeId when the query clearly asks for a SPECIFIC category — e.g. "resort", "villa", "guest house" — as distinct from other types.

Cities: ${JSON.stringify(grounding.cities)}
Property types: ${JSON.stringify(grounding.propertyTypes)}
Amenities: ${JSON.stringify(grounding.amenities)}

User query: "${query}"`;
}

function groundFilters(
  parsed: AiFilterResult,
  grounding: GroundingData,
): ResolvedFilters {
  const validCityIds = new Set(grounding.cities.map((c) => c.id));
  const validPropertyTypeIds = new Set(
    grounding.propertyTypes.map((p) => p.id),
  );
  const validAmenityIds = new Set(grounding.amenities.map((a) => a.id));

  const filters: ResolvedFilters = {};

  if (parsed.cityId && validCityIds.has(parsed.cityId)) {
    filters.city = parsed.cityId;
  }
  if (
    parsed.propertyTypeId &&
    validPropertyTypeIds.has(parsed.propertyTypeId)
  ) {
    filters.propertyType = parsed.propertyTypeId;
  }
  if (parsed.amenityIds?.length) {
    const filtered = parsed.amenityIds.filter((id) => validAmenityIds.has(id));
    if (filtered.length) filters.amenityIds = filtered;
  }
  if (parsed.guests) filters.guests = parsed.guests;
  if (parsed.checkIn) filters.checkIn = parsed.checkIn;
  if (parsed.checkOut) filters.checkOut = parsed.checkOut;
  if (parsed.minRating != null) filters.minRating = parsed.minRating;
  if (parsed.minPrice != null) filters.minPrice = parsed.minPrice;
  if (parsed.maxPrice != null) filters.maxPrice = parsed.maxPrice;
  if (parsed.keywordFallback) filters.keyword = parsed.keywordFallback;

  return filters;
}

function buildDeterministicFilters(
  query: string,
  grounding: GroundingData,
): ResolvedFilters {
  const matched = matchEntities(query, grounding);
  const filters: ResolvedFilters = {};
  if (matched.city) filters.city = matched.city;
  if (matched.propertyType) filters.propertyType = matched.propertyType;
  if (matched.amenityIds?.length) filters.amenityIds = matched.amenityIds;
  if (matched.minRating !== undefined) filters.minRating = matched.minRating;
  if (matched.minPrice !== undefined) filters.minPrice = matched.minPrice;
  if (matched.maxPrice !== undefined) filters.maxPrice = matched.maxPrice;
  if (matched.guests !== undefined) filters.guests = matched.guests;
  if (matched.leftoverText) filters.keyword = matched.leftoverText;
  return filters;
}

export async function getFallbackFilters(
  query: string,
): Promise<ResolvedFilters> {
  const grounding = await getGroundingData();
  return buildDeterministicFilters(query, grounding);
}

export type ParseOutcome =
  | { ok: true; filters: ResolvedFilters }
  | {
      ok: false;
      reason: "ai_error" | "schema_invalid" | "unclear_intent";
      filters: ResolvedFilters;
    };

export async function parseSearchQuery(query: string): Promise<ParseOutcome> {
  const grounding = await getGroundingData();
  const prompt = buildPrompt(query, grounding);

  let rawResult: unknown;
  try {
    rawResult = await callGemini(prompt);
  } catch (err) {
    console.error("AI search parse error:", err);
    return {
      ok: false,
      reason: "ai_error",
      filters: buildDeterministicFilters(query, grounding),
    };
  }

  const parsed = aiFilterSchema.safeParse(rawResult);
  if (!parsed.success) {
    console.error("AI search schema validation failed:", parsed.error);
    return {
      ok: false,
      reason: "schema_invalid",
      filters: buildDeterministicFilters(query, grounding),
    };
  }

  if (parsed.data.intent === "unclear") {
    return {
      ok: false,
      reason: "unclear_intent",
      filters: buildDeterministicFilters(query, grounding),
    };
  }

  const aiFilters = groundFilters(parsed.data, grounding);

  const matched = matchEntities(query, grounding);
  const finalFilters: ResolvedFilters = {
    ...aiFilters,
    city: aiFilters.city ?? matched.city,
    propertyType: aiFilters.propertyType ?? matched.propertyType,
    amenityIds: aiFilters.amenityIds ?? matched.amenityIds,
    minRating: aiFilters.minRating ?? matched.minRating,
    minPrice: aiFilters.minPrice ?? matched.minPrice,
    maxPrice: aiFilters.maxPrice ?? matched.maxPrice,
    guests: aiFilters.guests ?? matched.guests,
  };

  return { ok: true, filters: finalFilters };
}
