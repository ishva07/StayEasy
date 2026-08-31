import api from "@/services/api";

export const aiSearchLogService = {
  getAiSearchLogsApi: async (params: {
    page: number;
    limit: number;
    sortBy: string;
    order: string;
  }) => {
    const res = await api.get("/ai-search-logs", { params });
    return res.data.data;
  },
  getAiSearchLogSummaryApi: async () => {
    const res = await api.get("/ai-search-logs/summary");
    return res.data.data;
  },
};