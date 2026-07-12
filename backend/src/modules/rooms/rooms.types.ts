import { Decimal } from "@prisma/client/runtime/library";

export interface CreateRoomInterface{
    name:string;
    capacity:number;
    price:Decimal;
    roomImage?:string | null;
    hotelId:string;
}

export interface UpdateRoomInterface{
    name?:string;
    capacity?:number;
    price?:Decimal;
    roomImage?:string;
    hotelId?:string;
}