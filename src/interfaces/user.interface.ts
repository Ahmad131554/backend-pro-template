import { IRole } from "./role.interface";

export interface IUser {
  _id?: string;
  username: string;
  email: string;
  password: string; // bcrypt hash
  role: IRole; // reference to Role model
  profilePicture?: string | null; // optional profile picture filename

  // Password reset (OTP) - optional
  resetPasswordOtp?: string;
  resetPasswordOtpExpiry?: Date;

  // timestamps (added by Mongoose when timestamps: true)
  createdAt?: Date;
  updatedAt?: Date;
}

// User-related DTOs and response types
export interface UploadProfilePictureResponseDto {
  profilePictureUrl: string;
  filename: string;
  size: number;
  mimetype: string;
  uploadedBy?: string;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  role: {
    _id: string;
    name: string;
    description?: string;
  };
}

export interface PublicUserDto extends Omit<
  IUser,
  "password" | "resetPasswordOtp" | "resetPasswordOtpExpiry"
> {
  _id: string;
}