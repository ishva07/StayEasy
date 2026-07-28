import api from "@/services/api";
import {   Hotel, HotelResponse } from '../types/hotel.types';
import { createHotelInputData, editHotelInputData } from "../validation/hotel.validation";

export const hotelService = {
    createHotelService : async(data:createHotelInputData):Promise<Hotel> =>{
        const formData = new FormData();

        formData.append("name",data.name);
        formData.append("description",data.description);
        formData.append("city",data.city);
        formData.append("address",data.address);
        if(data.isFeatured)
        formData.append("isFeatured",String(data.isFeatured));
        if(data.heroImage){
            formData.append("heroImage",data.heroImage)
        }
        if(data.amenitiesIds?.length){
            formData.append("amenitiesId",JSON.stringify(data.amenitiesIds))
        }
        if(data.imageGallery?.length){
            data.imageGallery.forEach((file)=>{
                formData.append("imageGallery",file)
            })
        }

        const response = await api.post("/hotels",formData)
        return response?.data?.data;
    },

    editHotelsService : async(hotelId:string,data:editHotelInputData) =>{
        const formData = new FormData();
        if(data.name) formData.append("name",data.name);
        if(data.description) formData.append("description",data.description);
        if(data.city) formData.append("city",data.city);
        if(data.address) formData.append("address",data.address);
        if(data.isFeatured != undefined)
            formData.append("isFeatured",String(data.isFeatured))
        if(data.heroImage)formData.append("heroImage",data.heroImage);
         if(data.amenitiesIds?.length){
            formData.append("amenitiesId",JSON.stringify(data.amenitiesIds))
        }
        if(data.imageGallery?.length){
            data.imageGallery.forEach((file)=>{
                formData.append("imageGallery",file)
            })
        }
        const response = await api.patch(`/hotels/${hotelId}`,formData);
        return response.data.data;
    },

    deleteHotelService: async(hotelId:string) =>{
        const response = await api.delete(`/hotels/${hotelId}`);
        return response.data.data
    },

    getHotelService : async({page=1,limit=10,sortBy="createdAt",order="desc"}:{
        page?: number;
        limit?: number;
        sortBy?: string;
        order?: string;
    }):Promise<HotelResponse<Hotel>> =>{
        const response = await api.get("/hotels",{params:{page,limit,sortBy,order}});
        return response.data.data;
    },

     getHotelByIdService : async(hotelId:string) =>{
        const response = await api.get(`/hotels/${hotelId}`);
        return response.data.data;
    },
}