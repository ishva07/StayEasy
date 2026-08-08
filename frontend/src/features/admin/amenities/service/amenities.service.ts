import api from "@/services/api";

export const amenityService = {
  getAllAmenitiesOptionService: async () => {
    const res = await api.get("/amenities/options");
    return res.data.data;
  },

  getAllAmenitiesService: async (page = 1, limit = 10) => {
    const res = await api.get("/amenities", {
      params: { page, limit },
    });
    return res.data.data;
  },
};