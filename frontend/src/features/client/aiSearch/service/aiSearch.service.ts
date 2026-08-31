import api from "@/services/api";
import { AiSearchResult } from "../validation/aiSearch.type";

export const aiSearchService = {
  parseQuery: async (query: string): Promise<AiSearchResult> => {
    const response = await api.post("/search/ai", { query });
    return response.data.data;
  },
};