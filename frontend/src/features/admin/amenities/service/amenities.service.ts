import api from "@/services/api";

export const amenityService = {
    getAllAmenitiesOptionService :async () =>{
        const res = await api.get("/amenities/options");
        return res.data.data;
    }
}