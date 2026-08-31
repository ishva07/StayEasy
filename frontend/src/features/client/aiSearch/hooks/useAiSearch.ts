import { useMutation } from "@tanstack/react-query";
import { aiSearchService } from "../service/aiSearch.service";

export function useAiSearch() {
  return useMutation({
    mutationFn: (query: string) => aiSearchService.parseQuery(query),
  });
}