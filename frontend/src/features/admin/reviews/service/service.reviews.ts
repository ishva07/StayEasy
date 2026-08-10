import api from "@/services/api";

export const reviewService = {
  getAllReviews: async (params?: { page?: number; limit?: number; status?: string }) => {
    const res = await api.get("/reviews", { params });
    return res.data.data;
  },

  updateReviewStatus: async (status: "PUBLISH" | "REJECT", id: string) => {
    const res = await api.patch(`/reviews/update-status/${id}`, { status });
    return res.data.data;
  },
};