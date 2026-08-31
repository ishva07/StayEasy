export interface AiSearchFilters {
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
}

export interface AiSearchResult {
  outcome: "SUCCESS" | "FALLBACK";
  reason?: string;
  filters?: AiSearchFilters;
}