import api from "@/services/api";

export const cityService = {
      getCityApi : async(params?: {
          page: number;
          limit: number;
          sortBy: string;
          order: string;
      }) =>{
        const res = await api.get("/city", { params });
        return res.data.data;
    },
    getAllCityApi: async () => {
        const res = await api.get("/city/all");
        return res.data.data;
    },
}