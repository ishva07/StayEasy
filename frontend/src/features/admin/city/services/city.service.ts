import api from "@/services/api";

export const cityService = {
    createCityApi : async(name:string,cityImage:File) =>{
        const formData = new FormData();
        formData.append("name",name);
        formData.append("cityImage",cityImage);
        const res = await api.post("/city",formData);
        return res.data.data;
    },
     editCityApi : async(cityId?:string,name?:string,cityImage?:File) =>{
        const formData = new FormData();
        if(name)
            formData.append("name",name);
        if(cityImage)
            formData.append("cityImage",cityImage);
        const res = await api.put(`/city/${cityId}`,formData);
        return res.data.data;
    },
     deleteCityApi : async(cityId:string) =>{
        const res = await api.delete(`/city/${cityId}`);
        return res.data.data;
    },
     getCityApi : async() =>{
        const res = await api.get("/city");
        return res.data.data;
    },
}