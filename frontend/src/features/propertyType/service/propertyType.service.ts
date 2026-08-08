import api from "@/services/api";

export const propertyTypeService = {
  getPropertyTypeApi: async () => {
    const res = await api.get("/property-type");
    return res.data.data;
  },
};