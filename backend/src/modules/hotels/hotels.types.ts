export interface CreateHotelInterface{
    name:string;
    description:string;
    city: string;
    address:string;
    isFeatured:boolean;
    heroImage:string;
}

export interface UpdateHotelInterface{
    name?:string;
    description?:string;
    city?: string;
    address?:string;
    isFeatured?:boolean;
    heroImage?:string;
}