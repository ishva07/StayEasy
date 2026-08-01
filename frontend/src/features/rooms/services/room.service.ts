import api from "@/services/api";

export const roomServices = {
      getRoomService : async(hotelId:string,page=1,limit=10,sortBy="createdAt",order="desc") =>{
        const res = await api.get(`/hotels/${hotelId}/rooms`,{params:{page,limit,sortBy,order}});
        return res.data.data;
    },
      getRoomByIdService : async(hotelId:string,roomId:string) =>{
        const res = await api.get(`/hotels/${hotelId}/rooms/${roomId}`);
        return res.data.data;
    }
}