import User from "../models/user.model";
import Role from "../models/role.model";
import ApiError from "../utils/ApiError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env.config";
import { HTTP_STATUS, TOKEN_EXPIRES, OTP_CONFIG } from "../constants/index";
import AppLogger from "../library/logger";
import emailService from "./email.service";
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
  AccessTokenPayload,
} from "../interfaces";

interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

const generateAccessToken = (userId: string): string => {
  return jwt.sign({ sub: userId } as AccessTokenPayload, env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRES.ACCESS_TOKEN,
  });
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
  const { password, resetPasswordOtp, resetPasswordOtpExpiry, ...publicUser } =
    userObject;
  return {
    _id: userObject._id.toString(),
    ...publicUser,
  };
};

export const register = async (
  userData: RegisterRequestDto
): Promise<LoginResponseDto> => {
  const { email, username, password } = userData;
  const profilePicture =
    userData.profilePicture && userData.profilePicture.trim() !== ""
      ? userData.profilePicture
      : null;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Email already exists");
    }
    if (existingUser.username === username) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Username already exists");
    }
  }

  // Get default user role (always 'user' for public registration)
  const userRole = await Role.findOne({ name: "user" });
  if (!userRole) {
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Default user role not found"
    );
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create new user
  const user = new User({
    email,
    username,
    password: hashedPassword,
    role: userRole._id,
    profilePicture,
  });

  await user.save();

  // Populate role field to return in response
  await user.populate("role");

  AppLogger.auth("New user registered", user._id.toString(), {
    username,
    email,
    profilePicture,
    role: "user",
  });

  return {
    user: sanitizeUser(user),
  };
};

export const login = async (
  loginData: LoginRequestDto
): Promise<LoginResponseDto> => {
  const { email, password } = loginData;

  // Find user by email with role populated
  const user = await User.findOne({ email })
    .select("+password")
    .populate("role");
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
    token,
  };
};

export const forgotPassword = async (
  requestData: ForgotPasswordRequestDto
): Promise<{ message: string }> => {
  const { email } = requestData;
  console.log("Got forget pass req for this email--->", email);

  const user = await User.findOne({ email });
  console.log("user fetched from database--->", user);
  if (!user) {
    // For security, don't reveal if email exists or not
    return {
      message:
        "If an account with this email exists, you will receive a password reset OTP",
    };
  }

  // Generate OTP
  const otp = Math.floor(
    Math.pow(10, OTP_CONFIG.LENGTH - 1) +
      Math.random() * 9 * Math.pow(10, OTP_CONFIG.LENGTH - 1)
  ).toString();
  const otpExpiry = new Date(
    Date.now() + OTP_CONFIG.EXPIRY_MINUTES * 60 * 1000
  );

  // Save OTP to user
  user.resetPasswordOtp = otp;
  user.resetPasswordOtpExpiry = otpExpiry;
  await user.save();

  // Send OTP via email service
  try {
    const emailSent = await emailService.sendOTPEmail(
      email,
      otp,
      user.username
    );

    if (!emailSent) {
      AppLogger.error("Failed to send OTP email", { email, userId: user._id });
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Failed to send email. Please try again."
      );
    }

    AppLogger.info("Password reset OTP sent", {
      email,
      userId: user._id,
      otpExpiry,
    });

    return {
      message: "Password reset OTP sent to your email",
    };
  } catch (error) {
    // Clear OTP if email sending fails
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpiry = undefined;
    await user.save();

    if (error instanceof ApiError) {
      throw error;
    }

    AppLogger.error(
      "Email service error during forgot password",
      error as Error
    );
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Unable to send email at this time. Please try again later."
    );
  }
};

export const verifyOtp = async (
  verifyData: VerifyOtpRequestDto
): Promise<VerifyOtpResponseDto> => {
  const { email, otp } = verifyData;

  const user = await User.findOne({
    email,
    resetPasswordOtp: otp,
    resetPasswordOtpExpiry: { $gt: new Date() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  // Clear OTP
  user.resetPasswordOtp = undefined;
  user.resetPasswordOtpExpiry = undefined;
  await user.save();

  // Generate reset token
  const resetToken = generatePasswordResetToken(
    user._id.toString(),
    user.email
  );

  return {
    resetToken,
    message: "OTP verified successfully",
    expiresIn: "10 minutes",
  };
};

export const resetPassword = async (
  resetData: ResetPasswordRequestDto
): Promise<ResetPasswordResponse> => {
  const { resetToken, newPassword } = resetData;

  try {
    // Verify reset token
    const decoded = jwt.verify(
      resetToken,
      env.JWT_RESET_SECRET
    ) as ResetTokenPayload;

    const user = await User.findById(decoded.sub);
    if (!user || user.email !== decoded.email) {
      throw new ApiError(400, "Invalid reset token");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    user.password = hashedPassword;
    await user.save();

    // Send password reset confirmation email
    try {
      await emailService.sendPasswordResetConfirmation(
        user.email,
        user.username
      );
    } catch (error) {
      // Don't fail the password reset if email fails
      AppLogger.error("Failed to send password reset confirmation email", {
        userId: user._id,
        email: user.email,
        error,
      });
    }

    AppLogger.auth("Password reset successful", user._id.toString(), {
      email: user.email,
      timestamp: new Date(),
    });

    return {
      message: "Password reset successfully",
      success: true,
    };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(400, "Invalid or expired reset token");
    }
    throw error;
  }
};
