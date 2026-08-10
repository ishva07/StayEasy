export interface createReviewInput{
    rating:number;
    comment?:string;
    bookingId: string;
    userId:string;
}

export interface editReviewInput{
    rating?:number;
    comment?:string;
}

