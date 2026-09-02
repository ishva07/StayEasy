import { useQuery } from "@tanstack/react-query";
import { roleService } from "../service/role.service";

interface GetRoleParams {
  page: number;
  limit: number;
  sortBy: string;
  order: string;
}

const defaultParams: GetRoleParams = {
  page: 1,
  limit: 10,
  sortBy: "name",
  order: "asc",
};

export function getRole(params: GetRoleParams = defaultParams) {
  return useQuery({
    queryKey: ["roles", params],
    queryFn: () => roleService.getRoleApi(params),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
}