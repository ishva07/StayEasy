import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";
import { comparePassword, hashPassword } from "../../utils/bcrypt";
import { LoginUserInterface, RegisterUserInterface } from "./auth.type";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../../utils/jwt";

const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

async function issueTokenPair(userId: string, roleId: string) {
  const accessToken = generateAccessToken({ userId, roleId });
  const refreshToken = generateRefreshToken({ userId });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
    },
  });

  return { accessToken, refreshToken };
}

export const registerAuthService = async (data: RegisterUserInterface) => {
  const emailExist = await prisma.user.findFirst({
    where: { email: data.email },
  });
  if (emailExist) throw new ApiError(409, "email already exist");

  const userRole = await prisma.role.findFirst({ where: { name: "user" } });
  if (!userRole)
    throw new ApiError(404, "No user rile exist, run seeder first..");

  const hashedPassword = await hashPassword(data.password);
  const newUser = await prisma.user.create({
    data: { email: data.email, password: hashedPassword, roleId: userRole.id },
  });
  return {
    email: newUser.email,
    roleId: newUser.roleId,
  };
};

export const loginAuthService = async (data: LoginUserInterface) => {
  const emailExist = await prisma.user.findFirst({
    where: { email: data.email },
  });
  if (!emailExist)
    throw new ApiError(404, "email not already exist, please register first");

  const verifiedPassword = await comparePassword(
    data.password,
    emailExist.password,
  );
  if (!verifiedPassword) throw new ApiError(400, "incorrect password..");

  const userData = await prisma.user.findFirst({
    where: { email: emailExist.email },
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

  await prisma.refreshToken.deleteMany({
    where: { userId: userData!.id },
  });

  const { accessToken, refreshToken } = await issueTokenPair(userData!.id, userData!.roleId);

  return {
    accessToken,
    refreshToken,
    userData: {
      id: userData?.id,
      email: userData?.email,
      role: userData?.role.name,
      permissions: userData?.role.permissions.map((permission: any) => permission.permission.name),
    },
  };
};

export const refreshAuthService = async (refreshTokenValue: string) => {
  let decoded;
  try {
    decoded = verifyToken(refreshTokenValue);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshTokenValue },
  });

  if (!storedToken) {
    throw new ApiError(401, "Refresh token not recognized — please log in again");
  }

  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    throw new ApiError(401, "Refresh token expired");
  }

  await prisma.refreshToken.delete({ where: { id: storedToken.id } });

  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user) throw new ApiError(404, "User not found");

  const { accessToken, refreshToken: newRefreshToken } = await issueTokenPair(user.id, user.roleId);

  return { accessToken, refreshToken: newRefreshToken };
};

export const logoutService = async (refreshTokenValue: string | undefined) => {
  if (refreshTokenValue) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshTokenValue } });
  }
};

export const meService = async (userId: string) => {
  const userExist = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: {
        include: {
          permissions: {
            include: { permission: true },
          },
        },
      },
    },
  });
  if (!userExist) throw new ApiError(404, "no user Found with this id..");

  const user = {
    id: userExist.id,
    email: userExist.email,
    role: userExist.role.name,
    permissions: userExist.role.permissions.map((permission: any) => permission.permission.name),
  };
  return user;
};