import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/auth.service";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => authService.meApi(),
    retry: false,
    staleTime: 0,
    refetchOnMount: "always",
  });
}