import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { apiResponse } from "../utils/apiResponse";
import { authService } from "../services";
import type {
  RegisterRequestDto,
  LoginRequestDto,
  ForgotPasswordRequestDto,
  VerifyOtpRequestDto,
  ResetPasswordRequestDto
} from "../interfaces/auth.interface.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const userData: RegisterRequestDto = req.body;

  const result = await authService.register(userData);

  res
    .status(201)
    .json(apiResponse(201, result, "User registered successfully"));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const loginData: LoginRequestDto = req.body;

  const result = await authService.login(loginData);

  res.status(200).json(apiResponse(200, result, "User logged in successfully"));
});

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const requestData: ForgotPasswordRequestDto = req.body;

    const result = await authService.forgotPassword(requestData);

    res
      .status(200)
      .json(apiResponse(200, result, "Password reset OTP sent successfully"));
  }
);

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const verifyData: VerifyOtpRequestDto = req.body;

  const result = await authService.verifyOtp(verifyData);

  res.status(200).json(apiResponse(200, result, "OTP verified successfully"));
});

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const resetData: ResetPasswordRequestDto = req.body;

    const result = await authService.resetPassword(resetData);

    res
      .status(200)
      .json(apiResponse(200, result, "Password reset successfully"));
  }
);
