import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/index.js";

export const getUserProfile = async (userId: string) => {
  const user = await User.findById(userId)
    .select('-password -resetPasswordOtp -resetPasswordOtpExpiry')
    .populate('role');
  
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
  }

  return user;
};

export const updateUserProfile = async (userId: string, updateData: Partial<{ username: string; email: string }>) => {
  // Check if email or username already exists for other users
  if (updateData.email || updateData.username) {
    const existingUser = await User.findOne({
      _id: { $ne: userId },
      $or: [
        ...(updateData.email ? [{ email: updateData.email }] : []),
        ...(updateData.username ? [{ username: updateData.username }] : [])
      ]
    });

    if (existingUser) {
      if (existingUser.email === updateData.email) {
        throw new ApiError(409, "Email already exists");
      }
      if (existingUser.username === updateData.username) {
        throw new ApiError(409, "Username already exists");
      }
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select('-password -resetPasswordOtp -resetPasswordOtpExpiry').populate('role');

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};