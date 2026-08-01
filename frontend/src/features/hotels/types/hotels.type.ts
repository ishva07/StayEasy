export interface HotelResponse<T>{
   data:T[];
   total:number;
   page:number;
   limit:number;
   totalPage:number;
}

export interface Hotel {
    id: string;
    name: string;
    description: string;
    city: string;
    address: string;
    isFeatured: boolean;
    heroImage: string;  
    createdAt: string;
    updatedAt: string;
}