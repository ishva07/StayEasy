import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { loginAuthService, registerAuthService } from "./auth.service";
import ApiResponse from "../../utils/ApiResponse";
import ApiError from "../../utils/ApiError";

const isProd = process.env.NODE_ENV === "Production"

export const registerAuthController = asyncHandler(async(req:Request,res:Response)=>{
    const data = req.body;
    const newUser = await registerAuthService(data);
    res.status(201).json(new ApiResponse(true,"User created successfully.",newUser));
})

export const loginAuthController = asyncHandler(async(req:Request,res:Response)=>{
    const data = req.body;
    const {token, userData} = await loginAuthService(data);
    res.cookie("access_user",token,{httpOnly:true,sameSite:isProd?"none":"lax",secure:isProd,maxAge:5 *24 * 60*60*1000})
    res.status(200).json(new ApiResponse(true,"User login successfully.",userData));
})

export const logoutController = asyncHandler(async(req:Request,res:Response)=>{
    const token = req.cookies?.access_user
    if(!token)
        throw new ApiError(401,"Already logout")
    res.clearCookie("access_user");
        res.status(200).json(new ApiResponse(true,"User logout successfully."));
})