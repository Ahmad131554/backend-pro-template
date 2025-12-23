import type { IUser } from "../models/user.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env.config.js";
import { HTTP_STATUS, TOKEN_EXPIRES, OTP_CONFIG } from "../constants/index.js";
import AppLogger from "../library/logger.js";
import type {
  RegisterRequestDto,
  LoginRequestDto,
  LoginResponseDto,
  ForgotPasswordRequestDto,
  VerifyOtpRequestDto,
  VerifyOtpResponseDto,
  ResetPasswordRequestDto,
  ResetTokenPayload,
  PublicUserDto,
  AccessTokenPayload
} from "../interfaces/auth.interface.js";

interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

const generateAccessToken = (userId: string): string => {
  return jwt.sign({ sub: userId } as AccessTokenPayload, env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES.ACCESS_TOKEN });
};

const generatePasswordResetToken = (userId: string, email: string): string => {
  return jwt.sign(
    { sub: userId, type: "password-reset", email } as ResetTokenPayload,
    env.JWT_RESET_SECRET,
    { expiresIn: TOKEN_EXPIRES.RESET_TOKEN }
  );
};

const sanitizeUser = (user: any): PublicUserDto => {
  const userObject = user.toObject ? user.toObject() : user;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, resetPasswordOtp, resetPasswordOtpExpiry, ...publicUser } = userObject;
  return {
    ...publicUser,
    _id: userObject._id.toString()
  };
};

export const register = async (userData: RegisterRequestDto): Promise<LoginResponseDto> => {
  const { email, username, password } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Email already exists");
    }
    if (existingUser.username === username) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Username already exists");
    }
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create new user
  const user = new User({
    email,
    username,
    password: hashedPassword,
  });

  await user.save();
  
  AppLogger.auth("New user registered", user._id.toString(), { 
    username, 
    email 
  });

  // Generate access token
  const token = generateAccessToken(user._id.toString());

  return {
    user: sanitizeUser(user),
    token
  };
};

export const login = async (loginData: LoginRequestDto): Promise<LoginResponseDto> => {
  const { email, password } = loginData;

  // Find user by email
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
  }

  // Generate access token
  const token = generateAccessToken(user._id.toString());

  return {
    user: sanitizeUser(user),
    token
  };
};

export const forgotPassword = async (requestData: ForgotPasswordRequestDto): Promise<{ message: string }> => {
  const { email } = requestData;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found with this email");
  }

  // Generate OTP
  const otp = Math.floor(Math.pow(10, OTP_CONFIG.LENGTH - 1) + Math.random() * 9 * Math.pow(10, OTP_CONFIG.LENGTH - 1)).toString();
  const otpExpiry = new Date(Date.now() + OTP_CONFIG.EXPIRY_MINUTES * 60 * 1000);

  // Save OTP to user
  user.resetPasswordOtp = otp;
  user.resetPasswordOtpExpiry = otpExpiry;
  await user.save();

  // TODO: Send OTP via email service
  // In production, implement proper email service
  // console.log(`Password reset OTP for ${email}: ${otp}`);

  return {
    message: "Password reset OTP sent to your email"
  };
};

export const verifyOtp = async (verifyData: VerifyOtpRequestDto): Promise<VerifyOtpResponseDto> => {
  const { email, otp } = verifyData;

  const user = await User.findOne({
    email,
    resetPasswordOtp: otp,
    resetPasswordOtpExpiry: { $gt: new Date() }
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  // Clear OTP
  user.resetPasswordOtp = undefined;
  user.resetPasswordOtpExpiry = undefined;
  await user.save();

  // Generate reset token
  const resetToken = generatePasswordResetToken(user._id.toString(), user.email);

  return {
    resetToken,
    message: "OTP verified successfully",
    expiresIn: "10 minutes"
  };
};

export const resetPassword = async (resetData: ResetPasswordRequestDto): Promise<ResetPasswordResponse> => {
  const { resetToken, newPassword } = resetData;

  try {
    // Verify reset token
    const decoded = jwt.verify(resetToken, env.JWT_RESET_SECRET) as ResetTokenPayload;

    const user = await User.findById(decoded.sub);
    if (!user || user.email !== decoded.email) {
      throw new ApiError(400, "Invalid reset token");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    user.password = hashedPassword;
    await user.save();

    return {
      message: "Password reset successfully",
      success: true
    };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(400, "Invalid or expired reset token");
    }
    throw error;
  }
};