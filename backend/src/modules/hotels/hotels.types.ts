export interface CreateHotelInterface{
    name:string;
    description:string;
    cityId: string;
    address:string;
    isFeatured:boolean;
    heroImage:string;
    amenitiesIds:string[];
    imageGallery:string[];
    propertyTypeId:string;
}

export interface UpdateHotelInterface{
    name?:string;
    description?:string;
    cityId?: string;
    address?:string;
    isFeatured?:boolean;
    heroImage?:string;
    propertyTypeId?:string;
}