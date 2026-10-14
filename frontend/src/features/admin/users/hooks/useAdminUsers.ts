import { useQuery } from "@tanstack/react-query";
import { usersService } from "../service/users.service";

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: usersService.getAllUsers,
  });
}
