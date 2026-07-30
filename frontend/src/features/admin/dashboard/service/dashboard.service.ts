import api from "@/services/api";

export const dashboardApi = {
  statsApi: async () => {
    const res = await api.get("/dashboard/stats");
    return res.data.data;
  },
  monthlyBookingsApi: async (year?: number) => {
    const res = await api.get("/dashboard/monthly-bookings", { params: { year } });
    return res.data.data;
  },
  bookingStatus: async () => {
    const res = await api.get("/dashboard/booking-status");
    return res.data.data;
  },
  hotelList: async (page = 1, limit = 3) => {
    const res = await api.get("/hotels", { params: { page, limit, sortBy: "createdAt", order: "desc" } });
    return res.data.data;
  },
  bookingList: async (page = 1, limit = 3) => {
    const res = await api.get("/bookings", { params: { page, limit, sortBy: "createdAt", order: "desc" } });
    return res.data.data;
  },
};