import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../service/dashboard.service";

export const useRecentActivity = () => {
  const hotelsQuery = useQuery({
    queryKey: ["recent-hotels"],
    queryFn: () => dashboardApi.hotelList(1, 3),
  });

  const bookingsQuery = useQuery({
    queryKey: ["recent-bookings"],
    queryFn: () => dashboardApi.bookingList(1, 3),
  });

  return {
    recentHotels: hotelsQuery.data?.data ?? [],
    recentBookings: bookingsQuery.data?.data ?? [],
    isLoading: hotelsQuery.isLoading || bookingsQuery.isLoading,
    isError: hotelsQuery.isError || bookingsQuery.isError,
  };
};