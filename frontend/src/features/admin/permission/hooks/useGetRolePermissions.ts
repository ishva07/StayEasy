import { useQuery } from "@tanstack/react-query";
import { permissionService } from "../service/permission.service";

export function getRolePermissions(roleId: string | null) {
  return useQuery({
    queryKey: ["role-permissions", roleId],
    queryFn: () => permissionService.getRolePermissionsApi(roleId as string),
    enabled: !!roleId,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
}