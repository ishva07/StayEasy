import prisma from "../../config/db";

export interface GroundingData {
  cities: { id: string; name: string }[];
  propertyTypes: { id: string; name: string }[];
  amenities: { id: string; name: string }[];
}


export async function getGroundingData(): Promise<GroundingData> {
  const [cities, propertyTypes, amenities] = await Promise.all([
    prisma.city.findMany({ select: { id: true, name: true } }),
    prisma.propertyType.findMany({ select: { id: true, name: true } }),
    prisma.amenities.findMany({ select: { id: true, name: true } }),
  ]);
  return { cities, propertyTypes, amenities };
}

export interface MatchedEntities {
  city?: string;
  propertyType?: string;
   amenityIds?: string[];
  minRating?: number;   
  minPrice?: number;   
  maxPrice?: number;    
  guests?: number; 
  leftoverText: string;
}


function extractRating(text: string): { minRating?: number; remaining: string } {
  const pattern = /\b(\d(?:\.\d)?)\s*\+?\s*(?:stars?|ratt?ings?|rated)\b|\b(?:ratt?ings?|rated)\s*(?:of\s*)?(\d(?:\.\d)?)\b/i;
  const match = text.match(pattern);
  if (!match) return { remaining: text };

  const value = Number(match[1] ?? match[2]);
  if (Number.isNaN(value) || value < 0 || value > 5) return { remaining: text };

  return { minRating: value, remaining: text.replace(match[0], " ") };
}

function extractPrice(text: string): { minPrice?: number; maxPrice?: number; remaining: string } {
  const between = text.match(/\bbetween\s*₹?\s*(\d+)\s*(?:and|to|-)\s*₹?\s*(\d+)\b/i);
  if (between) {
    const a = Number(between[1]);
    const b = Number(between[2]);
    return { minPrice: Math.min(a, b), maxPrice: Math.max(a, b), remaining: text.replace(between[0], " ") };
  }

  const under = text.match(/\b(?:under|below|less than|up to)\s*₹?\s*(\d+)\b/i);
  if (under) {
    return { maxPrice: Number(under[1]), remaining: text.replace(under[0], " ") };
  }

  const above = text.match(/\b(?:above|over|more than|starting from)\s*₹?\s*(\d+)\b/i);
  if (above) {
    return { minPrice: Number(above[1]), remaining: text.replace(above[0], " ") };
  }

  return { remaining: text }; 
}

function extractGuests(text: string): { guests?: number; remaining: string } {
  const match = text.match(/\b(\d+)\s*(?:guests?|people|adults?|pax|persons?)\b/i);
  if (!match) return { remaining: text };

  const value = Number(match[1]);
  if (Number.isNaN(value) || value < 1 || value > 20) return { remaining: text };

  return { guests: value, remaining: text.replace(match[0], " ") };
}


const FILLER_WORDS = new Set([
  "a", "an", "the", "in", "with", "for", "of", "and", "to", "near", "at",
  "stay", "stays", "hotel", "hotels", "place", "places", "property",
  "properties", "looking", "need", "want", "i", "im", "have",
]);


export function matchEntities(query: string, grounding: GroundingData): MatchedEntities {
  let remaining = ` ${query.toLowerCase().replace(/[^a-z0-9\s]/g, " ")} `;
  const result: MatchedEntities = { leftoverText: "" };

  const consume = (name: string): boolean => {
    const needle = ` ${name.toLowerCase()} `;
    if (remaining.includes(needle)) {
      remaining = remaining.replace(needle, " ");
      return true;
    }
    return false;
  };

  for (const city of grounding.cities) {
    if (consume(city.name)) {
      result.city = city.id;
      break; // one city per query
    }
  }

  for (const type of grounding.propertyTypes) {
    if (consume(type.name)) {
      result.propertyType = type.id;
      break;
    }
  }

  const matchedAmenityIds: string[] = [];
  for (const amenity of grounding.amenities) {
    if (consume(amenity.name)) {
      matchedAmenityIds.push(amenity.id);
    }
  }
  if (matchedAmenityIds.length) result.amenityIds = matchedAmenityIds;

   const ratingResult = extractRating(remaining);
  if (ratingResult.minRating !== undefined) result.minRating = ratingResult.minRating;
  remaining = ratingResult.remaining;

  const priceResult = extractPrice(remaining);
  if (priceResult.minPrice !== undefined) result.minPrice = priceResult.minPrice;
  if (priceResult.maxPrice !== undefined) result.maxPrice = priceResult.maxPrice;
  remaining = priceResult.remaining;

  const guestsResult = extractGuests(remaining);
  if (guestsResult.guests !== undefined) result.guests = guestsResult.guests;
  remaining = guestsResult.remaining;

  result.leftoverText = remaining
    .trim()
    .split(/\s+/)
    .filter((word) => word && !FILLER_WORDS.has(word))
    .join(" ");

  return result;
}