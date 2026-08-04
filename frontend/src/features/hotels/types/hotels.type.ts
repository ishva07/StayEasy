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
  cityId?: string | null;
  city?: {
    name: string;
  } | null;                   
  address?: string | null;
  heroImage?: string | null;
  propertyTypeId?: string | null;
  propertyType?: {
    name: string;
  } | null;                    
  isFeatured: boolean;
  hotelAmenities?: {
    id: string;
    amenities: { id: string; name: string };
  }[];
  imageGallery?: { id: string; url: string }[];
  createdAt?: string;
  updatedAt?: string;
}