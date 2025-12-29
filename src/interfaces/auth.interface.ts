import { IUser, PublicUserDto } from "./user.interface";

// Request DTOs (Data Transfer Objects)
export interface RegisterRequestDto {
  email: string;
  username: string;
  password: string;
  profilePicture?: string;
  role?: string; // Optional role name (e.g., 'user', 'admin')
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface ForgotPasswordRequestDto {
  email: string;
}

export interface VerifyOtpRequestDto {
  email: string;
  otp: string;
}

export interface ResetPasswordRequestDto {
  resetToken: string;
  newPassword: string;
  confirmPassword?: string; // Optional for validation
}

// Response DTOs
export interface LoginResponseDto {
  user: PublicUserDto;
  token?: string;
}

export interface VerifyOtpResponseDto {
  resetToken: string;
  message: string;
  expiresIn: string;
}

// Internal service types
export interface ResetTokenPayload {
  sub: string;
  type: "password-reset";
  email: string;
  iat?: number;
  exp?: number;
}

export interface AccessTokenPayload {
  sub: string;
  role?: string; // role name (user/admin) for token payload
  iat?: number;
  exp?: number;
}
