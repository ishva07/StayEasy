// export interface CreateHotelInput{
//     name:string;
//     description:string;
//     city:string;
//     address:string;
//     heroImage?: File;
//     isFeatured:boolean ;
//     amenitiesIds:string[];
//     imageGallery:File[];
// }

// export interface EditHotelInput{
//     name?:string;
//     description?:string;
//     city?:string;
//     address?:string;
//     heroImage?:File | null;
//     isFeatured?:boolean;
//     amenitiesId?:string[];
//     imageGallery?:File[];
// }

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