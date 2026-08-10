import api from "@/services/api";
import { createReviewType, updateReviewType } from "../validation/reviews.validate";

export const reviewService = {
  createReview: async (data: createReviewType) => {
    const res = await api.post("/reviews", data);
    return res.data.data;
  },

  updateReview: async (data: updateReviewType, id: string) => {
    const res = await api.patch(`/reviews/${id}`, data);
    return res.data.data;
  },

  deleteReview: async (id: string) => {
    const res = await api.delete(`/reviews/${id}`);
    return res.data.data;
  },

  getMyReviews: async (params?: { page?: number; limit?: number; status?: string }) => {
    const res = await api.get("/reviews/me", { params });
    return res.data.data;
  },

  getHotelReviews: async (hotelId: string, params?: { page?: number; limit?: number }) => {
    const res = await api.get(`/reviews/hotel/${hotelId}`, { params });
    return res.data.data;
  },

};