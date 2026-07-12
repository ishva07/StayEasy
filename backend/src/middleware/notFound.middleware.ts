import {Request,Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";

const notFoundMiddleware = (req:Request,res:Response,next:NextFunction) =>{
    next(new ApiError(404, "Route Not Found.."));
}

export default notFoundMiddleware;