import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";
import { comparePassword, hashPassword } from "../../utils/bcrypt";
import { LoginUserInterface, RegisterUserInterface } from "./auth.type";
import { generateToken } from '../../utils/jwt';

export const registerAuthService = async(data:RegisterUserInterface)=>{
    const emailExist = await prisma.user.findFirst({where:{email:data.email}});
    if(emailExist)
        throw new ApiError(409,"email already exist")

    const userRole = await prisma.role.findFirst({where:{name:"user"}});
    if(!userRole)
        throw new ApiError(404,"No user rile exist, run seeder first..")

    const hashedPassword = await hashPassword(data.password);
    const newUser = await prisma.user.create({data:{email:data.email,password:hashedPassword,roleId:userRole.id}})
    return{
        email: newUser.email,
        roleId:newUser.roleId
    }
}

export const loginAuthService = async(data:LoginUserInterface)=>{
    const emailExist = await prisma.user.findFirst({where:{email:data.email}});
    if(!emailExist)
        throw new ApiError(404,"email not already exist, please register first")

    const verifiedPassword = await comparePassword(data.password,emailExist.password)
    if(!verifiedPassword)
        throw new ApiError(400,"incorrect password..")

    const userData = await prisma.user.findFirst({where:{email:emailExist.email}});
   
    const token = generateToken({userId:userData?.id,roleId:userData?.roleId});

    return {
        token,
        userData
    }
}