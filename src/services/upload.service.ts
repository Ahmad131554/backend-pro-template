import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/index.js";
import type { UploadProfilePictureResponseDto } from "../interfaces/user.interface.js";

export const uploadProfilePicture = async (
  userId: string, 
  file: Express.Multer.File
): Promise<UploadProfilePictureResponseDto> => {
  if (!file) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "No file uploaded");
  }

  // Update user's profile picture
  const user = await User.findByIdAndUpdate(
    userId,
    { profilePicture: file.filename },
    { new: true }
  );

  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
  }

  return {
    profilePictureUrl: `/uploads/profiles/${file.filename}`,
    filename: file.filename,
    size: file.size,
    mimetype: file.mimetype,
    uploadedBy: userId
  };
};

export const uploadDocument = async (
  userId: string,
  file: Express.Multer.File
) => {
  if (!file) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "No file uploaded");
  }

  return {
    documentUrl: `/uploads/documents/${file.filename}`,
    filename: file.filename,
    size: file.size,
    mimetype: file.mimetype,
    uploadedBy: userId
  };
};

export const uploadProfilePicturePublic = async (
  file: Express.Multer.File
) => {
  if (!file) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "No file uploaded");
  }

  return {
    profilePictureUrl: `/uploads/profiles/${file.filename}`,
    filename: file.filename,
    size: file.size,
    mimetype: file.mimetype,
    uploadedBy: ""
  };
};