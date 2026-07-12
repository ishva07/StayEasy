import { includes } from './../../node_modules/effect/src/RuntimeFlagsPatch';
import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";

export const hasPermission = (...requiredPermissions:string[])=>
(req:Request,res:Response,next:NextFunction) =>{
    const user = req?.user;

    if(!user)
        throw new ApiError(401,"User Not Logged In.");

    const userPermissions = user.role.permissions.map((rp:any)=>rp.permission.name);

    const hasPermissions = userPermissions.includes(requiredPermissions);

    if(!hasPermissions)
        throw new ApiError(403,"User does not have permissions to access this.");

    next();
}