import { NextFunction, Request,Response } from "express";
import ApiError from "../utils/ApiError";

const errorMiddleware = (err:ApiError, req:Request,res:Response,next:NextFunction) =>{
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success:false,
        message:err.message || "Internal server error"
    })
}

export default errorMiddleware;