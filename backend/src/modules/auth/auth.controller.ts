import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import {
  loginAuthService,
  logoutService,
  meService,
  refreshAuthService,
  registerAuthService,
} from "./auth.service";
import ApiResponse from "../../utils/ApiResponse";
import ApiError from "../../utils/ApiError";

const isProd = process.env.NODE_ENV === "Production";

const accessTokenCookieOptions = {
  httpOnly: true,
  sameSite: isProd ? ("none" as const) : ("lax" as const),
  secure: isProd,
  maxAge: 15 * 60 * 1000,
  path: "/",
};

const refreshTokenCookieOptions = {
  httpOnly: true,
  sameSite: isProd ? ("none" as const) : ("lax" as const),
  secure: isProd,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/api/v1/auth/refresh",
};

export const registerAuthController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body;
    const newUser = await registerAuthService(data);
    res
      .status(201)
      .json(new ApiResponse(true, "User created successfully.", newUser));
  },
);

export const loginAuthController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body;
    const { accessToken, refreshToken, userData } = await loginAuthService(data);
    res.cookie("access_token", accessToken, accessTokenCookieOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);
    res
      .status(200)
      .json(new ApiResponse(true, "User login successfully.", userData));
  },
);

export const refreshController = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) throw new ApiError(401, "No refresh token provided");

    const { accessToken, refreshToken: newRefreshToken } = await refreshAuthService(refreshToken);
    res.cookie("access_token", accessToken, accessTokenCookieOptions);
    res.cookie("refresh_token", newRefreshToken, refreshTokenCookieOptions);
    res.status(200).json(new ApiResponse(true, "Token refreshed successfully."));
  },
);

export const logoutController = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refresh_token;
    await logoutService(refreshToken);
    res.clearCookie("access_token", { path: "/" });
    res.clearCookie("refresh_token", { path: "/api/v1/auth/refresh" });
    res.status(200).json(new ApiResponse(true, "User logout successfully."));
  },
);

export const meController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const user = await meService(userId);
    res
      .status(200)
      .json(new ApiResponse(true, "User data fetched successfully.", user));
  },
);