import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../service/dashboard.service";

export const useDashboardOverview = () => {
  const statsQuery = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardApi.statsApi,
  });

  const monthlyQuery = useQuery({
    queryKey: ["dashboard-monthly-bookings"],
    queryFn: () => dashboardApi.monthlyBookingsApi(),
  });

  const statusQuery = useQuery({
    queryKey: ["dashboard-booking-status"],
    queryFn: dashboardApi.bookingStatus,
  });

  return {
    stats: statsQuery.data,
    monthlyBookings: monthlyQuery.data ?? [],
    bookingStatus: statusQuery.data ?? [],
    isLoading: statsQuery.isLoading || monthlyQuery.isLoading || statusQuery.isLoading,
    isError: statsQuery.isError || monthlyQuery.isError || statusQuery.isError,
  };
};