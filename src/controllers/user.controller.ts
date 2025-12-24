import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { apiResponse } from "../utils/apiResponse";
import { userService } from "../services";

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const result = await userService.getUserProfile(userId!);

  res
    .status(200)
    .json(apiResponse(200, result, "Profile retrieved successfully"));
});

export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const updateData = req.body;

    const result = await userService.updateUserProfile(userId!, updateData);

    res
      .status(200)
      .json(apiResponse(200, result, "Profile updated successfully"));
  }
);
