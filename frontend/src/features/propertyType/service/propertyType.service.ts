import api from "@/services/api";

interface GetPropertyTypeParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: string;
}

export const propertyTypeService = {
   getAllPropertyTypeApi: async () => {
    const res = await api.get("/property-type/all");
    return res.data.data;
  },
   getPropertyTypeApi: async (params: GetPropertyTypeParams) => {
    const res = await api.get("/property-type", { params });
    return res.data.data;
  },
};