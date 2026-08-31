import { useQuery } from "@tanstack/react-query";
import { aiSearchLogService } from "../service/aiSearchLogAdmin.service";

interface GetAiSearchLogParams {
  page: number;
  limit: number;
  sortBy: string;
  order: string;
}

export function useGetAiSearchLogs(params: GetAiSearchLogParams) {
  return useQuery({
    queryKey: ["ai-search-logs", params],
    queryFn: () => aiSearchLogService.getAiSearchLogsApi(params),
    refetchOnWindowFocus: false,
  });
}

export function useGetAiSearchLogSummary() {
  return useQuery({
    queryKey: ["ai-search-logs-summary"],
    queryFn: () => aiSearchLogService.getAiSearchLogSummaryApi(),
    refetchOnWindowFocus: false,
    refetchInterval: 60_000,
  });
}