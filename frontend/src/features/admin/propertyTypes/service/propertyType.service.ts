import api from "@/services/api";

export const propertyTypeService = {
  createPropertyTypeApi: async (name: string, propertyTypeImage: File) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("propertyTypeImage", propertyTypeImage);
    const res = await api.post("/property-type", formData);
    return res.data.data;
  },
  editPropertyTypeApi: async (propertyTypeId: string, name?: string, propertyTypeImage?: File) => {
    const formData = new FormData();
    if (name) formData.append("name", name);
    if (propertyTypeImage) formData.append("propertyTypeImage", propertyTypeImage);
    const res = await api.put(`/property-type/${propertyTypeId}`, formData);
    return res.data.data;
  },
  deletePropertyTypeApi: async (propertyTypeId: string) => {
    const res = await api.delete(`/property-type/${propertyTypeId}`);
    return res.data.data;
  },
  getPropertyTypeApi: async () => {
    const res = await api.get("/property-type");
    return res.data.data;
  },
};