import jwt from "jsonwebtoken";
import env from "../config/env";

export const generateToken = (payload:{userId:string|undefined,roleId:string|undefined}) =>{
    return jwt.sign(payload, env.JWT_SECRET,{expiresIn:"7d"});
}

export const verifyToken = (token:string): {userId:string,roleId:string}=>{
    return jwt.verify(token, env.JWT_SECRET) as {userId:string,roleId:string};
}