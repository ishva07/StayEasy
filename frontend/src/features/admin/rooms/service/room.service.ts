import api from "@/services/api";
import { createRoomFormInput, updateRoomFormInput } from "../validation/rooms.validation";

export const roomServices = {
    createRoom : async(hotelId:string,data:createRoomFormInput) =>{
        const formData = new FormData();

        formData.append("name",data.name)
        formData.append("capacity",(data.capacity).toString())
        formData.append("roomImage",(data.roomImage))
        formData.append("price",(data.price).toString())

        const res = await api.post(`/hotels/${hotelId}/rooms`,formData);
        return res.data.data;
    },

      updateRoom : async(hotelId:string,data:updateRoomFormInput,roomId:string) =>{
        const formData = new FormData();

        if(data.name) formData.append("name",data.name)
        if(data.capacity) formData.append("capacity",(data.capacity).toString())
        if(data.roomImage) formData.append("roomImage",(data.roomImage))
        if(data.price) formData.append("price",(data.price).toString())

        const res = await api.patch(`/hotels/${hotelId}/rooms/${roomId}`,formData);
        return res.data.data;
    },

      deleteRoom : async(hotelId:string,roomId:string) =>{
        const res = await api.delete(`/hotels/${hotelId}/rooms/${roomId}`);
        return res.data.data;
    },

}