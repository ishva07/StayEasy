export interface ResolvedFilters {
  city?: string;
  propertyType?: string;
  amenityIds?: string[];
  guests?: number;
  checkIn?: string;
  checkOut?: string;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  keyword?: string;
}

export type AiSearchFailureReason =
  | "user_daily"
  | "global_minute"
  | "global_daily"
  | "ai_error"
  | "schema_invalid"
  | "unclear_intent";
 
export interface AiSearchResponse {
  outcome: "SUCCESS" | "FALLBACK";
  reason?: AiSearchFailureReason;
  filters?: ResolvedFilters;
}