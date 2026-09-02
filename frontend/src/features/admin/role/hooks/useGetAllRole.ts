import { useQuery } from "@tanstack/react-query";
import { roleService } from "../service/role.service";

export function getAllRole() {
  return useQuery({
    queryKey: ["roles", "all"],
    queryFn: () => roleService.getAllRoleApi(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
}