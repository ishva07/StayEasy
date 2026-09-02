import { useQuery } from "@tanstack/react-query";
import { userService } from "../service/user.service";

interface GetUserParams {
  page: number;
  limit: number;
  sortBy: string;
  order: string;
}

const defaultParams: GetUserParams = {
  page: 1,
  limit: 10,
  sortBy: "email",
  order: "asc",
};

export function getUser(params: GetUserParams = defaultParams) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => userService.getUserApi(params),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
}