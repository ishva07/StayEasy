import { useQuery } from "@tanstack/react-query";
import { rolesService } from "../service/roles.service";

export function useRolesAndPermissions() {
  return useQuery({
    queryKey: ["admin-roles"],
    queryFn: rolesService.getRolesAndPermissions,
  });
}
