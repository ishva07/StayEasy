import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";
import { verifyToken } from "../utils/jwt";
import prisma from "../config/db";

export const authenticate = ()=> async ( req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.access_user;

    if (!token) throw new ApiError(401, "user not Logged in");

    const decodedToken = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if(!user)
        throw new ApiError(404,"user Not Found")
    req.user = {
      id: user?.id,
      email: user?.email,
      roleId: user?.roleId,
      role: {
        name: user?.role.name,
        permissions: user?.role.permissions.map((rp: any) => ({
          permission: {
            id: rp.permission.id,
            name: rp.permission.name,
          },
        })),
      },
    };
    next();
  } catch (error) {
    next(error);
  }
};
