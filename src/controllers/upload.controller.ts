import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { apiResponse } from "../utils/apiResponse";
import { uploadService } from "../services";

export const uploadProfilePicture = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const file = req.file;

    const result = await uploadService.uploadProfilePicture(userId!, file!);

    res
      .status(200)
      .json(apiResponse(200, result, "Profile picture uploaded successfully"));
  }
);

export const uploadDocument = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const file = req.file;

    const result = await uploadService.uploadDocument(userId!, file!);

    res
      .status(200)
      .json(apiResponse(200, result, "Document uploaded successfully"));
  }
);

export const uploadProfilePicturePublic = asyncHandler(
  async (req: Request, res: Response) => {
    const file = req.file;

    const result = await uploadService.uploadProfilePicturePublic(file!);

    res
      .status(200)
      .json(apiResponse(200, result, "Profile picture uploaded successfully"));
  }
);