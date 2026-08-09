import api from "@/services/api";

export const cityService = {
     getCityApi : async() =>{
        const res = await api.get("/city");
        return res.data.data;
    },
}